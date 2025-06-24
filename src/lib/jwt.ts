// import jwt from 'jsonwebtoken'

// const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

// export function signJwt(payload: object, options = {}) {
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: '1d',
//     ...options,
//   })
// }

// export function verifyJwt(token: string) {
//   try {
//     return jwt.verify(token, JWT_SECRET)
//   } catch (error) {
//     console.error('JWT verification error:', error)
//     // يمكن إضافة معالجة أخطاء مخصصة هنا إذا لزم الأمر
//     return null
//   }
// }



import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

// نوع الـ payload المتوقّع
interface TokenPayload {
  userId: number
  role: 'ADMIN' | 'AUTHOR' | 'USER' // حسب الصلاحيات اللي عندك
}

// إنشاء التوكن
export function signJwt(payload: TokenPayload, options: SignOptions = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
    ...options,
  })
}

// التحقق من التوكن
export function verifyJwt(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // تأكد إن البيانات تحتوي على userId و role
    if (
      typeof decoded === 'object' &&
      'userId' in decoded &&
      'role' in decoded
    ) {
      return decoded as TokenPayload
    }
    return null
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}
