"use client"
import { useState } from 'react'
import SearchBar, { LocationSearchQuery } from './components/SearchBarComponent'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const [lastQuery, setLastQuery] = useState<LocationSearchQuery | null>(null)

  const fetchResults = async (query: LocationSearchQuery, page: number) => {
    const res = await fetch('http://localhost:3001/api/restaurant_searches/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: query.latitude,
        longitude: query.longitude,
        range: query.range,
        page,
      }),
    })
  }

  const handleSearch = (query: LocationSearchQuery) => {
    setLastQuery(query)
    router.push(`/search?latitude=${query.latitude}&longitude=${query.longitude}&range=${query.range}`);
  }

  return (
    <main>
      <section className="relative bg-cover bg-center min-h-screen w-full px-4"
      // style={{ backgroundImage: "url('/images/bg-main.png')" }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen">
          <div className='bg-white/40 mb-4 p-4 rounded-lg shadow-lg'>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5">
              日常に、小さな発見を
            </h1>
            <h2 className="text-base sm:text-3xl font-semibold text-gray-700">
              その場所から、あなたにぴったりの一軒へ
            </h2>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <div className="text-center max-w-2xl mx-auto text-gray-600">
        <p className="mb-2">
          Tabenaviは、あなたの近くのレストラン情報を素早く提供します。
        </p>
        <p>
          まだ出会ったことのないお店、料理との出会いを提供します。
        </p>
      </div>

      <section className="mt-16 px-4 text-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6">使い方</h2>
        <ul className="space-y-4 max-w-xl mx-auto text-gray-700">
          <li> 現在地を許可する</li>
          <li>食べたいジャンルや距離を選ぶ</li>
          <li>お店情報をチェックして出かけよう！</li>
        </ul>

        <div className="mt-12 text-center text-gray-700">
          <h3 className="text-xl font-semibold mb-2">ユーザー登録でさらに便利に</h3>
          <p>お気に入り保存や履歴確認などができるようになります</p>
        </div>
      </section>

    </main>
  )
}