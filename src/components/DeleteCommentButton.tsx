// src/components/DeleteCommentButton.tsx
'use client'

import { useTransition } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function DeleteCommentButton({
  postId,
  commentId,
  onSuccess,
}: {
  postId: number
  commentId: number
  onSuccess: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || 'Failed to delete comment')
          return
        }

        toast.success('Comment deleted')
        onSuccess()
      } catch {
        toast.error('Something went wrong while deleting')
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 text-xs hover:underline ml-2"
    >
      {isPending ? 'Deleting...' : '🗑 Delete'}
    </button>
  )
}
