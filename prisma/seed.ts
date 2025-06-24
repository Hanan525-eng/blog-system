// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 10)

  // 🟢 إنشاء مستخدم مسؤول (ADMIN)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
    },
  })

  // 🔵 إنشاء مستخدم عادي (AUTHOR)
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      name: 'Author User',
      email: 'author@example.com',
      password,
      role: 'AUTHOR',
    },
  })

  // 📝 إضافة بوست تجريبي للكاتب
  await prisma.post.create({
    data: {
      title: 'Welcome to the blog!',
      content: 'This is a test post written by the author.',
      authorId: author.id,
    },
  })

  console.log('✅ Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
