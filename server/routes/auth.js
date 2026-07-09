import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { SECRET_KEY, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/register', (req, res) => {
  const { email, password, name, phone, role = 'user' } = req.body
  if (!email || !password || !name) return res.status(400).json({ error: '필수 항목을 입력해주세요' })
  if (role === 'admin') return res.status(403).json({ error: '관리자 계정은 직접 생성할 수 없어요' })

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (exists) return res.status(409).json({ error: '이미 사용 중인 이메일이에요' })

  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare(
    'INSERT INTO users (email, password, name, phone, role) VALUES (?,?,?,?,?)'
  ).run(email, hash, name, phone || null, role)

  if (role === 'attorney') {
    db.prepare('INSERT INTO attorney_profiles (user_id) VALUES (?)').run(result.lastInsertRowid)
  }

  const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(result.lastInsertRowid)
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '7d' })
  res.json({ token, user })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸어요' })

  const ok = bcrypt.compareSync(password, user.password)
  if (!ok) return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸어요' })

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '7d' })
  const { password: _, ...safeUser } = user
  res.json({ token, user: safeUser })
})

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, name, phone, role, points, profile_image, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없어요' })

  let attorney = null
  if (user.role === 'attorney') {
    attorney = db.prepare('SELECT * FROM attorney_profiles WHERE user_id = ?').get(user.id)
    if (attorney) {
      attorney.specialties = db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(attorney.id).map(r => r.specialty)
      attorney.available_days = JSON.parse(attorney.available_days || '[]')
    }
  }
  res.json({ user, attorney })
})

router.put('/me', authMiddleware, (req, res) => {
  const { name, phone } = req.body
  db.prepare('UPDATE users SET name=?, phone=?, updated_at=datetime("now","localtime") WHERE id=?').run(name, phone, req.user.id)
  res.json({ ok: true })
})

export default router
