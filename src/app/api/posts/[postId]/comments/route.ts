// src/app/api/posts/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma' // Adjust the import path as necessary
import { verifyJwt } from '../../../../../lib/jwt' // Adjust the import path as necessary

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const resolvedParams = await params
  const postId = Number(resolvedParams.postId)


  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const resolvedParams = await params
  const postId = Number(resolvedParams.postId)

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
  }

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyJwt(token)

  if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const userId = payload.userId as number
  const { content } = await req.json()

  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 })
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
