"use client"
import { useRouter } from 'next/navigation'
import SearchBar, { LocationSearchQuery } from './components/SearchBarComponent'

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: LocationSearchQuery) => {
    const queryString = `?latitude=${query.latitude}&longitude=${query.longitude}&range=3&page=1`
    router.push(`/search${queryString}`)
  }

  const handleGeolocationSearch = () => {
    if (!navigator.geolocation) {
      alert('このブラウザでは位置情報が取得できません。')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const query: LocationSearchQuery = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          range: 1,
        }
        handleSearch(query)
      },
      (error) => {
        console.error('位置情報の取得に失敗しました:', error)
        alert('位置情報の取得に失敗しました。')
      }
    )
  }

  return (
    <main>
      <section className="relative bg-cover bg-center min-h-screen w-full px-4"
        style={{ backgroundImage: "url('/images/bg-main.png')" }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen">
          <div className='bg-white/40 mb-5 p-4 rounded-lg shadow-lg'>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5">
              日常に、小さな発見を
            </h1>
            <h2 className="text-base sm:text-3xl font-semibold text-gray-700">
              その場所から、あなたにぴったりの一軒へ
            </h2>
          </div>
          <button
            onClick={handleGeolocationSearch}
            className="text-sm sm:text-2xl px-6 py-4 w-72 sm:w-96 bg-orange-500 text-white hover:text-orange-500 rounded mt-4 shadow-lg hover:bg-white rounded border-2 border-white hover:border-orange-400 transition duration-300"
          >
            近くのお店を探す
          </button>
        </div>
      </section>

      <div className="text-center max-w-2xl mx-auto text-gray-600">
        <p className="mb-2">
          RaderEatは、あなたの近くのレストラン情報を素早く提供します。
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