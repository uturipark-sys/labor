import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, MapPin, Clock, MessageCircle, Phone, Building, CheckCircle, ChevronRight } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

export default function AttorneyDetail() {
  const { id } = useParams()
  const auth = useAuth()
  const user = auth?.user
  const navigate = useNavigate()
  const [attorney, setAttorney] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConsult, setShowConsult] = useState(false)
  const [consultType, setConsultType] = useState('chat')
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('intro')

  useEffect(() => {
    api.get(`/attorneys/${id}`)
      .then(r => setAttorney(r.data))
      .catch(() => navigate('/find'))
      .finally(() => setLoading(false))
  }, [id])

  const handleConsult = async () => {
    if (!user) { navigate('/login'); return }
    if (!title.trim()) return alert('제목을 입력해주세요')
    setSubmitting(true)
    try {
      const r = await api.post('/consultations', {
        attorney_id: parseInt(id),
        type: consultType,
        topic,
        title,
        content,
      })
      navigate(`/chat/${r.data.id}`)
    } catch (e) {
      alert(e.response?.data?.error || '오류가 발생했어요')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!attorney) return null

  const days = Array.isArray(attorney.available_days)
    ? attorney.available_days
    : JSON.parse(attorney.available_days || '[]')
  const priceMap = { chat: attorney.chat_price, call: attorney.call_price, visit: attorney.visit_price }
  const typeLabel = { chat: '💬 채팅', call: '📞 전화', visit: '🏢 방문' }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-blue-700 text-3xl font-bold">
                {attorney.name?.[0]}
              </div>
              {attorney.is_online === 1 && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{attorney.name} <span className="text-gray-500 font-normal text-lg">노무사</span></h1>
                {attorney.is_online === 1 && (
                  <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">● 지금 상담 가능</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Building className="w-4 h-4" />{attorney.firm_name || '개인 사무소'}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{attorney.region}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <StarRow rating={Math.round(attorney.avg_rating)} />
                  <span className="font-bold text-gray-900 ml-1">{attorney.avg_rating || '0.0'}</span>
                  <span className="text-gray-400 text-sm">({attorney.review_count})</span>
                </div>
                <span className="text-sm text-gray-500">경력 {attorney.career_years}년</span>
                <span className="text-sm text-gray-500"><Clock className="w-3.5 h-3.5 inline mr-1" />평균 응답 {attorney.response_time}분</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(attorney.specialties || []).map(s => (
                  <span key={s} className="tag bg-blue-50 text-blue-700">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowConsult(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                채팅 상담 신청
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5" />
                전화 상담 신청
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-4">
            {[['intro','소개'], ['price','상담 가격'], ['reviews','후기']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'intro' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">노무사 소개</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {attorney.introduction || '소개글이 없어요.'}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">전문 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {(attorney.specialties || []).map(s => (
                    <div key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />{s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">상담 가능 시간</h3>
                <div className="flex gap-2 flex-wrap mb-3">
                  {['월','화','수','목','금','토','일'].map(d => (
                    <span key={d} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${days.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{d}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{attorney.available_from} ~ {attorney.available_to}</p>
              </div>
            </div>
          )}

          {activeTab === 'price' && (
            <div className="space-y-3">
              {[
                { type: 'chat', icon: '💬', label: '채팅 상담', desc: '실시간 텍스트 상담. 빠른 응답 보장.' },
                { type: 'call', icon: '📞', label: '전화 상담', desc: '통화로 자세한 상담을 받을 수 있어요.' },
                { type: 'visit', icon: '🏢', label: '방문 상담', desc: '직접 사무소를 방문해서 상담해요.' },
              ].map(({ type, icon, label, desc }) => (
                <div key={type} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-bold text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{desc}</div>
                      {attorney.free_first === 1 && type === 'chat' && (
                        <span className="text-xs text-green-600 font-medium">첫 상담 무료!</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-blue-600">{(priceMap[type] || 0).toLocaleString()}원</div>
                    <div className="text-xs text-gray-400">30분 기준</div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700">
                💡 첫 상담 후 만족하지 못하시면 100% 환불해드려요.
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {!attorney.reviews?.length ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">아직 후기가 없어요.</div>
              ) : attorney.reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm text-gray-900">{r.user_name?.replace(/(?<=.).(?=.)/g, '*')}</span>
                      {r.category && <span className="ml-2 tag bg-gray-100 text-gray-500">{r.category}</span>}
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{r.created_at?.slice(0,10)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - consult form */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">상담 신청하기</h3>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['chat', 'call', 'visit'].map(t => (
                <button key={t} onClick={() => setConsultType(t)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${consultType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {typeLabel[t]}
                </button>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-4 text-center">
              <div className="text-xs text-gray-500 mb-0.5">상담 금액</div>
              <div className="text-2xl font-bold text-blue-600">
                {attorney.free_first === 1 && consultType === 'chat' ? (
                  <span>무료 <span className="text-sm text-gray-400 line-through">{priceMap[consultType].toLocaleString()}원</span></span>
                ) : (
                  `${(priceMap[consultType] || 0).toLocaleString()}원`
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">상담 주제</label>
                <select className="input-field text-sm" value={topic} onChange={e => setTopic(e.target.value)}>
                  <option value="">선택해주세요</option>
                  {['임금체불','퇴직금','부당해고','직장내괴롭힘','성희롱','산업재해','실업급여','근로계약','4대보험','기타'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">제목</label>
                <input className="input-field text-sm" placeholder="상담 제목을 입력해주세요" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">상담 내용</label>
                <textarea rows={3} className="input-field text-sm resize-none" placeholder="상담 내용을 간단히 적어주세요"
                  value={content} onChange={e => setContent(e.target.value)} />
              </div>
              <button
                onClick={handleConsult}
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                {user ? '상담 신청하기' : '로그인 후 신청'}
              </button>
              {!user && <p className="text-xs text-center text-gray-400">로그인이 필요해요</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
