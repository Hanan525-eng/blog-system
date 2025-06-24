'use client'

import { useState } from 'react'
import DeleteCommentButton from './DeleteCommentButton'
import EditCommentModal from './EditCommentModal'

export default function CommentActions({
  postId,
  commentId,
  content,
  canEdit,
  onSuccess,
}: {
  postId: number
  commentId: number
  content: string
  canEdit: boolean
  onSuccess: () => void
}) {
  const [showModal, setShowModal] = useState(false)

  if (!canEdit) return null

  return (
    <div className="flex gap-2 text-xs mt-2">
      <button
        onClick={() => setShowModal(true)}
        className="text-purple-600 hover:underline"
      >
        ✏️Edit
      </button>

      {showModal && (
        <EditCommentModal
          postId={postId}
          commentId={commentId}
          currentContent={content}
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
      
      <DeleteCommentButton
        postId={postId}
        commentId={commentId}
        onSuccess={onSuccess}
      />
    </div>
  )
}
