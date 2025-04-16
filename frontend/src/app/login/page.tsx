'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let error = ''

        if (!value.trim()) {
            error = 'この項目は必須です'
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                error = 'メールアドレスの形式が正しくありません'
            }
        } else if (name === 'password') {
            const emojiRegex = /\p{Extended_Pictographic}/u
            if (value.length < 8) {
                error = 'パスワードは8文字以上で入力してください'
            } else if (emojiRegex.test(value)) {
                error = 'パスワードに絵文字は使用できません'
            }
        }

        setValidationErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setValidationErrors(prev => ({ ...prev, [e.target.name]: '' }))
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.email || !form.password) {
            setError('すべての項目を入力してください')
            return
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            })

            if (!res.ok) {
                const { error } = await res.json()
                throw new Error(error || 'ログインに失敗しました')
            }

            const { token } = await res.json()
            document.cookie = `authToken=${token}; path=/; max-age=604800`
            router.push('/search')
        } catch (err: any) {
            setError(err.message || 'ログインに失敗しました')
        }
    }

    return (
        <div className="flex flex-col items-center px-4 mt-10">
            <h1 className="text-2xl font-bold mb-6">ログイン</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="メールアドレス"
                    className="block border p-2 mb-2 w-full rounded"
                />
                {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="パスワード"
                    className="block border p-2 mb-4 w-full rounded"
                />
                {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
                <div className="flex justify-center">
                    <button type="submit" className="bg-orange-500 sm:w-90 text-white px-4 py-2 rounded">
                        ログイン
                    </button>
                </div>
            </form>
        </div>
    )
}