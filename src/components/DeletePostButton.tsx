// src/components/DeletePostButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function DeletePostButton({ postId }: { postId: number }) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this post?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            '$1'
          )}`,
        },
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete post')
        return
      }

      toast.success('Post deleted successfully')
      router.push('/posts')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4  rounded-lg hover:bg-red-600 transition"
    >
      Delete
    </button>
  )
}
