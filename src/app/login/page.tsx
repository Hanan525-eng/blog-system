

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || 'Login failed')
          return
        }

        // Save token in cookie
        Cookies.set('token', data.token, { expires: 1 })

        toast.success('Logged in successfully ✅')
        router.push('/posts')
      } catch {
        toast.error('Something went wrong during login')
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdfaff] p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-primary text-center">🔐 Login</h1>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          disabled={isPending}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          disabled={isPending}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          Don&#39;t have an account?{' '}
          <a
            href="/register"
            className="text-primary font-medium hover:underline text-purple-500 underline"
          >
            Create one
          </a>
        </p>
      </form>
    </main>
  )
}
