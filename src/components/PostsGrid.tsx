// src/components/PostsGrid.tsx

import Link from 'next/link'

type Post = {
  id: number
  title: string
  content: string
  author: {
    name: string
  }
  createdAt: string
}

export default function PostsGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
          <p className="text-gray-700 text-sm mb-3 line-clamp-1">{post.content}</p>
          <div className="text-xs text-dark mb-3">
            ✍️ {post.author.name} – 🕒 {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <Link
            href={`/posts/${post.id}`}
            className="text-purple-600 hover:underline text-sm font-medium"
          >
            قراءة المزيد →
          </Link>
        </div>
      ))}
    </div>
  )
}
