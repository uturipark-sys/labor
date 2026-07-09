import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const topics = [
  '임금체불', '퇴직금', '부당해고', '직장내 괴롭힘', '성희롱',
  '산업재해', '실업급여', '근로계약', '4대보험', '기타',
]

export default function ConsultationForm() {
  const [form, setForm] = useState({
    name: '', phone: '', topic: '', title: '', content: '', method: 'chat',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="py-16 md:py-20 bg-blue-50">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">상담 신청이 완료되었어요!</h3>
            <p className="text-gray-500 mb-6">
              담당 노무사가 곧 연락드릴 거예요.<br />평균 응답 시간은 <strong>7분</strong>이에요.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              다시 신청하기
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left text */}
          <div className="lg:w-[380px] shrink-0">
            <p className="text-blue-600 font-semibold text-sm mb-2">24시간 무료 상담</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              지금 바로<br />상담 신청해요.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              밤이든 낮이든 상관없어요.<br />
              전문 노무사가 기다리고 있어요.
            </p>
            <div className="space-y-4">
              {[
                { step: '01', title: '신청서 작성', desc: '상담 주제와 내용을 간단히 작성해요' },
                { step: '02', title: '노무사 매칭', desc: '전문 분야에 맞는 노무사와 연결돼요' },
                { step: '03', title: '상담 시작', desc: '채팅 또는 전화로 즉시 상담을 시작해요' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {step}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{title}</div>
                    <div className="text-gray-500 text-sm">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    required
                    className="input-field"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    required
                    className="input-field"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">상담 주제</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, topic: t })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        form.topic === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">상담 방식</label>
                <div className="flex gap-3">
                  {[
                    { value: 'chat', label: '💬 채팅 상담' },
                    { value: 'call', label: '📞 전화 상담' },
                    { value: 'visit', label: '🏢 방문 상담' },
                  ].map(({ value, label }) => (
                    <label key={value} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${
                      form.method === value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-blue-200'
                    }`}>
                      <input
                        type="radio"
                        name="method"
                        value={value}
                        className="hidden"
                        checked={form.method === value}
                        onChange={e => setForm({ ...form, method: e.target.value })}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
                <input
                  type="text"
                  placeholder="상담 제목을 간략하게 입력해주세요"
                  className="input-field"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">상담 내용</label>
                <textarea
                  placeholder="상담하실 내용을 자세히 적어주세요. 자세할수록 정확한 도움을 드릴 수 있어요."
                  rows={4}
                  className="input-field resize-none"
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-base"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    무료 상담 신청하기
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                개인정보는 상담 목적으로만 사용되며 안전하게 보호돼요.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
