import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '..//..//..//lib/prisma'
import { hash } from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'AUTHOR',
      },
    })

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Register Error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
