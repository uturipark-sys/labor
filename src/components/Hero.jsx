import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Clock } from 'lucide-react'

const slides = [
  {
    badge: '🎉 회원가입 이벤트',
    title: '노무 문제,\n혼자 고민하지 마세요.',
    subtitle: '전국 1,200+ 노무사와 5분 안에 연결해드려요.\n첫 상담은 무료예요.',
    cta: '무료로 상담 신청하기',
    ctaLink: '/consultation',
    bg: 'from-blue-50 via-indigo-50 to-purple-50',
    accent: 'bg-blue-600',
  },
  {
    badge: '✍️ 무료 서비스',
    title: '근로계약서,\n직접 만들고 카톡으로 사인까지.',
    subtitle: '복잡한 근로계약서를 쉽고 빠르게 작성하고\n전자서명까지 한 번에 해결해요.',
    cta: '근로계약서 작성하기',
    ctaLink: '/contract',
    bg: 'from-green-50 via-teal-50 to-cyan-50',
    accent: 'bg-green-600',
  },
  {
    badge: '🏆 국내 1위',
    title: '믿을 수 있는\n노무사 비교 플랫폼.',
    subtitle: '누적 상담 50만 건, 노무사 후기 10만 건.\n수수료 비교로 합리적인 선택을 해보세요.',
    cta: '노무사 비교하기',
    ctaLink: '/compare',
    bg: 'from-orange-50 via-amber-50 to-yellow-50',
    accent: 'bg-orange-500',
  },
]

const badges = [
  { icon: Star, label: '평균 평점 4.8', color: 'text-yellow-500' },
  { icon: Shield, label: '전문 자격 검증', color: 'text-blue-500' },
  { icon: Clock, label: '평균 응답 7분', color: 'text-green-500' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = slides[current]

  return (
    <section className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
      <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm mb-6">
              <span>{slide.badge}</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4"
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.title}
            </h1>

            <p
              className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-200 text-base"
              >
                {slide.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/find"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-200 text-base"
              >
                노무사 직접 찾기
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mt-8 justify-center lg:justify-start">
              {badges.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">실시간 무료 노무 상담</h3>
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  지금 연결 가능
                </span>
              </div>

              {/* Mock chat */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    김
                  </div>
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tl-sm px-3 py-2 max-w-[75%]">
                    안녕하세요! 어떤 노무 문제로 상담하시겠어요? 😊
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[75%]">
                    퇴직금을 아직 못 받았어요...
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                    김
                  </div>
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tl-sm px-3 py-2 max-w-[75%]">
                    걱정 마세요! 퇴직금은 퇴직일로부터 14일 이내에 지급해야 해요. 지금 바로 도움드릴게요 💪
                  </div>
                </div>
              </div>

              <Link
                to="/consultation"
                className="block text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                무료로 상담 시작하기 →
              </Link>

              <p className="text-center text-xs text-gray-400">
                신용카드 필요 없음 · 언제든지 취소 가능
              </p>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-8 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
