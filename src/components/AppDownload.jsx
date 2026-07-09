import { useState } from 'react'
import { Smartphone, CheckCircle } from 'lucide-react'

export default function AppDownload() {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <section className="py-16 md:py-20 bg-blue-600">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left text-white">
            <p className="text-blue-200 font-semibold text-sm mb-3">모바일 앱 출시</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              언제 어디서든,<br />
              찾아줘노무사 앱으로요.
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              App Store와 Google Play에서 다운로드하세요.<br />
              앱 전용 할인 혜택도 제공해요.
            </p>

            <div className="space-y-3 mb-8">
              {['채팅 알림 즉시 수신', '언제든지 상담 내역 확인', '앱 전용 할인 쿠폰 제공'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle className="w-5 h-5 text-blue-300 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center lg:justify-start">
              <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm flex items-center gap-2">
                🍎 App Store
              </button>
              <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm flex items-center gap-2">
                🤖 Google Play
              </button>
            </div>
          </div>

          {/* SMS form */}
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">앱 설치 링크 받기</div>
                  <div className="text-xs text-gray-500">문자로 앱 설치 주소를 받아보세요</div>
                </div>
              </div>

              {sent ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">링크를 보냈어요!</p>
                  <p className="text-xs text-gray-500 mt-1">문자를 확인해 주세요</p>
                  <button onClick={() => { setSent(false); setPhone('') }} className="mt-3 text-xs text-blue-600 hover:underline">
                    다시 입력
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-3">
                  <input
                    type="tel"
                    placeholder="휴대폰 번호 입력 (- 없이)"
                    className="input-field"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    maxLength={11}
                  />
                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading ? '전송 중...' : '문자로 링크 받기'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    광고성 문자는 절대 보내지 않아요
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
