// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
// If you do not have path aliases set up, use a relative import:
import { prisma } from '..//..//..//lib/prisma' // Adjust the import path as needed
import { verifyJwt } from '..//..//..//lib/jwt' // Adjust the import path as needed

// 🟢 جلب جميع البوستات
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}

// 🟢 إنشاء بوست جديد
export async function POST(req: NextRequest) {
  try {
    // استخراج التوكن من الهيدر
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    }

    const payload = verifyJwt(token)

    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 })
    }

    const userId = payload.userId as number
    const { title, content } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
      include: {
        author: { select: { name: true } },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
