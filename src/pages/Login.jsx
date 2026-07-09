import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        const data = await login(form.email, form.password)
        if (data.user.role === 'admin') navigate('/admin')
        else if (data.user.role === 'attorney') navigate('/attorney/dashboard')
        else navigate('/')
      } else {
        await register({ ...form, role })
        if (role === 'attorney') navigate('/attorney/dashboard')
        else navigate('/')
      }
    } catch (e) {
      setError(e.response?.data?.error || '오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { label: '일반 사용자', email: 'user@test.com', pw: 'test1234', role: '근로자/사업자' },
    { label: '노무사', email: 'kim@nomusa.com', pw: 'test1234', role: '김민준 노무사' },
    { label: '관리자', email: 'admin@nomusa.com', pw: 'admin1234', role: '어드민' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">찾</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">찾아줘노무사</h1>
          <p className="text-gray-500 text-sm mt-1">노무 문제 해결의 시작</p>
        </div>

        {/* Demo accounts */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-2">🧪 데모 계정으로 바로 테스트</p>
          <div className="space-y-1.5">
            {demoAccounts.map(a => (
              <button key={a.email} onClick={() => setForm({ email: a.email, password: a.pw, name: '', phone: '' })}
                className="w-full flex items-center justify-between bg-white rounded-xl px-3 py-2 text-xs hover:bg-blue-50 transition-colors border border-blue-100">
                <span className="font-semibold text-gray-700">{a.label}</span>
                <span className="text-gray-500">{a.role} · {a.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {[['login', '로그인'], ['signup', '회원가입']].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setError('') }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">가입 유형</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['user','👷 일반 사용자'], ['attorney','⚖️ 노무사']].map(([r, label]) => (
                      <label key={r} className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${role === r ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                        <input type="radio" name="role" value={r} className="hidden" checked={role === r} onChange={() => setRole(r)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input type="text" placeholder="홍길동" required className="input-field"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">휴대폰 번호</label>
                  <input type="tel" placeholder="010-0000-0000" className="input-field"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <input type="email" placeholder="hello@example.com" required className="input-field"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="비밀번호" required className="input-field pr-10"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {tab === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative my-4 flex items-center gap-3">
              <div className="flex-1 border-t border-gray-100" />
              <span className="text-xs text-gray-400">또는</span>
              <div className="flex-1 border-t border-gray-100" />
            </div>
            <div className="space-y-2">
              {[['🟡 카카오로 시작하기', 'bg-yellow-400 text-gray-900'], ['🟢 네이버로 시작하기', 'bg-green-500 text-white']].map(([label, cls]) => (
                <button key={label} className={`w-full ${cls} font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
