import { useState } from 'react'
import { Calculator as CalcIcon, ChevronRight } from 'lucide-react'

const calcs = ['퇴직금', '실업급여', '4대보험', '연장근로수당', '연차수당']

function RetirementCalc() {
  const [form, setForm] = useState({ salary: '', period: '', bonus: '' })
  const [result, setResult] = useState(null)

  const calc = () => {
    const s = parseFloat(form.salary.replace(/,/g, '')) || 0
    const months = parseFloat(form.period) || 0
    const b = parseFloat(form.bonus.replace(/,/g, '')) || 0
    const dailyWage = (s * 3 + b / 12 * 3) / 90
    const years = months / 12
    const retirement = Math.floor(dailyWage * 30 * years)
    setResult(retirement)
  }

  const fmt = n => n.toLocaleString()

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">월 평균 임금</label>
        <div className="relative">
          <input
            type="text"
            placeholder="3,000,000"
            className="input-field pr-10"
            value={form.salary}
            onChange={e => setForm({ ...form, salary: e.target.value })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">근속 기간</label>
        <div className="relative">
          <input
            type="number"
            placeholder="24"
            className="input-field pr-14"
            value={form.period}
            onChange={e => setForm({ ...form, period: e.target.value })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">개월</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">연간 상여금 (없으면 0)</label>
        <div className="relative">
          <input
            type="text"
            placeholder="0"
            className="input-field pr-10"
            value={form.bonus}
            onChange={e => setForm({ ...form, bonus: e.target.value })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
        </div>
      </div>

      <button
        onClick={calc}
        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
      >
        퇴직금 계산하기
      </button>

      {result !== null && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">예상 퇴직금</p>
          <p className="text-3xl font-bold text-blue-600">{fmt(result)}<span className="text-lg ml-1">원</span></p>
          <p className="text-xs text-gray-400 mt-2">
            * 세전 금액이며, 실제 수령액은 퇴직소득세가 공제돼요.<br />
            * 정확한 계산은 노무사 상담을 통해 확인하세요.
          </p>
        </div>
      )}
    </div>
  )
}

function UnemploymentCalc() {
  const [form, setForm] = useState({ salary: '', age: '', period: '' })
  const [result, setResult] = useState(null)

  const calc = () => {
    const s = parseFloat(form.salary.replace(/,/g, '')) || 0
    const months = parseFloat(form.period) || 0

    const daily = (s / 30) * 0.6
    const maxDaily = 66000
    const minDaily = 8720
    const dailyBenefit = Math.min(Math.max(daily, minDaily), maxDaily)

    let weeks = 120
    if (months >= 12 && months < 36) weeks = 150
    else if (months >= 36 && months < 60) weeks = 180
    else if (months >= 60 && months < 120) weeks = 210
    else if (months >= 120) weeks = 240

    const total = Math.floor(dailyBenefit * weeks)
    setResult({ daily: Math.floor(dailyBenefit), total, weeks })
  }

  const fmt = n => n.toLocaleString()

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">퇴직 전 3개월 평균 월 급여</label>
        <div className="relative">
          <input type="text" placeholder="3,000,000" className="input-field pr-10"
            value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">고용보험 가입 기간</label>
        <div className="relative">
          <input type="number" placeholder="24" className="input-field pr-14"
            value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">개월</span>
        </div>
      </div>

      <button onClick={calc} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors">
        실업급여 계산하기
      </button>

      {result && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
          <div>
            <p className="text-xs text-gray-500">1일 실업급여</p>
            <p className="text-xl font-bold text-blue-600">{fmt(result.daily)}원</p>
          </div>
          <div className="border-t border-blue-100 pt-3">
            <p className="text-xs text-gray-500">총 예상 수령액 ({result.weeks}일 기준)</p>
            <p className="text-3xl font-bold text-blue-600">{fmt(result.total)}<span className="text-lg ml-1">원</span></p>
          </div>
          <p className="text-xs text-gray-400">* 이직 사유, 나이 등에 따라 달라질 수 있어요.</p>
        </div>
      )}
    </div>
  )
}

export default function Calculator() {
  const [activeCalc, setActiveCalc] = useState('퇴직금')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-2">
            <CalcIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">자동 세금·급여 계산기</h1>
          </div>
          <p className="text-gray-500">복잡한 계산, 자동으로 해드려요.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calc selector */}
          <aside className="lg:w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {calcs.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCalc(c)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                    activeCalc === c ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {c} 계산기
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>
          </aside>

          {/* Calc form */}
          <div className="flex-1 max-w-lg">
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">{activeCalc} 계산기</h2>
              {activeCalc === '퇴직금' && <RetirementCalc />}
              {activeCalc === '실업급여' && <UnemploymentCalc />}
              {!['퇴직금', '실업급여'].includes(activeCalc) && (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🚧</div>
                  <p className="text-gray-500 text-sm">준비 중이에요. 곧 오픈할게요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
