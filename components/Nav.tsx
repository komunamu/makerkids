'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { href: '/weeks', label: 'Curriculum', emoji: '📚' },
  { href: '/projects', label: 'Projects', emoji: '🖨️' },
  { href: '/achievements', label: 'Achievements', emoji: '🏆' },
  { href: '/certificate', label: 'Certificate', emoji: '🎓' },
]

interface NavProps {
  userName?: string | null
  userRole?: string | null
}

export default function Nav({ userName, userRole }: NavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-2">
        <Link href="/dashboard" className="font-bold text-gray-900 flex items-center gap-2 mr-4 text-sm">
          <span className="text-xl">🖨️</span>
          <span className="hidden sm:inline">MakerKids</span>
        </Link>

        <div className="flex gap-1 flex-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition',
                pathname.startsWith(l.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="sm:hidden">{l.emoji}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </Link>
          ))}
          {userRole === 'parent' || userRole === 'admin' ? (
            <Link
              href="/admin"
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition',
                pathname.startsWith('/admin')
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="sm:hidden">👨‍👩‍👧</span>
              <span className="hidden sm:inline">Parent View</span>
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {userName && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              Hi, {userName.split(' ')[0]}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-gray-600 transition px-2 py-1"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
