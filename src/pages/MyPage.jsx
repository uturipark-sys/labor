import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, ChevronRight, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/consultations/my').then(r => setConsultations(r.data)).finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', matched: 'bg-blue-100 text-blue-700', in_progress: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' }
  const statusLabel = { pending: '대기중', matched: '매칭됨', in_progress: '상담중', completed: '완료', cancelled: '취소' }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-[700px] mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 text-2xl font-bold">
              {user?.name?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}님</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-4 py-6 space-y-4">
        <h2 className="font-bold text-gray-900">내 상담 내역</h2>
        {consultations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 mb-4">아직 상담 내역이 없어요.</p>
            <Link to="/find" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm">
              노무사 찾기 →
            </Link>
          </div>
        ) : consultations.map(c => (
          <Link key={c.id} to={`/chat/${c.id}`}
            className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`tag ${statusColor[c.status]}`}>{statusLabel[c.status] || c.status}</span>
                  {c.topic && <span className="tag bg-blue-50 text-blue-700">{c.topic}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{c.title}</h3>
                <p className="text-sm text-gray-500">{c.attorney_name ? `${c.attorney_name} 노무사` : '노무사 배정 대기'} · {c.created_at?.slice(0,10)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
