import { useState } from 'react'
import { X, ArrowRight, Star, Shield, Clock, MessageCircle, FileText, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const slides = [
  {
    badge: '🎉 회원가입 이벤트',
    title: '노무 문제,\n혼자 고민하지 마세요.',
    subtitle: '전국 1,200+ 노무사와 5분 안에 연결해드려요.\n첫 상담은 무료예요.',
    cta: '무료로 상담 신청하기',
    ctaLink: '/consultation',
    icon: MessageCircle,
    color: 'blue',
    bg: 'from-blue-50 to-indigo-50',
    accent: 'bg-blue-600',
    textAccent: 'text-blue-600',
    borderAccent: 'border-blue-200',
  },
  {
    badge: '✍️ 무료 서비스',
    title: '근로계약서,\n직접 만들고 카톡으로 사인까지.',
    subtitle: '복잡한 근로계약서를 쉽고 빠르게 작성하고\n전자서명까지 한 번에 해결해요.',
    cta: '근로계약서 작성하기',
    ctaLink: '/contract',
    icon: FileText,
    color: 'green',
    bg: 'from-green-50 to-teal-50',
    accent: 'bg-green-600',
    textAccent: 'text-green-600',
    borderAccent: 'border-green-200',
  },
  {
    badge: '🏆 국내 1위',
    title: '믿을 수 있는\n노무사 비교 플랫폼.',
    subtitle: '누적 상담 50만 건, 노무사 후기 10만 건.\n수수료 비교로 합리적인 선택을 해보세요.',
    cta: '노무사 비교하기',
    ctaLink: '/compare',
    icon: Users,
    color: 'orange',
    bg: 'from-orange-50 to-amber-50',
    accent: 'bg-orange-500',
    textAccent: 'text-orange-500',
    borderAccent: 'border-orange-200',
  },
]

const badges = [
  { icon: Star, label: '평균 평점 4.8', color: 'text-yellow-500' },
  { icon: Shield, label: '전문 자격 검증', color: 'text-blue-500' },
  { icon: Clock, label: '평균 응답 7분', color: 'text-green-500' },
]

export default function ServiceIntroModal({ onClose }) {
  const [active, setActive] = useState(0)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-sm text-blue-600 font-semibold mb-1">서비스 소개</p>
            <h2 className="text-2xl font-bold text-gray-900">찾아줘노무사가 하는 일</h2>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2 mb-6">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  active === i
                    ? `${s.accent} text-white border-transparent`
                    : `bg-white text-gray-500 ${s.borderAccent} hover:bg-gray-50`
                }`}
              >
                {s.badge}
              </button>
            ))}
          </div>

          {/* Active slide content */}
          {slides.map((slide, i) => {
            const Icon = slide.icon
            return (
              <div
                key={i}
                className={`transition-all duration-300 ${active === i ? 'block' : 'hidden'}`}
              >
                <div className={`bg-gradient-to-br ${slide.bg} rounded-2xl p-8 mb-6`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${slide.accent} rounded-2xl shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">{slide.badge}</p>
                      <h3
                        className="text-2xl font-bold text-gray-900 mb-3 leading-snug"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {slide.title}
                      </h3>
                      <p
                        className="text-gray-600 leading-relaxed"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to={slide.ctaLink}
                  onClick={onClose}
                  className={`flex items-center justify-center gap-2 w-full ${slide.accent} text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity`}
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )
          })}

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            {badges.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
                <Icon className={`w-4 h-4 ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
