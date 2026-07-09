import { Link } from 'react-router-dom'
import { MessageCircle, FileText, Calculator, Search, Star, Shield } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: '실시간 채팅 상담',
    description: '전문 노무사와 24시간 채팅으로 연결해요. 평균 7분 안에 응답을 받을 수 있어요.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    link: '/consultation',
    linkLabel: '상담 시작하기',
  },
  {
    icon: Search,
    title: '노무사 직접 찾기',
    description: '지역, 전문분야, 가격으로 필터링해서 원하는 노무사를 직접 선택할 수 있어요.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    link: '/find',
    linkLabel: '노무사 찾기',
  },
  {
    icon: FileText,
    title: '근로계약서 무료 작성',
    description: '법적 요건을 갖춘 근로계약서를 무료로 작성하고 카카오톡으로 전자서명까지 받아요.',
    color: 'text-green-600',
    bg: 'bg-green-50',
    link: '/contract',
    linkLabel: '계약서 작성하기',
  },
  {
    icon: Calculator,
    title: '자동 세금 계산기',
    description: '퇴직금, 실업급여, 4대보험, 연장근로수당 등을 자동으로 계산해드려요.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    link: '/calculator',
    linkLabel: '계산하기',
  },
  {
    icon: Star,
    title: '수수료 비교 견적',
    description: '여러 노무사에게 동시에 견적을 요청하고 수수료를 비교해서 가장 합리적인 선택을 해요.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    link: '/compare',
    linkLabel: '견적 요청하기',
  },
  {
    icon: Shield,
    title: '노무 Q&A 게시판',
    description: '유사한 사례를 검색하거나 직접 질문을 올리면 전문 노무사가 답변해드려요.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    link: '/qna',
    linkLabel: 'Q&A 보기',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm mb-2">우리가 제공하는 것</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            노무 문제, 이렇게 도와드려요
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            상담부터 서류 작성, 비용 비교까지.<br />
            노무 문제 해결에 필요한 모든 것이 여기 있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg, link, linkLabel }) => (
            <div key={title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 group">
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>
              <Link
                to={link}
                className={`text-sm font-semibold ${color} hover:underline flex items-center gap-1`}
              >
                {linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
