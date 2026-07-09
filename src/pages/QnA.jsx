import { useState } from 'react'
import { Search, Plus, ThumbsUp, MessageCircle, Eye } from 'lucide-react'

const sampleQnA = [
  {
    id: 1, category: '임금체불', status: '답변완료', views: 1234, likes: 45, comments: 3,
    title: '퇴직 후 마지막 월급을 아직 못 받았는데 어떻게 해야 하나요?',
    content: '지난달 말에 퇴직했는데 퇴직 전 마지막 달 급여를 아직도 못 받고 있어요. 회사에 연락해도 바쁘다는 말만 하는데...',
    date: '2024-02-10', authorType: '근로자',
    answer: { attorney: '김민준 노무사', date: '2024-02-10',
      content: '임금은 퇴직 후 14일 이내에 지급되어야 해요(근로기준법 제36조). 이를 위반하면 3년 이하의 징역 또는 3천만원 이하의 벌금에 해당해요. 고용노동부 임금체불 신고센터(1350)에 신고하거나, 관할 노동지청에 진정을 제기할 수 있어요.' }
  },
  {
    id: 2, category: '부당해고', status: '답변완료', views: 892, likes: 31, comments: 2,
    title: '문자 한 통으로 해고 통보를 받았는데 이게 맞나요?',
    content: '갑자기 대표한테서 문자로 "내일부터 나오지 마세요"라는 메시지를 받았어요. 이런 식의 해고가 합법인지...',
    date: '2024-02-08', authorType: '근로자',
    answer: { attorney: '이수진 노무사', date: '2024-02-08',
      content: '30일 이상 근무한 근로자는 해고 30일 전에 서면으로 해고 예고를 해야 해요. 문자는 서면으로 인정되지 않으며, 문자로 즉시 해고 통보는 부당해고에 해당할 가능성이 높아요. 해고일로부터 3개월 이내에 노동위원회에 구제신청을 하실 수 있어요.' }
  },
  {
    id: 3, category: '실업급여', status: '답변완료', views: 2341, likes: 89, comments: 5,
    title: '자진 퇴사해도 실업급여를 받을 수 있는 경우가 있나요?',
    content: '원래 자진 퇴사하면 실업급여를 못 받는 걸로 알고 있었는데, 친구가 자진 퇴사했는데도 받았다고 해서요...',
    date: '2024-02-05', authorType: '근로자',
    answer: { attorney: '최지영 노무사', date: '2024-02-06',
      content: '자진퇴사여도 실업급여를 받을 수 있는 예외 사유가 있어요! 임금 체불, 직장 내 괴롭힘, 성희롱, 사업장 이전으로 출퇴근이 곤란한 경우, 건강 악화, 가족 돌봄 필요 등이 해당돼요. 정확한 판단은 노무사 상담을 통해 확인해 보세요.' }
  },
  {
    id: 4, category: '4대보험', status: '답변대기', views: 234, likes: 8, comments: 0,
    title: '아르바이트생도 4대보험에 가입해야 하나요?',
    content: '카페 알바를 하고 있는데 사장님이 4대보험을 안 해준다고 해서요. 주 15시간 이상 일하는데...',
    date: '2024-02-12', authorType: '근로자',
    answer: null
  },
]

const categories = ['전체', '임금체불', '부당해고', '실업급여', '퇴직금', '산재', '4대보험', '직장내괴롭힘', '근로계약']

export default function QnA() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('전체')
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const filtered = sampleQnA.filter(q => {
    if (category !== '전체' && q.category !== category) return false
    if (search && !q.title.includes(search) && !q.content.includes(search)) return false
    return true
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">노무 Q&A</h1>
            <p className="text-gray-500">전문 노무사가 직접 답변해드려요.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            질문 올리기
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">질문 작성</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories.slice(1).map(c => (
                  <button key={c} className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 hover:border-blue-400 transition-colors">
                    {c}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="질문 제목을 입력해주세요" className="input-field" />
              <textarea rows={4} placeholder="궁금한 내용을 자세히 작성해주세요. 자세할수록 정확한 답변을 받을 수 있어요." className="input-field resize-none" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">취소</button>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">질문 등록</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="질문 검색" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="space-y-3">
          {filtered.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button className="w-full text-left p-5" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                <div className="flex items-start gap-3 flex-wrap">
                  <span className={`tag shrink-0 ${q.status === '답변완료' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                    {q.status}
                  </span>
                  <span className="tag bg-gray-100 text-gray-600 shrink-0">{q.category}</span>
                  <h3 className="font-semibold text-gray-900 text-sm flex-1 min-w-0">{q.title}</h3>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>{q.date}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{q.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{q.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{q.comments}</span>
                </div>
              </button>

              {expanded === q.id && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed pt-4 pb-4">{q.content}</p>
                  {q.answer && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">전</div>
                        <div>
                          <span className="font-semibold text-sm text-blue-700">{q.answer.attorney}</span>
                          <span className="text-xs text-gray-400 ml-2">{q.answer.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{q.answer.content}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
