import { useState } from 'react'
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react'
import AttorneyCard from '../components/AttorneyCard'
import { attorneys } from '../data/attorneys'

const regions = ['전체', '서울', '경기', '부산', '인천', '대구', '광주', '대전', '울산']
const specialtyList = ['전체', '임금체불', '부당해고', '산재', '퇴직금', '실업급여', '직장내괴롭힘', '4대보험', '근로계약', '정부지원금']
const sortOptions = ['추천순', '평점순', '리뷰순', '가격낮은순', '응답빠른순']

export default function FindAttorney() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('전체')
  const [specialty, setSpecialty] = useState('전체')
  const [sort, setSort] = useState('추천순')
  const [onlineOnly, setOnlineOnly] = useState(false)

  const filtered = attorneys
    .filter(a => {
      if (onlineOnly && !a.isOnline) return false
      if (region !== '전체' && !a.location.includes(region)) return false
      if (specialty !== '전체' && !a.specialties.includes(specialty)) return false
      if (search && !a.name.includes(search) && !a.firm.includes(search) && !a.specialties.some(s => s.includes(search))) return false
      return true
    })
    .sort((a, b) => {
      if (sort === '평점순') return b.rating - a.rating
      if (sort === '리뷰순') return b.reviewCount - a.reviewCount
      if (sort === '가격낮은순') return a.price - b.price
      return 0
    })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">노무사 직접 찾기</h1>
          <p className="text-gray-500">전국 {attorneys.length}명의 전문 노무사를 검색하고 바로 상담하세요.</p>

          {/* Search */}
          <div className="relative mt-5 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 사무소, 전문분야로 검색"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-6 sticky top-20">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> 지역
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {regions.map(r => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        region === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" /> 전문분야
                </h3>
                <div className="flex flex-col gap-1.5">
                  {specialtyList.map(s => (
                    <button
                      key={s}
                      onClick={() => setSpecialty(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                        specialty === s ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlineOnly}
                    onChange={e => setOnlineOnly(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">온라인 가능만</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <strong className="text-gray-900">{filtered.length}명</strong>의 노무사
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500">검색 결과가 없어요. 다른 조건으로 검색해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(attorney => (
                  <AttorneyCard key={attorney.id} attorney={attorney} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
