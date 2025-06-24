'use client'

import CommentItem from './CommentItem'

export default function CommentsList({
  comments,
  currentUserId,
  userRole,
}: {
  comments: {
    id: number
    content: string
    createdAt: Date
    postId: number
    author: {
      id: number
      name: string
    }
  }[]
  currentUserId: number
  userRole: string
}) {

  return (
    <div className="space-y-4 mt-6">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            userRole={userRole}
          />
        ))
      )}
    </div>
  )
}
