// // src/app/posts/page.tsx

// 'use client'

// import { useEffect, useState } from 'react'
// import PostsGrid from '../../components/PostsGrid'

// export default function PostsPage() {
//   const [posts, setPosts] = useState([])

//   useEffect(() => {
//     async function fetchPosts() {
//       const res = await fetch('/api/posts')
//       const data = await res.json()
//       setPosts(data)
//     }

//     fetchPosts()
//   }, [])

//   return (
//     <main className="min-h-screen bg-[#fdfaff] py-10">
//       <h1 className="text-3xl font-bold text-center text-primary mb-8">📚 All Posts</h1>
//       <PostsGrid posts={posts} />
//     </main>
//   )
// }



// Server Component: src/app/posts/page.tsx

import PostsGrid from '..//..//components/PostsGrid'
import { prisma } from '..//..//lib/prisma'

export default async function PostsPage() {
  const postsFromDb = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Convert createdAt from Date to string
  const posts = postsFromDb.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-[#fdfaff] py-10">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">📚 All Posts</h1>
      <PostsGrid posts={posts} />
    </main>
  )
}
