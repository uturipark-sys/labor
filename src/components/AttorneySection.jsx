import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AttorneyCard from './AttorneyCard'
import api from '../lib/api'

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'worker', label: '👷 근로자', filter: a => a.specialties?.some(s => ['임금체불','부당해고','산재','퇴직금','실업급여','직장내괴롭힘'].includes(s)) },
  { id: 'business', label: '🏢 사업자', filter: a => a.specialties?.some(s => ['4대보험','취업규칙','인사노무','정부지원금'].includes(s)) },
  { id: 'subsidy', label: '💰 지원금', filter: a => a.specialties?.some(s => ['정부지원금','고용장려금'].includes(s)) },
]

export default function AttorneySection() {
  const [activeTab, setActiveTab] = useState('all')
  const [attorneys, setAttorneys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/attorneys').then(r => setAttorneys(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const currentTab = tabs.find(t => t.id === activeTab)
  const displayed = activeTab === 'all' ? attorneys : attorneys.filter(currentTab.filter || (() => true))

  // API 데이터를 AttorneyCard 형식으로 변환
  const toCard = a => ({
    id: a.id,
    name: a.name,
    firm: a.firm_name || '개인 사무소',
    location: a.region || '지역 미설정',
    specialties: a.specialties || [],
    rating: a.avg_rating || 0,
    reviewCount: a.review_count || 0,
    responseTime: `평균 ${a.response_time || 30}분`,
    isOnline: a.is_online === 1,
    isRecommended: a.avg_rating >= 4.8 || a.review_count >= 50,
    experience: a.career_years || 0,
    price: a.chat_price || 30000,
    intro: a.introduction || '',
  })

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-600 font-semibold text-sm mb-2">실시간 채팅상담</p>
            <h2 className="section-title">지금 바로 연결 가능한<br className="sm:hidden" /> 노무사예요</h2>
          </div>
          <Link to="/find" className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline shrink-0">
            전체 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.slice(0, 6).map(a => (
              <AttorneyCard key={a.id} attorney={toCard(a)} />
            ))}
            {displayed.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-400">해당 분야의 노무사가 없어요.</div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/find" className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
            노무사 더 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
