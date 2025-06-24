

'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function EditPostModal({
  postId,
  initialTitle,
  initialContent,
  onClose,
}: {
  postId: number
  initialTitle: string
  initialContent: string
  onClose: () => void
}) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
          body: JSON.stringify({ title, content }),
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || 'Failed to update post')
          return
        }

        toast.success('✅ Post updated successfully')
        onClose()
      } catch (error) {
        console.error('Edit post error:', error)
        toast.error('❌ Something went wrong while updating the post')
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-xl hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-primary mb-4"> Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
          />
          <textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 resize-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
