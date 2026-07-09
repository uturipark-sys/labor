import { Router } from 'express'
import db from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 상담 신청
router.post('/', authMiddleware, (req, res) => {
  const { attorney_id, type, topic, title, content } = req.body

  // 가격 조회
  let price = 0
  if (attorney_id) {
    const prof = db.prepare('SELECT chat_price, call_price, visit_price, free_first FROM attorney_profiles WHERE id = ?').get(attorney_id)
    if (prof) {
      const priceMap = { chat: prof.chat_price, call: prof.call_price, visit: prof.visit_price }
      price = prof.free_first ? 0 : (priceMap[type] || 0)
    }
  }

  const result = db.prepare(`
    INSERT INTO consultations (user_id, attorney_id, type, topic, title, content, price, status)
    VALUES (?,?,?,?,?,?,?, ?)
  `).run(req.user.id, attorney_id || null, type || 'chat', topic, title, content, price, attorney_id ? 'matched' : 'pending')

  // 알림
  if (attorney_id) {
    const prof = db.prepare('SELECT user_id FROM attorney_profiles WHERE id = ?').get(attorney_id)
    if (prof) {
      db.prepare(`INSERT INTO notifications (user_id, type, title, body) VALUES (?,?,?,?)`).run(
        prof.user_id, 'new_consultation', '새 상담 요청이 왔어요!', `${req.user.name}님이 상담을 신청했어요.`
      )
    }
  }

  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(result.lastInsertRowid)
  res.json(consultation)
})

// 내 상담 목록
router.get('/my', authMiddleware, (req, res) => {
  let consultations
  if (req.user.role === 'attorney') {
    const prof = db.prepare('SELECT id FROM attorney_profiles WHERE user_id = ?').get(req.user.id)
    if (!prof) return res.json([])
    consultations = db.prepare(`
      SELECT c.*, u.name as user_name, u.phone as user_phone
      FROM consultations c
      JOIN users u ON u.id = c.user_id
      WHERE c.attorney_id = ?
      ORDER BY c.created_at DESC
    `).all(prof.id)
  } else {
    consultations = db.prepare(`
      SELECT c.*, u.name as attorney_name, ap.firm_name
      FROM consultations c
      LEFT JOIN attorney_profiles ap ON ap.id = c.attorney_id
      LEFT JOIN users u ON u.id = ap.user_id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(req.user.id)
  }
  res.json(consultations)
})

// 상담 상세 + 채팅 메시지
router.get('/:id', authMiddleware, (req, res) => {
  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id)
  if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없어요' })

  // 권한 체크
  const prof = req.user.role === 'attorney'
    ? db.prepare('SELECT id FROM attorney_profiles WHERE user_id = ?').get(req.user.id)
    : null

  const isOwner = consultation.user_id === req.user.id
  const isAttorney = prof && consultation.attorney_id === prof.id
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAttorney && !isAdmin) {
    return res.status(403).json({ error: '접근 권한이 없어요' })
  }

  const messages = db.prepare(`
    SELECT m.*, u.name as sender_name, u.role as sender_role_type
    FROM chat_messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.consultation_id = ?
    ORDER BY m.created_at ASC
  `).all(req.params.id)

  // 읽음 처리
  db.prepare('UPDATE chat_messages SET is_read=1 WHERE consultation_id=? AND sender_id != ?').run(req.params.id, req.user.id)

  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(consultation.user_id)
  let attorney = null
  if (consultation.attorney_id) {
    attorney = db.prepare(`
      SELECT ap.*, u.name, u.email FROM attorney_profiles ap
      JOIN users u ON u.id = ap.user_id
      WHERE ap.id = ?
    `).get(consultation.attorney_id)
  }

  res.json({ consultation, messages, user, attorney })
})

// 상담 상태 변경
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body
  db.prepare('UPDATE consultations SET status=?, updated_at=datetime("now","localtime") WHERE id=?').run(status, req.params.id)
  res.json({ ok: true })
})

// 메시지 전송 (REST fallback)
router.post('/:id/messages', authMiddleware, (req, res) => {
  const { content } = req.body
  const result = db.prepare(`
    INSERT INTO chat_messages (consultation_id, sender_id, sender_role, content)
    VALUES (?,?,?,?)
  `).run(req.params.id, req.user.id, req.user.role, content)

  const message = db.prepare(`
    SELECT m.*, u.name as sender_name FROM chat_messages m
    JOIN users u ON u.id = m.sender_id WHERE m.id = ?
  `).get(result.lastInsertRowid)

  res.json(message)
})

// Q&A 목록
router.get('/qna/list', (req, res) => {
  const { category } = req.query
  const posts = db.prepare(`
    SELECT q.*, u.name as author_name,
      (SELECT COUNT(*) FROM qna_answers WHERE post_id = q.id) as answer_count
    FROM qna_posts q
    JOIN users u ON u.id = q.user_id
    ${category && category !== '전체' ? "WHERE q.category = ?" : ''}
    ORDER BY q.created_at DESC LIMIT 20
  `).all(...(category && category !== '전체' ? [category] : []))
  res.json(posts)
})

router.post('/qna/post', authMiddleware, (req, res) => {
  const { category, title, content, is_anonymous } = req.body
  const result = db.prepare(`
    INSERT INTO qna_posts (user_id, category, title, content, is_anonymous) VALUES (?,?,?,?,?)
  `).run(req.user.id, category, title, content, is_anonymous ? 1 : 0)
  res.json({ id: result.lastInsertRowid })
})

export default router
