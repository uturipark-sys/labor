import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'nomusa_secret_2024'

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: '인증이 필요해요' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: '토큰이 유효하지 않아요' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: '권한이 없어요' })
    }
    next()
  }
}

export const SECRET_KEY = SECRET
