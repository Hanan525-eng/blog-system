'use client'

import { useState } from 'react'
import EditPostModal from './EditPostModal'
import DeletePostButton from './DeletePostButton'

export default function PostActions({
  postId,
  title,
  content,
}: {
  postId: number
  title: string
  content: string
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex gap-4 mb-6">
      {/* زر فتح المودال */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
      >
        Edit
      </button>

      {/* زر الحذف */}
      <DeletePostButton postId={postId} />

      {/* مودال التعديل */}
      {showModal && (
        <EditPostModal
          postId={postId}
          initialTitle={title}
          initialContent={content}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
