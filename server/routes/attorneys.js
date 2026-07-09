import { Router } from 'express'
import db from '../db.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// 노무사 목록 조회
router.get('/', (req, res) => {
  const { region, specialty, sort = 'rating', online } = req.query

  let attorneys = db.prepare(`
    SELECT ap.*, u.name, u.email, u.profile_image,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(DISTINCT r.id) as review_count,
      COUNT(DISTINCT c.id) as consultation_count
    FROM attorney_profiles ap
    JOIN users u ON u.id = ap.user_id
    LEFT JOIN reviews r ON r.attorney_id = ap.id
    LEFT JOIN consultations c ON c.attorney_id = ap.id AND c.status = 'completed'
    WHERE ap.is_approved = 1
    ${region && region !== '전체' ? "AND ap.region LIKE '%' || ? || '%'" : ''}
    ${online === '1' ? 'AND ap.is_online = 1' : ''}
    GROUP BY ap.id
    ORDER BY ${sort === 'price' ? 'ap.chat_price ASC' : sort === 'reviews' ? 'review_count DESC' : 'avg_rating DESC'}
  `, ...(region && region !== '전체' ? [region] : [])).all(...(region && region !== '전체' ? [region] : []))

  // 전문분야 추가
  attorneys = attorneys.map(a => ({
    ...a,
    specialties: db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(a.id).map(r => r.specialty),
    avg_rating: Math.round(a.avg_rating * 10) / 10,
    available_days: JSON.parse(a.available_days || '[]'),
  }))

  if (specialty && specialty !== '전체') {
    attorneys = attorneys.filter(a => a.specialties.includes(specialty))
  }

  res.json(attorneys)
})

// 노무사 상세 조회
router.get('/:id', (req, res) => {
  const attorney = db.prepare(`
    SELECT ap.*, u.name, u.email, u.profile_image
    FROM attorney_profiles ap
    JOIN users u ON u.id = ap.user_id
    WHERE ap.id = ?
  `).get(req.params.id)

  if (!attorney) return res.status(404).json({ error: '노무사를 찾을 수 없어요' })

  attorney.specialties = db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(attorney.id).map(r => r.specialty)
  attorney.available_days = JSON.parse(attorney.available_days || '[]')

  const reviews = db.prepare(`
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.attorney_id = ?
    ORDER BY r.created_at DESC
    LIMIT 10
  `).all(attorney.id)

  const stats = db.prepare(`
    SELECT COUNT(*) as total, AVG(rating) as avg_rating
    FROM reviews WHERE attorney_id = ?
  `).get(attorney.id)

  res.json({
    ...attorney,
    reviews,
    avg_rating: Math.round((stats.avg_rating || 0) * 10) / 10,
    review_count: stats.total,
  })
})

// 노무사 프로필 수정 (본인)
router.put('/profile/me', authMiddleware, requireRole('attorney'), (req, res) => {
  const { firm_name, introduction, career_years, region, address,
    chat_price, call_price, visit_price, free_first,
    available_from, available_to, available_days, specialties } = req.body

  const prof = db.prepare('SELECT id FROM attorney_profiles WHERE user_id = ?').get(req.user.id)
  if (!prof) return res.status(404).json({ error: '노무사 프로필이 없어요' })

  db.prepare(`
    UPDATE attorney_profiles SET
      firm_name=?, introduction=?, career_years=?, region=?, address=?,
      chat_price=?, call_price=?, visit_price=?, free_first=?,
      available_from=?, available_to=?, available_days=?
    WHERE id=?
  `).run(firm_name, introduction, career_years, region, address,
    chat_price, call_price, visit_price, free_first ? 1 : 0,
    available_from, available_to, JSON.stringify(available_days || []), prof.id)

  if (specialties) {
    db.prepare('DELETE FROM attorney_specialties WHERE attorney_id = ?').run(prof.id)
    for (const s of specialties) {
      db.prepare('INSERT INTO attorney_specialties (attorney_id, specialty) VALUES (?,?)').run(prof.id, s)
    }
  }

  res.json({ ok: true })
})

// 온라인 상태 토글
router.patch('/status/online', authMiddleware, requireRole('attorney'), (req, res) => {
  const { is_online } = req.body
  db.prepare('UPDATE attorney_profiles SET is_online=? WHERE user_id=?').run(is_online ? 1 : 0, req.user.id)
  res.json({ ok: true, is_online })
})

// 노무사 후기 작성
router.post('/:id/reviews', authMiddleware, (req, res) => {
  const { consultation_id, rating, content, category } = req.body
  const attorney = db.prepare('SELECT id FROM attorney_profiles WHERE id = ?').get(req.params.id)
  if (!attorney) return res.status(404).json({ error: '노무사를 찾을 수 없어요' })

  const result = db.prepare(`
    INSERT INTO reviews (consultation_id, user_id, attorney_id, rating, content, category)
    VALUES (?,?,?,?,?,?)
  `).run(consultation_id, req.user.id, attorney.id, rating, content, category)

  res.json({ id: result.lastInsertRowid })
})

export default router
