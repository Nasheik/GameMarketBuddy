import Link from 'next/link'
import { ThemeSwitcher } from '@/components/theme-switcher'

export default function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">
          GameMarketBuddy
        </Link>
      </div>
      <div className="flex items-center gap-4">
      <Link href="/sign-in" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                Sign up
              </Link>
        <ThemeSwitcher />
      </div>
    </nav>
  )
} 