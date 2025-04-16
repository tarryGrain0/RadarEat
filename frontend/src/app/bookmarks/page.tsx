'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Bookmark {
    id: number
    restaurant_id: string
    name: string
    logo_image?: string
    address: string
    access?: string
}

export default function BookmarkPage() {
    const router = useRouter()
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [error, setError] = useState('')
    const [authChecked, setAuthChecked] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const hasAuthToken = document.cookie.includes('authToken=')
        if (!hasAuthToken) {
            router.push('/login')
        } else {
            const fetchBookmarks = async () => {
                try {
                    const res = await fetch(`/api/bookmarks/list?page=${page}&per_page=10`)
                    if (!res.ok) throw new Error('ブックマークの取得に失敗しました')
                    const data = await res.json()
                    setBookmarks(data.shops)
                    setTotalPages(data.total_pages)
                } catch (err: any) {
                    setError(err.message)
                } finally {
                    setAuthChecked(true)
                }
            }
            fetchBookmarks()
        }
    }, [router, page])

    if (!authChecked) return null

    return (
        <div className="max-w-2xl mx-auto px-4 mt-10">
            <h1 className="text-2xl font-bold mb-4">ブックマーク一覧</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <ul className="space-y-2">
                {bookmarks.map((r) => {
                    const access = r.access || 'アクセス情報なし'
                    return (
                        <li key={r.id} className="border p-4 rounded shadow-sm flex items-start gap-4">
                            <div className="relative w-32 h-24 bg-gray-100 overflow-hidden rounded">
                                {!r.logo_image ? (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        画像なし
                                    </div>
                                ) : (
                                    <img
                                        src={r.logo_image}
                                        alt={r.name}
                                        className="absolute inset-0 w-full h-full object-contain m-auto"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                )}
                            </div>
                            <div>
                                <div className="font-semibold">
                                    <a href={`/detail/${r.id}`} className="hover:underline hover:text-blue-600">
                                        {r.name}
                                    </a>
                                </div>
                                <div className="text-sm text-gray-600 mt-5">住所：{r.address}</div>
                                <div className="text-sm text-gray-600 mt-1">アクセス：{access}</div>
                            </div>
                        </li>
                    )
                })}
            </ul>
            {bookmarks.length > 0 && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => {
                            setPage((prev) => Math.max(prev - 1, 1))
                            window.scrollTo(0, 0)
                        }}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded"
                    >
                        前へ
                    </button>
                    <span>{page} / {totalPages}</span>
                    <button
                        onClick={() => {
                            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                            window.scrollTo(0, 0)
                        }}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded"
                    >
                        次へ
                    </button>
                </div>
            )}
        </div>
    )
}