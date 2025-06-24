



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '..//..//..//lib/prisma'
import { compare } from 'bcrypt'
import { signJwt } from '..//..//..//lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signJwt({ userId: user.id, role: user.role })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
