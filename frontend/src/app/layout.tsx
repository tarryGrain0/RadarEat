import './globals.css'
import Header from './components/HeaderComponent'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className='bg-white'>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}