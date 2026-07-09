import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MessageCircle, Star, TrendingUp, CheckCircle, XCircle, Eye, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function StatCard({ label, value, icon: Icon, color, bg, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [attorneys, setAttorneys] = useState([])
  const [users, setUsers] = useState([])
  const [consultations, setConsultations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin') { navigate('/'); return }
    loadAll()
  }, [user])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, a, u, c] = await Promise.all([
        api.get('/admin/stats').then(r => r.data),
        api.get('/admin/attorneys').then(r => r.data),
        api.get('/admin/users').then(r => r.data),
        api.get('/admin/consultations').then(r => r.data),
      ])
      setStats(s); setAttorneys(a); setUsers(u.users || []); setConsultations(c)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const approveAttorney = async (id, approved) => {
    await api.patch(`/admin/attorneys/${id}/approve`, { approved })
    setAttorneys(prev => prev.map(a => a.id === id ? { ...a, is_approved: approved ? 1 : 0 } : a))
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', matched: 'bg-blue-100 text-blue-700', in_progress: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' }
  const statusLabel = { pending: '대기', matched: '매칭', in_progress: '진행중', completed: '완료', cancelled: '취소' }

  const filteredAttorneys = attorneys.filter(a =>
    !search || a.name?.includes(search) || a.email?.includes(search) || a.region?.includes(search)
  )
  const filteredUsers = users.filter(u =>
    !search || u.name?.includes(search) || u.email?.includes(search)
  )

  if (loading || !stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-gray-900 text-white px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">찾</div>
            <span className="font-bold">찾아줘노무사 관리자</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <div className="text-sm text-gray-400">{user.name}님 · <button onClick={() => navigate('/')} className="hover:text-white">사이트로</button></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="총 사용자" value={stats.total_users} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="전체 노무사" value={stats.total_attorneys} icon={Users} color="text-purple-600" bg="bg-purple-50"
            sub={`승인 대기 ${stats.pending_attorneys}명`} />
          <StatCard label="총 상담" value={stats.total_consultations} icon={MessageCircle} color="text-green-600" bg="bg-green-50"
            sub={`완료 ${stats.completed_consultations}건`} />
          <StatCard label="평균 평점" value={`${stats.avg_rating}점`} icon={Star} color="text-yellow-600" bg="bg-yellow-50"
            sub={`후기 ${stats.total_reviews}건`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-5 overflow-x-auto">
          {[['overview','최근 상담'],['attorneys','노무사 관리'],['users','사용자 관리'],['consultations','전체 상담']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* 검색 (attorneys, users 탭) */}
        {['attorneys', 'users'].includes(tab) && (
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="이름, 이메일, 지역 검색" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        )}

        {/* 최근 상담 */}
        {tab === 'overview' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 font-semibold text-gray-900">최근 상담 신청</div>
            <div className="divide-y divide-gray-50">
              {stats.recent_consultations?.map(c => (
                <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                  <span className={`tag ${statusColor[c.status]}`}>{statusLabel[c.status]}</span>
                  <span className="font-medium text-sm text-gray-900 flex-1 truncate">{c.title}</span>
                  <span className="text-xs text-gray-500">{c.user_name}</span>
                  <span className="text-xs text-gray-400">{c.created_at?.slice(0,10)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 노무사 관리 */}
        {tab === 'attorneys' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {['이름', '이메일', '사무소', '지역', '경력', '상담수', '평점', '상태', '승인'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAttorneys.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">{a.name}</td>
                      <td className="px-4 py-3 text-gray-500">{a.email}</td>
                      <td className="px-4 py-3 text-gray-600">{a.firm_name || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.region || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.career_years}년</td>
                      <td className="px-4 py-3 text-gray-600">{a.consultation_count}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-0.5 text-yellow-500 font-semibold">
                          ★ {a.avg_rating || '0.0'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${a.is_online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {a.is_online ? '온라인' : '오프라인'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {a.is_approved ? (
                          <button onClick={() => approveAttorney(a.id, false)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:underline font-medium">
                            <XCircle className="w-3.5 h-3.5" /> 승인 취소
                          </button>
                        ) : (
                          <button onClick={() => approveAttorney(a.id, true)}
                            className="flex items-center gap-1 text-xs text-green-600 hover:underline font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> 승인
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 사용자 관리 */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {['ID','이름','이메일','전화번호','역할','가입일'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{u.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">{u.phone || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`tag ${u.role === 'attorney' ? 'bg-blue-100 text-blue-700' : u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role === 'attorney' ? '노무사' : u.role === 'admin' ? '관리자' : '일반'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 전체 상담 */}
        {tab === 'consultations' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {['ID','제목','의뢰인','노무사','유형','상태','금액','일시'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {consultations.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{c.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{c.title}</td>
                      <td className="px-4 py-3 text-gray-600">{c.user_name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.attorney_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="tag bg-gray-100 text-gray-600">
                          {c.type === 'chat' ? '💬' : c.type === 'call' ? '📞' : '🏢'} {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${statusColor[c.status]}`}>{statusLabel[c.status] || c.status}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{(c.price || 0).toLocaleString()}원</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{c.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
