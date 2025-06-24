
'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // ✅ تحقق من التوكن، وإذا غير موجود وجّه المستخدم إلى صفحة تسجيل الدخول
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (!token) {
      toast.error('Please log in to create a post')
    //   router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    startTransition(async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1]

        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        })

        if (!res.ok) {
          const data = await res.json()
          toast.error(data.error || 'Failed to create post')
          return
        }

        toast.success('Post created!')
        router.push('/posts')
      } catch {
        toast.error('Something went wrong')
      }
    })
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold text-black/80 mb-4">✍️ Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600"
          disabled={isPending}
        />
        <textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 text-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          disabled={isPending}
        />
        <button
          type="submit"
          className="bg-purple-500 w-full text-white px-6 py-2 rounded-xl hover:bg-purple-400 transition"
          disabled={isPending}
        >
          {isPending ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </main>
  )
}
