
// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '../../../../../../lib/prisma'
// import { verifyJwt } from '../../../../../../lib/jwt'

// export async function PATCH(


//   req: NextRequest,
//   { params }: { params: { postId: string; commentId: string } }
// ) {
//   console.log('PATCH comment route triggered')
//   console.log('Received params:', params)


//   const { postId, commentId } = params

//   const postIdNum = Number(postId)
//   const commentIdNum = Number(commentId)

// console.log('postId:', postId, 'commentId:', commentId)


//   if (isNaN(postIdNum) || isNaN(commentIdNum)) {
//     return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
//   }

//   const authHeader = req.headers.get('authorization')
//   const token = authHeader?.split(' ')[1]

//   if (!token) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const payload = verifyJwt(token)
//   if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
//     return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//   }

//   const userId = payload.userId as number
//   const { content } = await req.json()

//   if (!content) {
//     return NextResponse.json({ error: 'Missing content' }, { status: 400 })
//   }

//   try {
//     const existingComment = await prisma.comment.findUnique({
//       where: { id: commentIdNum },
//     })

   

//     if (!existingComment || existingComment.postId !== postIdNum) {
//       return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
//     }
    
//     if (existingComment.authorId !== userId && payload.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Forbidden - Not the comment author' }, { status: 403 })
//     }
    
//     const updated = await prisma.comment.update({
//       where: { id: commentIdNum },
//       data: { content },
//     })

//     return NextResponse.json(updated)
//   } catch (error) {
//     console.error('Error updating comment:', error)
//     return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { postId: string; commentId: string } }
// ) {
//   const { postId, commentId } = params

//   const postIdNum = Number(postId)
//   const commentIdNum = Number(commentId)

//   if (isNaN(postIdNum) || isNaN(commentIdNum)) {
//     return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
//   }

//   const authHeader = req.headers.get('authorization')
//   const token = authHeader?.split(' ')[1]

//   if (!token) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const payload = verifyJwt(token)
//   if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
//     return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//   }

//   const userId = payload.userId as number

//   try {
//     const existingComment = await prisma.comment.findUnique({
//       where: { id: commentIdNum },
//     })


//     if (!existingComment || existingComment.postId !== postIdNum) {
//       return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
//     }
    
//     if (existingComment.authorId !== userId && payload.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Forbidden - Not the comment author' }, { status: 403 })
//     }
    

//     await prisma.comment.delete({
//       where: { id: commentIdNum },
//     })

//     return NextResponse.json({ message: 'Comment deleted successfully' })
//   } catch (error) {
//     console.error('Error deleting comment:', error)
//     return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
//   }
// }



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'
import { verifyJwt } from '../../../../../../lib/jwt'

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  const postIdNum = Number(segments[segments.length - 3])
  const commentIdNum = Number(segments[segments.length - 1])

  if (isNaN(postIdNum) || isNaN(commentIdNum)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
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
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
    })

    if (!existingComment || existingComment.postId !== postIdNum) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (existingComment.authorId !== userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Not the comment author' }, { status: 403 })
    }

    const updated = await prisma.comment.update({
      where: { id: commentIdNum },
      data: { content },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  const postIdNum = Number(segments[segments.length - 3])
  const commentIdNum = Number(segments[segments.length - 1])

  if (isNaN(postIdNum) || isNaN(commentIdNum)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
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

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentIdNum },
    })

    if (!existingComment || existingComment.postId !== postIdNum) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (existingComment.authorId !== userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Not the comment author' }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: commentIdNum },
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
