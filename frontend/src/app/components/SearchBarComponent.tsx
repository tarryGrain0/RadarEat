'use client'

import { useState } from 'react'

export type LocationSearchQuery = {
  latitude: number
  longitude: number
  range: number
}

export default function SearchBarComponent({ onSearch }: { onSearch: (query: LocationSearchQuery) => void }) {
  const [error, setError] = useState('')
  const [range, setRange] = useState(3)

  const handleGeolocationSearch = () => {
    if (!navigator.geolocation) {
      setError('このブラウザは位置情報に対応していません')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setError('')


        onSearch({ latitude, longitude, range })
      },
      (err) => {
        setError('位置情報の取得に失敗しました')
        console.error('Geolocation error:', {
          code: err.code,
          message: err.message
        })
      }
    )
  }

  return (
    <div className="mb-4">
      <div className="mb-2 text-right">
        <label className="mr-2 text-sm">検索範囲:</label>
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={1}>300m</option>
          <option value={2}>500m</option>
          <option value={3}>1000m</option>
          <option value={4}>2000m</option>
          <option value={5}>3000m</option>
        </select>
      </div>

      <div className="mb-2 text-right">
        <button
          type="button"
          onClick={handleGeolocationSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded text-xs sm:text-sm"
        >
          現在地で検索
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}