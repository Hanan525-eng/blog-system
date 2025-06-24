'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function EditCommentModal({
  postId,
  commentId,
  currentContent,
  onClose,
  onSuccess,
}: {
  postId: number
  commentId: number
  currentContent: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [content, setContent] = useState(currentContent)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
    
        const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
          body: JSON.stringify({ content }),
        })
        

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || 'Failed to update comment')
          return
        }

        toast.success('Comment updated successfully')
        onSuccess()
        onClose()
      } catch {
        toast.error('Something went wrong while updating the comment')
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 text-xl">
          ×
        </button>
        <h2 className="text-lg font-bold text-primary mb-4">📝 Edit Comment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Update Comment'}
          </button>
        </form>
      </div>
    </div>
  )
}
