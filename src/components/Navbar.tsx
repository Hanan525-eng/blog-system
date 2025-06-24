// // components/Navbar.tsx
// 'use client'

// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import Cookies from 'js-cookie'
// import { toast } from 'react-hot-toast'

// export default function Navbar() {
//   const pathname = usePathname()
//   const router = useRouter()

//   // لو المستخدم على صفحة لوجن أو تسجيل، لا نظهر النافبار
//   if (pathname === '/login' || pathname === '/register') return null

//   const handleLogout = () => {
//     Cookies.remove('token')
//     toast.success('Logged out successfully')
//     router.push('/login')
//   }

//   return (
//     <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
//       <Link href="/posts" className="text-xl font-bold text-purple-600 hover:text-purple-700 transition ">
//         📝 Blog System
//       </Link>

//       <div className="space-x-4">
//         <Link href="/posts" className="text-gray-700 hover:text-primary">
//           Posts
//         </Link>
//         <Link href="/posts/create" className="text-gray-700 hover:text-primary">
//           Create Post
//         </Link>
//         <button
//           onClick={handleLogout}
//           className="bg-primary text-white px-4 py-1 rounded hover:bg-purple-400 transition"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   )
// }



'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  name: string
  email: string
  role: string
  exp: number
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setUser(decoded)
      } catch {
        Cookies.remove('token')
        router.push('/login')
      }
    }
  }, [router])

  if (pathname === '/login' || pathname === '/register' || pathname=== '/') return null

  const handleLogout = () => {
    Cookies.remove('token')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/posts" className="text-xl font-bold text-purple-600 hover:text-purple-700 transition">
        📝 Blog System
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/posts" className="text-gray-700 hover:text-purple-600 hover:underline">
          Posts
        </Link>
        <Link href="/posts/create" className="text-gray-700 hover:text-purple-600 hover:underline">
          Create Post
        </Link>

        {user && (
          <span className="text-sm text-gray-600 flex items-center gap-2">
           {user.name}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
