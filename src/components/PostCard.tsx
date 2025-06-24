'use client'

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import Link from 'next/link'

type DecodedToken = {
  id: string
  role: 'USER' | 'AUTHOR' | 'ADMIN'
  exp: number
}

type Post = {
  id: string
  title: string
  content: string
}

export default function PostCard({ post }: { post: Post }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        if (decoded.role === 'ADMIN') {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('Invalid token', err)
      }
    }
  }, [])

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mb-4">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-600">{post.content}</p>

      {isAdmin && (
        <div className="mt-4 flex gap-2">
          <Link
            href={`/posts/edit/${post.id}`}
            className="text-purple-600 hover:underline"
          >
            ✏️ Edit
          </Link>

          <button
            onClick={async () => {
              const res = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
              })

              if (res.ok) {
                location.reload()
              } else {
                alert('Failed to delete post')
              }
            }}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
