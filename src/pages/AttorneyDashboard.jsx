import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Star, TrendingUp, User, Settings, Bell, Power, ChevronRight, Clock, Save, Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { connectSocket } from '../lib/socket'

const ALL_SPECIALTIES = ['임금체불', '퇴직금', '부당해고', '직장내괴롭힘', '성희롱', '산업재해', '실업급여', '근로계약', '4대보험', '취업규칙', '정부지원금', '육아휴직', '노동위원회', '인사노무', '기타']
const ALL_DAYS = ['월', '화', '수', '목', '금', '토', '일']

export default function AttorneyDashboard() {
  const { user, attorney, refreshMe } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [consultations, setConsultations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isOnline, setIsOnline] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'attorney') { navigate('/'); return }

    loadData()

    const token = localStorage.getItem('token')
    connectSocket(token)
  }, [user])

  useEffect(() => {
    if (attorney) {
      setIsOnline(attorney.is_online === 1)
      setProfile({
        firm_name: attorney.firm_name || '',
        introduction: attorney.introduction || '',
        career_years: attorney.career_years || 0,
        region: attorney.region || '',
        address: attorney.address || '',
        chat_price: attorney.chat_price || 30000,
        call_price: attorney.call_price || 50000,
        visit_price: attorney.visit_price || 100000,
        free_first: attorney.free_first === 1,
        available_from: attorney.available_from || '09:00',
        available_to: attorney.available_to || '18:00',
        available_days: attorney.available_days || [],
        specialties: attorney.specialties || [],
      })
    }
  }, [attorney])

  const loadData = async () => {
    const [consults, notifs] = await Promise.all([
      api.get('/consultations/my').then(r => r.data).catch(() => []),
      api.get('/notifications').then(r => r.data).catch(() => []),
    ])
    setConsultations(consults)
    setNotifications(notifs)
  }

  const toggleOnline = async () => {
    const next = !isOnline
    await api.patch('/attorneys/status/online', { is_online: next })
    setIsOnline(next)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.put('/attorneys/profile/me', profile)
      await refreshMe()
      alert('저장되었어요!')
    } catch (e) {
      alert(e.response?.data?.error || '저장 중 오류가 발생했어요')
    } finally { setSaving(false) }
  }

  const toggleSpecialty = s => {
    setProfile(p => ({
      ...p,
      specialties: p.specialties.includes(s) ? p.specialties.filter(x => x !== s) : [...p.specialties, s]
    }))
  }

  const toggleDay = d => {
    setProfile(p => ({
      ...p,
      available_days: p.available_days.includes(d) ? p.available_days.filter(x => x !== d) : [...p.available_days, d]
    }))
  }

  const stats = {
    total: consultations.length,
    active: consultations.filter(c => c.status === 'matched' || c.status === 'in_progress').length,
    completed: consultations.filter(c => c.status === 'completed').length,
    unread: notifications.filter(n => !n.is_read).length,
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', matched: 'bg-blue-100 text-blue-700', in_progress: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' }
  const statusLabel = { pending: '대기', matched: '매칭됨', in_progress: '상담중', completed: '완료', cancelled: '취소' }

  if (!user || !profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">노무사 대시보드</h1>
            <p className="text-sm text-gray-500">{user.name} 노무사님, 안녕하세요!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isOnline ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Power className="w-4 h-4" />
              {isOnline ? '온라인' : '오프라인'}
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
              {stats.unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{stats.unread}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '전체 상담', value: stats.total, icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '진행 중', value: stats.active, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '완료된 상담', value: stats.completed, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: '새 알림', value: stats.unread, icon: Bell, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-5 overflow-x-auto">
          {[['overview','상담 목록'],['profile','프로필 설정'],['price','가격 설정'],['notifications','알림']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* 상담 목록 */}
        {tab === 'overview' && (
          <div className="space-y-3">
            {consultations.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500">아직 상담 신청이 없어요.</p>
                <p className="text-sm text-gray-400 mt-1">온라인 상태로 전환하면 상담을 받을 수 있어요.</p>
              </div>
            ) : consultations.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`tag ${statusColor[c.status] || 'bg-gray-100 text-gray-500'}`}>{statusLabel[c.status] || c.status}</span>
                    {c.topic && <span className="tag bg-blue-50 text-blue-700">{c.topic}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.user_name} · {c.created_at?.slice(0,10)}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-blue-600 mb-1">{(c.price || 0).toLocaleString()}원</div>
                  <Link to={`/chat/${c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                    채팅방 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 프로필 설정 */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">사무소/법인명</label>
                <input className="input-field" value={profile.firm_name} onChange={e => setProfile(p => ({ ...p, firm_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">경력 (년)</label>
                <input type="number" className="input-field" value={profile.career_years} onChange={e => setProfile(p => ({ ...p, career_years: +e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">활동 지역</label>
              <input className="input-field" placeholder="서울 강남구" value={profile.region} onChange={e => setProfile(p => ({ ...p, region: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">자기소개</label>
              <textarea rows={5} className="input-field resize-none" value={profile.introduction} onChange={e => setProfile(p => ({ ...p, introduction: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">전문 분야 선택</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SPECIALTIES.map(s => (
                  <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      profile.specialties.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}>
                    {profile.specialties.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">상담 가능 요일</label>
              <div className="flex gap-2">
                {ALL_DAYS.map(d => (
                  <button key={d} type="button" onClick={() => toggleDay(d)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${profile.available_days.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">상담 시작 시간</label>
                <input type="time" className="input-field" value={profile.available_from} onChange={e => setProfile(p => ({ ...p, available_from: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">상담 종료 시간</label>
                <input type="time" className="input-field" value={profile.available_to} onChange={e => setProfile(p => ({ ...p, available_to: e.target.value }))} />
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        )}

        {/* 가격 설정 */}
        {tab === 'price' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            {[
              { key: 'chat_price', label: '💬 채팅 상담 가격', desc: '30분 기준' },
              { key: 'call_price', label: '📞 전화 상담 가격', desc: '30분 기준' },
              { key: 'visit_price', label: '🏢 방문 상담 가격', desc: '1시간 기준' },
            ].map(({ key, label, desc }) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label} <span className="text-gray-400 font-normal">({desc})</span></label>
                <div className="relative">
                  <input type="number" className="input-field pr-10" value={profile[key]}
                    onChange={e => setProfile(p => ({ ...p, [key]: +e.target.value }))} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
            ))}
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-green-50 rounded-xl">
              <input type="checkbox" className="w-4 h-4 accent-green-600"
                checked={profile.free_first}
                onChange={e => setProfile(p => ({ ...p, free_first: e.target.checked }))} />
              <div>
                <div className="font-semibold text-green-800 text-sm">첫 상담 무료 제공</div>
                <div className="text-xs text-green-600">첫 채팅 상담을 무료로 제공해 더 많은 의뢰인을 유치해요</div>
              </div>
            </label>
            <button onClick={saveProfile} disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '가격 저장'}
            </button>
          </div>
        )}

        {/* 알림 */}
        {tab === 'notifications' && (
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-400">알림이 없어요.</div>
            ) : notifications.map(n => (
              <div key={n.id} className={`bg-white rounded-2xl p-4 border flex gap-3 ${n.is_read ? 'border-gray-100 opacity-60' : 'border-blue-100'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.is_read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <div>
                  <div className="font-semibold text-sm text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.body}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.created_at?.slice(0,16)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
