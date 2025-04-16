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
            className="text-xs sm:text-2xl px-6 py-4 w-72 sm:w-96 bg-orange-500 text-white hover:text-orange-500 rounded mt-4 shadow-lg hover:bg-white rounded border-2 border-white hover:border-orange-400 transition duration-300"
          >
            近くのお店を探す
          </button>
        </div>
      </section>

      <div className="text-center max-w-2xl mx-auto text-gray-600 mt-12 space-y-6">
        <div className='py-5 text-base sm:text-xl font-bold text-gray-900'>
          <p className="mb-2">
            あなたの近くのレストラン情報を提供します。
          </p>
          <p>
            まだ出会ったことのないお店、料理との出会いを
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">使い方</h2>
          <div className="grid gap-4 md:grid-cols-3 text-left">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">📍</div>
              <p className="font-semibold mb-1">現在地を許可する</p>
              <p className="text-sm text-gray-600 text-center">位置情報を許可して、近くのお店を探しましょう。</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">🚶</div>
              <p className="font-semibold mb-1">距離を選ぶ</p>
              <p className="text-sm text-gray-600 text-center">現在地からの検索範囲を設定します。</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-3xl mb-2">📱</div>
              <p className="font-semibold mb-1">お店情報をチェック</p>
              <p className="text-sm text-gray-600 text-center">気になるお店の詳細情報を見て、お出かけしてみましょう！</p>
            </div>
          </div>
        </div>

        <div className='mb-5'>
          <h3 className="text-2xl font-semibold mb-2 mt-10">ユーザー登録でさらに便利に</h3>
          <p>お気に入り保存ができるようになります</p>
          <img src="/images/RaderEat_logo.png" alt="RaderEatロゴ画像" className="mx-auto mt-4 max-w-xs" />
        </div>
      </div>
    </main>
  )
}