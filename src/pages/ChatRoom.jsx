import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, Phone, MoreVertical, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { connectSocket, getSocket } from '../lib/socket'

function Message({ msg, isMe }) {
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
          {msg.sender_name?.[0]}
        </div>
      )}
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isMe && <span className="text-xs text-gray-500 ml-1">{msg.sender_name}</span>}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="text-xs text-gray-400 px-1">
          {msg.created_at?.slice(11, 16)}
          {isMe && <CheckCheck className="w-3 h-3 inline ml-1 text-blue-400" />}
        </span>
      </div>
    </div>
  )
}

export default function ChatRoom() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [peerTyping, setPeerTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }

    api.get(`/consultations/${id}`)
      .then(r => {
        setData(r.data)
        setMessages(r.data.messages || [])
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))

    // Socket 연결
    const token = localStorage.getItem('token')
    const socket = connectSocket(token)
    socket.emit('join_consultation', parseInt(id))

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on('peer_typing', ({ isTyping, name }) => {
      setPeerTyping(isTyping)
    })

    return () => {
      socket.off('new_message')
      socket.off('peer_typing')
    }
  }, [id, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, peerTyping])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const socket = getSocket()
    if (socket) {
      socket.emit('send_message', { consultationId: parseInt(id), content: text })
      socket.emit('typing', { consultationId: parseInt(id), isTyping: false })
    } else {
      // fallback REST
      api.post(`/consultations/${id}/messages`, { content: text })
        .then(r => setMessages(prev => [...prev, r.data]))
    }
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    const socket = getSocket()
    if (socket) {
      socket.emit('typing', { consultationId: parseInt(id), isTyping: true })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socket.emit('typing', { consultationId: parseInt(id), isTyping: false })
      }, 1500)
    }
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const completeConsultation = async () => {
    await api.patch(`/consultations/${id}/status`, { status: 'completed' })
    alert('상담이 완료되었어요!')
    navigate('/mypage')
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { consultation, attorney, user: clientUser } = data || {}
  const isClient = user?.id === consultation?.user_id
  const peer = isClient ? attorney : clientUser
  const peerName = isClient ? attorney?.name : clientUser?.name

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
          {peerName?.[0]}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-sm">{peerName} {isClient ? '노무사' : '님'}</div>
          <div className="text-xs text-gray-500">{consultation?.topic} · {consultation?.status === 'completed' ? '상담완료' : '상담중'}</div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Consultation info bar */}
      <div className="bg-blue-50 px-4 py-2 text-xs text-blue-700 flex items-center justify-between">
        <span>📋 {consultation?.title}</span>
        {consultation?.status !== 'completed' && (
          <button onClick={completeConsultation} className="text-blue-600 font-semibold hover:underline">
            상담 완료 처리
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-gray-500 text-sm">
              {isClient ? `${peerName} 노무사에게 먼저 인사해보세요!` : `${peerName}님이 상담을 신청했어요. 먼저 인사해보세요!`}
            </p>
          </div>
        )}
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} isMe={msg.sender_id === user?.id} />
        ))}
        {peerTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">{peerName?.[0]}</div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        {consultation?.status === 'completed' ? (
          <div className="text-center text-gray-400 text-sm py-2">상담이 완료된 채팅방이에요.</div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-28 overflow-auto"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={handleTyping}
              onKeyDown={handleKey}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
