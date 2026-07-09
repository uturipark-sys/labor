import { Router } from 'express'
import db from '../db.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware, requireRole('admin'))

// 대시보드 통계
router.get('/stats', (req, res) => {
  const stats = {
    total_users: db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get().c,
    total_attorneys: db.prepare("SELECT COUNT(*) as c FROM attorney_profiles").get().c,
    approved_attorneys: db.prepare("SELECT COUNT(*) as c FROM attorney_profiles WHERE is_approved = 1").get().c,
    pending_attorneys: db.prepare("SELECT COUNT(*) as c FROM attorney_profiles WHERE is_approved = 0").get().c,
    total_consultations: db.prepare("SELECT COUNT(*) as c FROM consultations").get().c,
    completed_consultations: db.prepare("SELECT COUNT(*) as c FROM consultations WHERE status = 'completed'").get().c,
    total_reviews: db.prepare("SELECT COUNT(*) as c FROM reviews").get().c,
    avg_rating: db.prepare("SELECT ROUND(AVG(rating),2) as r FROM reviews").get().r || 0,
    recent_consultations: db.prepare(`
      SELECT c.*, u.name as user_name
      FROM consultations c JOIN users u ON u.id = c.user_id
      ORDER BY c.created_at DESC LIMIT 5
    `).all(),
  }
  res.json(stats)
})

// 전체 사용자 목록
router.get('/users', (req, res) => {
  const { role, page = 1, q } = req.query
  const limit = 20
  const offset = (page - 1) * limit

  const where = []
  const params = []
  if (role) { where.push('role = ?'); params.push(role) }
  if (q) { where.push('(name LIKE ? OR email LIKE ?)'); params.push(`%${q}%`, `%${q}%`) }

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : ''
  const users = db.prepare(`SELECT id, email, name, phone, role, points, created_at FROM users ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset)
  const total = db.prepare(`SELECT COUNT(*) as c FROM users ${whereStr}`).get(...params).c

  res.json({ users, total, pages: Math.ceil(total / limit) })
})

// 노무사 승인/거절
router.patch('/attorneys/:id/approve', (req, res) => {
  const { approved } = req.body
  db.prepare('UPDATE attorney_profiles SET is_approved = ? WHERE id = ?').run(approved ? 1 : 0, req.params.id)

  if (approved) {
    const prof = db.prepare('SELECT user_id FROM attorney_profiles WHERE id = ?').get(req.params.id)
    if (prof) {
      db.prepare("INSERT INTO notifications (user_id, type, title, body) VALUES (?,?,?,?)").run(
        prof.user_id, 'approved', '노무사 승인 완료!', '찾아줘노무사 파트너 노무사로 승인되었어요. 지금 바로 활동을 시작해보세요!'
      )
    }
  }
  res.json({ ok: true })
})

// 전체 노무사 목록
router.get('/attorneys', (req, res) => {
  const attorneys = db.prepare(`
    SELECT ap.*, u.name, u.email, u.created_at as joined_at,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(DISTINCT r.id) as review_count,
      COUNT(DISTINCT c.id) as consultation_count
    FROM attorney_profiles ap
    JOIN users u ON u.id = ap.user_id
    LEFT JOIN reviews r ON r.attorney_id = ap.id
    LEFT JOIN consultations c ON c.attorney_id = ap.id
    GROUP BY ap.id
    ORDER BY ap.is_approved DESC, ap.created_at DESC
  `).all().map(a => ({
    ...a,
    specialties: db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(a.id).map(r => r.specialty),
    avg_rating: Math.round(a.avg_rating * 10) / 10,
  }))
  res.json(attorneys)
})

// 전체 상담 목록
router.get('/consultations', (req, res) => {
  const consultations = db.prepare(`
    SELECT c.*, u.name as user_name,
      au.name as attorney_name, ap.firm_name
    FROM consultations c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN attorney_profiles ap ON ap.id = c.attorney_id
    LEFT JOIN users au ON au.id = ap.user_id
    ORDER BY c.created_at DESC
    LIMIT 50
  `).all()
  res.json(consultations)
})

// 사용자 비활성화
router.patch('/users/:id/toggle', (req, res) => {
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.params.id)
  if (user?.role === 'admin') return res.status(403).json({ error: '관리자는 변경 불가' })
  // 실제론 is_active 컬럼 추가 필요 - 여기선 메모
  res.json({ ok: true })
})

export default router
