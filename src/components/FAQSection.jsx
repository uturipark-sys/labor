import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { faqs } from '../data/faqs'

const categories = ['전체', '서비스 안내', '이용 방법', '법적 효력', '저작권']

function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <span className="tag bg-blue-50 text-blue-600 shrink-0 mt-0.5">{faq.category}</span>
          <span className="font-semibold text-gray-900 text-sm leading-relaxed">{faq.question}</span>
        </div>
        <div className="shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
          {isOpen
            ? <Minus className="w-3.5 h-3.5 text-gray-600" />
            : <Plus className="w-3.5 h-3.5 text-gray-600" />
          }
        </div>
      </button>
      <div
        className={`accordion-content ${isOpen ? 'open' : ''}`}
        style={{ maxHeight: isOpen ? '500px' : '0' }}
      >
        <div className="px-5 pb-5">
          <div className="pl-3 border-l-2 border-blue-200">
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [openId, setOpenId] = useState(1)
  const [activeCategory, setActiveCategory] = useState('전체')

  const filtered = activeCategory === '전체'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold text-sm mb-2">자주 묻는 질문</p>
          <h2 className="section-title">궁금한 게 있으신가요?</h2>
          <p className="section-subtitle">자주 묻는 질문들을 모아봤어요.</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(faq => (
            <AccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-3">원하는 답변을 못 찾으셨나요?</p>
          <a
            href="tel:1661-1071"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors text-sm shadow-sm"
          >
            📞 1661-1071로 문의하기
          </a>
        </div>
      </div>
    </section>
  )
}
