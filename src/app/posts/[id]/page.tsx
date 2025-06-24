


// src/app/posts/[id]/page.tsx

import { prisma } from '../../../lib/prisma'
import { notFound } from 'next/navigation'
import AddCommentForm from '../../../components/AddCommentForm'
import { cookies } from 'next/headers'
import { verifyJwt } from '../../../lib/jwt'
import PostActions from '../../../components/PostActions'
import CommentsList from '../../../components/CommentsList'

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ✅ تأكد أن id رقم صالح
  const resolvedParams = await params
  const postId = Number(resolvedParams.id)
  if (isNaN(postId)) return notFound()

  // ✅ قراءة التوكن وتحديد نوع المستخدم
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  console.log('Token:', cookieStore.get('token'))

  let userRole = ''
  let userId: number | null = null
  if (token) {
    const payload = verifyJwt(token)
    if (payload && typeof payload === 'object') {
      if ('role' in payload) {
        userRole = payload.role as string
      }
      if ('userId' in payload) {
        userId = Number(payload.userId)
      }
    }
  }

  // ✅ جلب بيانات البوست من قاعدة البيانات
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true } },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          postId: true,
          author: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!post) return notFound()

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      {/* 🔹 عنوان وتفاصيل البوست */}
      <h1 className="text-3xl font-bold text-primary mb-4">{post.title}</h1>
      <div className="text-sm text-dark mb-2">
        ✍️ {post.author.name} – 🕒 {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <p className="text-gray-800 text-base leading-relaxed mb-6">{post.content}</p>

      {/* 🔧 أزرار التعديل والحذف (لـ ADMIN فقط) */}
      {userRole === 'ADMIN' && (
        <PostActions postId={post.id} title={post.title} content={post.content} />
      )}

      

      

         
       
     


      {/* { 💬 قسم التعليقاتاا */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-dark mb-4">💬 Comments</h2>

        <AddCommentForm postId={post.id} />

        <div className="space-y-4 mt-6">
      


          
          <CommentsList
                comments={post.comments}
                currentUserId={userId ?? 0}
                userRole={userRole}
                  />
        </div>
      </section> 
    </main>
  )
}


