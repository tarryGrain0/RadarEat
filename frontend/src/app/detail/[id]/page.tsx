'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type ShopDetail = {
    id: string
    name: string
    address: string
    access: string
    logo_image: string
    genre?: string | { name: string }
    sub_genre?: string | { name: string }
    budget?: string | { average: string }
    open?: string
    close?: string
    capacity?: string
    course?: string
    free_drink?: string
    free_food?: string
    private_room?: string
    card?: string
    non_smoking?: string
    parking?: string
    child?: string
    url?: string
}

export default function DetailPage() {
    const params = useParams()
    const [shop, setShop] = useState<ShopDetail | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [bookmarkError, setBookmarkError] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(document.cookie.includes('authToken='))
        const fetchShopDetail = async () => {
            try {
                const id = params.id
                const response = await fetch(`/api/restaurant_searches/${id}`)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data: ShopDetail = await response.json()
                setShop(data)

                const bookmarkRes = await fetch('/api/bookmarks')
                if (bookmarkRes.ok) {
                    const bookmarks = await bookmarkRes.json()
                    const bookmarked = bookmarks.some((b: any) => b.restaurant_id === data.id)
                    setIsBookmarked(bookmarked)
                }
            } catch (error) {
                setError('Failed to fetch shop details')
            }
        }

        fetchShopDetail()
    }, [params.id])

    if (error) return <p>{error}</p>
    if (!shop) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
            {shop.logo_image && (
                <div className="flex justify-center mb-4 bg-gray-600 rounded shadow border-2 border-white-500">
                    <img
                        src={shop.logo_image}
                        alt={shop.name}
                        className="max-w-xs w-full h-auto rounded shadow-lg"
                    />
                </div>
            )}
            {isLoggedIn && (
                <div className="flex justify-end mb-4">
                    <button
                        className={`px-4 py-2 rounded transition ${isBookmarked
                            ? 'bg-gray-400 text-white hover:bg-gray-500'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                        onClick={async () => {
                            try {
                                if (!isBookmarked) {
                                    const res = await fetch('/api/bookmarks', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ restaurant_id: shop.id }),
                                    })
                                    if (!res.ok) throw new Error()
                                    setIsBookmarked(true)
                                    setBookmarkError('')
                                } else {
                                    const bookmarksRes = await fetch('/api/bookmarks')
                                    const bookmarks = await bookmarksRes.json()
                                    const bookmark = bookmarks.find((b: any) => b.restaurant_id === shop.id)
                                    if (!bookmark) return
                                    const delRes = await fetch(`/api/bookmarks/${bookmark.id}`, {
                                        method: 'DELETE',
                                    })
                                    if (!delRes.ok) throw new Error()
                                    setIsBookmarked(false)
                                    setBookmarkError('')
                                }
                            } catch (e) {
                                setBookmarkError('ログインが必要です')
                            }
                        }}
                    >
                        {isBookmarked ? '★ 登録済み' : '☆ ブックマーク'}
                    </button>
                    {bookmarkError && <p className="text-red-500 mt-2">{bookmarkError}</p>}
                </div>
            )}
            <p className="mb-2 text-gray-700">住所: {shop.address}</p>
            <p className="mb-2 text-gray-700">アクセス: {shop.access}</p>
            {shop.url && (
                <p className="mb-4 text-blue-600 underline">
                    <a href={shop.url} target="_blank" rel="noopener noreferrer">
                        公式サイトを見る
                    </a>
                </p>
            )}
            <h2 className="text-xl font-semibold mt-8 mb-4">店舗詳細情報</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm sm:text-base">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 w-40 sm:w-48 text-left">項目</th>
                            <th className="border px-4 py-2 text-left">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['ジャンル', typeof shop.genre === 'object' ? shop.genre?.name : shop.genre],
                            ['サブジャンル', typeof shop.sub_genre === 'object' ? shop.sub_genre?.name : shop.sub_genre],
                            ['予算', typeof shop.budget === 'object' ? shop.budget.average : shop.budget],
                            ['営業時間', `${shop.open ?? ''}${shop.close ? ' - ' + shop.close : ''}`],
                            ['収容人数', shop.capacity],
                            ['コース', shop.course],
                            ['飲み放題', shop.free_drink],
                            ['食べ放題', shop.free_food],
                            ['個室', shop.private_room],
                            ['カード利用', shop.card],
                            ['禁煙', shop.non_smoking],
                            ['駐車場', shop.parking],
                            ['子供可', shop.child],
                        ].map(([label, value]) => (
                            <tr key={label}>
                                <td className="border px-4 py-2">{label}</td>
                                <td className="border px-4 py-2">{value || '情報なし'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}