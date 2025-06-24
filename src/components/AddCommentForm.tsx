// src/components/AddCommentForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'

export default function AddCommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${document.cookie.replace(
              /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
              '$1'
            )}`,
          },
          body: JSON.stringify({ content }),
        })

        if (!res.ok) {
          const { error } = await res.json()
          toast.error(error || 'Failed to add comment')
          return
        }

        setContent('')
        toast.success('Comment added!')
        window.location.reload()
      } catch {
        toast.error('Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Write a comment..."
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        disabled={isPending}
      />
      <button
        type="submit"
        className="bg-white  border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg px-4 py-2 transition-colors duration-200 disabled:opacity-50 underline"
      >
        {isPending ? 'Posting...' : 'Add Comment'}
      </button>
    </form>
  )
}