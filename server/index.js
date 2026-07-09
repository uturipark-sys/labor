import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { initDb } from './db.js'
import db from './db.js'
import authRoutes from './routes/auth.js'
import attorneyRoutes from './routes/attorneys.js'
import consultationRoutes from './routes/consultations.js'
import adminRoutes from './routes/admin.js'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from './middleware/auth.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', credentials: true }
})

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Init DB
initDb()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/attorneys', attorneyRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/admin', adminRoutes)

// Notifications
app.get('/api/notifications', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json([])
  try {
    const user = jwt.verify(token, SECRET_KEY)
    const notifs = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(user.id)
    res.json(notifs)
  } catch { res.status(401).json([]) }
})

app.patch('/api/notifications/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET is_read=1 WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

// ─── Socket.io 실시간 채팅 ───────────────────────────────────
const onlineUsers = new Map() // userId → socketId

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('인증 필요'))
  try {
    socket.user = jwt.verify(token, SECRET_KEY)
    next()
  } catch { next(new Error('토큰 오류')) }
})

io.on('connection', (socket) => {
  const user = socket.user
  onlineUsers.set(user.id, socket.id)

  // 노무사면 온라인 상태 업데이트
  if (user.role === 'attorney') {
    db.prepare('UPDATE attorney_profiles SET is_online=1 WHERE user_id=?').run(user.id)
    io.emit('attorney_online', { user_id: user.id, is_online: true })
  }

  console.log(`✅ 연결: ${user.name} (${user.role})`)

  // 상담방 입장
  socket.on('join_consultation', (consultationId) => {
    socket.join(`consultation_${consultationId}`)
    console.log(`${user.name} → 상담방 ${consultationId}`)
  })

  // 메시지 전송
  socket.on('send_message', ({ consultationId, content }) => {
    const result = db.prepare(`
      INSERT INTO chat_messages (consultation_id, sender_id, sender_role, content)
      VALUES (?,?,?,?)
    `).run(consultationId, user.id, user.role, content)

    const message = db.prepare(`
      SELECT m.*, u.name as sender_name
      FROM chat_messages m JOIN users u ON u.id = m.sender_id
      WHERE m.id = ?
    `).get(result.lastInsertRowid)

    // 상담방 전체에 브로드캐스트
    io.to(`consultation_${consultationId}`).emit('new_message', message)

    // 상대방에게 알림
    const consultation = db.prepare('SELECT * FROM consultations WHERE id=?').get(consultationId)
    const recipientId = user.id === consultation.user_id
      ? db.prepare('SELECT user_id FROM attorney_profiles WHERE id=?').get(consultation.attorney_id)?.user_id
      : consultation.user_id

    if (recipientId && onlineUsers.has(recipientId)) {
      io.to(onlineUsers.get(recipientId)).emit('notification', {
        type: 'message', consultationId, senderName: user.name, content
      })
    }
  })

  // 타이핑 표시
  socket.on('typing', ({ consultationId, isTyping }) => {
    socket.to(`consultation_${consultationId}`).emit('peer_typing', { isTyping, name: user.name })
  })

  socket.on('disconnect', () => {
    onlineUsers.delete(user.id)
    if (user.role === 'attorney') {
      db.prepare('UPDATE attorney_profiles SET is_online=0 WHERE user_id=?').run(user.id)
      io.emit('attorney_online', { user_id: user.id, is_online: false })
    }
    console.log(`❌ 연결 해제: ${user.name}`)
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`))
