'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '', password_confirmation: '' })
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
        } else if (name === 'password_confirmation') {
            if (form.password !== value) {
                error = 'パスワードが一致しません'
            }
        }

        setValidationErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setValidationErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.email || !form.password || !form.password_confirmation) {
            setError('すべての項目を入力してください')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const emojiRegex = /\p{Extended_Pictographic}/u

        if (!emailRegex.test(form.email)) {
            setError('メールアドレスの形式が正しくありません')
            return
        }

        if (form.password.length < 8) {
            setError('パスワードは8文字以上で入力してください')
            return
        }

        if (emojiRegex.test(form.password)) {
            setError('パスワードに絵文字は使用できません')
            return
        }

        if (form.password !== form.password_confirmation) {
            setError('パスワードが一致しません')
            return
        }

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: form }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.errors?.join('、') || '登録に失敗しました')
            }

            // クッキーに保存（HttpOnlyではない）
            document.cookie = `authToken=${data.token}; path=/; max-age=604800`

            router.push('/search')
        } catch (err: any) {
            setError(err.message || '登録に失敗しました')
        }
    }

    return (
        <div className="flex flex-col items-center px-4 mt-10">
            <h1 className="text-2xl font-bold mb-6">新規登録</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <input name="email" onChange={handleChange} onBlur={handleBlur} placeholder="メール" className="block border p-2 mb-2 w-full" />
                {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                <input name="password" type="password" onChange={handleChange} onBlur={handleBlur} placeholder="パスワード" className="block border p-2 mb-2 w-full" />
                <input name="password_confirmation" type="password" onChange={handleChange} onBlur={handleBlur} placeholder="パスワード（確認）" className="block border p-2 mb-4 w-full" />
                {(validationErrors.password || validationErrors.password_confirmation) && (
                    <p className="text-red-500 text-sm">
                        {validationErrors.password || validationErrors.password_confirmation}
                    </p>
                )}
                <div className="flex justify-center">
                    <button type="submit" className="bg-orange-500 sm:w-90 text-white px-4 py-2 rounded">登録</button>
                </div>
            </form>
        </div>
    )
}