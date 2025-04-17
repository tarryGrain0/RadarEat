'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiMenu } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoBookmarks } from "react-icons/io5";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const hasToken = typeof document !== 'undefined' && document.cookie.includes('authToken=')
    setIsLoggedIn(hasToken)

    const interval = setInterval(() => {
      const hasToken = typeof document !== 'undefined' && document.cookie.includes('authToken=')
      setIsLoggedIn(hasToken)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsLoggedIn(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 bg-white/70 shadow-md flex flex-wrap items-center justify-between">
      <Link href="/" className="text-2xl sm:text-3xl font-bold text-orange-500">
        RadarEat
      </Link>

      <button
        className="sm:hidden text-gray-600 ml-auto"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <IoIosCloseCircleOutline size={24} className="absolute z-50 top-6 right-6"></IoIosCloseCircleOutline>
        ) : (
          <FiMenu size={24}></FiMenu>
        )}
      </button>

      {/* モバイルの時のみMenuボタンを表示する */}
      <nav
        className={`${isOpen ? 'flex' : 'hidden sm:flex'} absolute sm:static z-10 sm:z-auto right-3 top-0 sm:top-auto
              w-50 sm:w-auto bg-white shadow-lg sm:shadow-none
              rounded-lg flex-col sm:flex-row gap-2 sm:gap-4 mt-3 sm:mt-0
              items-center sm:items-center py-5 sm:py-0`}
        onClick={() => setIsOpen(false)}
      >
        {isLoggedIn ? (
          <>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1 text-orange-500 border border-orange-500 px-1 py-2 rounded-md hover:bg-orange-100 transition text-sm"
            >
              <IoBookmarks />
              ブックマーク
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-1 py-2 rounded-md shadow hover:bg-red-600 transition text-sm text-center"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-orange-500 text-white px-6 py-2 rounded-md shadow hover:bg-orange-500 transition text-sm text-center"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="border border-orange-500 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-100 text-sm transition text-center"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header >
  )
}