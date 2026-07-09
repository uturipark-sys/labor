import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 520000, label: '누적 상담 신청', suffix: '건+', description: '근로자와 사업주가 선택한 노무 플랫폼' },
  { value: 1200, label: '제휴 노무사', suffix: '명+', description: '전국 각지의 전문 노무사' },
  { value: 98, label: '이용자 만족도', suffix: '%', description: '실제 이용자 평균 만족도' },
  { value: 100000, label: '누적 후기', suffix: '건+', description: '검증된 실제 이용 후기' },
]

function useCountUp(target, duration = 1500, started = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let start = null
    const step = timestamp => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])

  return count
}

function StatItem({ value, label, suffix, description, started }) {
  const count = useCountUp(value, 1500, started)

  const format = n => {
    if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}만`
    if (n >= 1000) return n.toLocaleString()
    return n
  }

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">
        {format(count)}{suffix}
      </div>
      <div className="text-gray-900 font-semibold mb-1">{label}</div>
      <div className="text-gray-500 text-sm">{description}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 md:py-20 bg-white border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm mb-2">숫자로 증명해요</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            대한민국 1위 노무사 플랫폼
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map(s => (
            <StatItem key={s.label} {...s} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
