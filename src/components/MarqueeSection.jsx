const items = [
  { emoji: '⚖️', label: '부당해고' },
  { emoji: '💰', label: '임금체불' },
  { emoji: '🏥', label: '산업재해' },
  { emoji: '📋', label: '실업급여' },
  { emoji: '✍️', label: '근로계약서' },
  { emoji: '🛡️', label: '직장내 괴롭힘' },
  { emoji: '👶', label: '육아휴직' },
  { emoji: '📌', label: '4대보험' },
  { emoji: '💼', label: '퇴직금' },
  { emoji: '🔍', label: '취업규칙' },
  { emoji: '📊', label: '인사노무관리' },
  { emoji: '🏢', label: '고용장려금' },
  { emoji: '⏰', label: '연장근로수당' },
  { emoji: '🩺', label: '직업성 질병' },
  { emoji: '📝', label: '노동위원회' },
  { emoji: '🤝', label: '단체교섭' },
]

const doubled = [...items, ...items]

export default function MarqueeSection() {
  return (
    <section className="py-10 bg-blue-600 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 mx-4 bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap backdrop-blur-sm"
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
