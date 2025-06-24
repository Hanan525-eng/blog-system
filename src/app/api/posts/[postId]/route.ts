// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '..//..//../../lib/prisma'
import { verifyJwt } from '..//..//../../lib/jwt'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const postId = Number(resolvedParams.id)

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// update

export async function PUT(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const postId = Number(id)

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }





  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
  }

  const payload = verifyJwt(token)
  if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
    return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 })
  }

  try {
    const { title, content } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
    }

    // تحقق من ملكية البوست
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost.authorId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden - Not the post author' }, { status: 403 })
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


// delete

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const postId = Number(id)

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
  }

  const payload = verifyJwt(token)
  if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
    return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 })
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // if (existingPost.authorId !== payload.userId) {
    //   return NextResponse.json({ error: 'Forbidden - Not the post author' }, { status: 403 })
    // }

    if (existingPost.authorId !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Not allowed' }, { status: 403 })
    }
    

    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


