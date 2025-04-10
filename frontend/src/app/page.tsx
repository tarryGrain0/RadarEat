import React from 'react'
import SearchBar from './components/serchBar'

export default function Home() {
  return (
    <main className='bg-gray-100'>
      <section className="bg-gray-100 min-h-screen w-full bg-blue flex flex-col justify-center text-gray-700 items-center text-center px-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-orange-400 mb-4">
          日常に、小さな発見を
        </h1>
        <h2 className="text-1g sm:text-3xl font-semibold mb-10 sm:mb-20 text-gray-500">
          その場所から、あなたにぴったりの一軒へ
        </h2>

        <SearchBar />
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