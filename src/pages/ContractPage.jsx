import { useState } from 'react'
import { FileText, Download, Send, CheckCircle } from 'lucide-react'

const contractTypes = ['근로계약서 (정규직)', '근로계약서 (기간제)', '아르바이트 계약서', '프리랜서 계약서', '촉탁직 계약서']

export default function ContractPage() {
  const [step, setStep] = useState(1)
  const [type, setType] = useState('')
  const [form, setForm] = useState({
    companyName: '', employerName: '', workerName: '', workerBirth: '',
    startDate: '', endDate: '', position: '', duties: '',
    salary: '', payDay: '10', workHours: '40', breakTime: '60',
    workDays: [], address: '',
  })
  const [generated, setGenerated] = useState(false)

  const days = ['월', '화', '수', '목', '금', '토', '일']

  const toggleDay = d => {
    setForm(f => ({
      ...f,
      workDays: f.workDays.includes(d) ? f.workDays.filter(x => x !== d) : [...f.workDays, d],
    }))
  }

  const handleGenerate = () => {
    setGenerated(true)
    setStep(3)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">근로계약서 작성</h1>
          </div>
          <p className="text-gray-500">법적 요건을 갖춘 근로계약서를 무료로 작성하고 카카오로 서명까지 받아요.</p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[{ n: 1, label: '계약 유형' }, { n: 2, label: '내용 입력' }, { n: 3, label: '완료' }].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > n ? '✓' : n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= n ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ml-1 ${step > n ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-5">계약서 유형을 선택해주세요</h2>
            <div className="space-y-3">
              {contractTypes.map(t => (
                <label key={t} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  type === t ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                }`}>
                  <input type="radio" name="type" value={t} className="hidden"
                    checked={type === t} onChange={e => setType(e.target.value)} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${type === t ? 'border-blue-600' : 'border-gray-300'}`}>
                    {type === t && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className="font-medium text-gray-900">{t}</span>
                  {t === '근로계약서 (정규직)' && (
                    <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">인기</span>
                  )}
                </label>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!type}
              className="w-full mt-6 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              다음 →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900">계약 내용을 입력해주세요</h2>
            <p className="text-sm text-blue-600 bg-blue-50 px-4 py-3 rounded-xl">선택한 유형: <strong>{type}</strong></p>

            <div className="grid grid-cols-2 gap-4">
              {[
                ['companyName', '회사명', '(주)회사이름', 'text'],
                ['employerName', '대표자명', '홍길동', 'text'],
                ['workerName', '근로자명', '김철수', 'text'],
                ['workerBirth', '생년월일', '1990-01-01', 'date'],
              ].map(([key, label, placeholder, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} className="input-field"
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">근무 시작일</label>
                <input type="date" className="input-field" value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">근무 종료일</label>
                <input type="date" className="input-field" value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  disabled={type === '근로계약서 (정규직)'}
                  placeholder={type === '근로계약서 (정규직)' ? '정규직 (기간 없음)' : ''} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">직위/직책</label>
                <input type="text" placeholder="사원, 대리, 팀장..." className="input-field"
                  value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">월 급여</label>
                <div className="relative">
                  <input type="text" placeholder="3,000,000" className="input-field pr-10"
                    value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">소정근로일</label>
              <div className="flex gap-2">
                {days.map(d => (
                  <button key={d} type="button" onClick={() => toggleDay(d)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      form.workDays.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">근무지 주소</label>
              <input type="text" placeholder="서울시 강남구 테헤란로 123" className="input-field"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                ← 이전
              </button>
              <button onClick={handleGenerate} className="flex-2 flex-grow bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors">
                계약서 생성하기
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">근로계약서가 완성되었어요!</h2>
            <p className="text-gray-500 mb-8">PDF로 다운로드하거나 카카오톡으로 전자서명을 요청해보세요.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                PDF 다운로드
              </button>
              <button className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors">
                <Send className="w-4 h-4" />
                카카오로 서명 요청
              </button>
            </div>
            <button onClick={() => { setStep(1); setType(''); setGenerated(false) }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 hover:underline">
              새 계약서 작성하기
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
