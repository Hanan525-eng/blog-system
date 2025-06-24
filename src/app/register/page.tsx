'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password  ) {
      toast.error('Please fill in all fields')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, }),
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || 'Registration failed')
          return
        }

        // Save token in cookie
        Cookies.set('token', data.token, { expires: 1 })

        toast.success('Registered successfully ✅')
        router.push('/posts')
      } catch {
        toast.error('Something went wrong during registration')
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdfaff] p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-primary text-center">📝 Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          disabled={isPending}
        />

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
          {isPending ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-purple-500 font-medium hover:underline"
          >
            Login here
          </a>
        </p>
      </form>
    </main>
  )
}
