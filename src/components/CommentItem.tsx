'use client'

import { useRouter } from 'next/navigation'
import CommentActions from './CommentActions'

export default function CommentItem({
  comment,
  currentUserId,
  userRole,
}: {
  comment: {
    id: number
    content: string
    createdAt: Date
    author: {
      id: number
      name: string
    }
    postId: number
  }
  currentUserId: number
  userRole: string
}) {
  const router = useRouter()

  const canEdit = userRole === 'ADMIN' || currentUserId === comment.author.id

  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <p className="text-sm text-gray-800">{comment.content}</p>
      <div className="text-xs text-gray-500 mt-1">
        ✍️ {comment.author.name} – 🕒{' '}
        {new Date(comment.createdAt).toLocaleDateString()}
      </div>

      {/* ✅ أزرار تعديل/حذف */}
        <CommentActions
          postId={comment.postId}
          commentId={comment.id}
          content={comment.content}
          canEdit={canEdit}
          onSuccess={() => router.refresh()}
        />
      </div>
  )
}
