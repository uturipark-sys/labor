# 찾아줘노무사 - 전체 프로젝트 코드

## package.json
```json
{
  "name": "findnomusa",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.18.1",
    "bcryptjs": "^3.0.3",
    "better-sqlite3": "^12.11.1",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "socket.io": "^4.8.3",
    "socket.io-client": "^4.8.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
}

```

## vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})

```

## src/main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

```

## src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: #111;
    background: #fff;
    -webkit-font-smoothing: antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-200 text-sm;
  }

  .btn-outline {
    @apply border-2 border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 text-sm;
  }

  .card {
    @apply bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200;
  }

  .section-title {
    @apply text-3xl md:text-4xl font-bold text-gray-900 leading-tight;
  }

  .section-subtitle {
    @apply text-gray-500 text-lg mt-3 leading-relaxed;
  }

  .input-field {
    @apply w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all;
  }

  .tag {
    @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
  }
}

/* Marquee */
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-track {
  display: inline-flex;
  animation: marquee 35s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* Accordion */
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.accordion-content.open {
  max-height: 500px;
}

/* Star rating */
.star-filled {
  color: #FFB800;
}

/* Badge */
.badge-online {
  @apply bg-green-100 text-green-700;
}

.badge-offline {
  @apply bg-gray-100 text-gray-500;
}

/* Hero gradient */
.hero-gradient {
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f0ff 50%, #f5f0ff 100%);
}

/* Number counter animation */
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.count-animate {
  animation: countUp 0.6s ease-out forwards;
}

```

## src/App.jsx
```jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { connectSocket } from './lib/socket'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import FindAttorney from './pages/FindAttorney'
import AttorneyDetail from './pages/AttorneyDetail'
import Calculator from './pages/Calculator'
import Blog from './pages/Blog'
import ContractPage from './pages/ContractPage'
import QnA from './pages/QnA'
import Login from './pages/Login'
import ChatRoom from './pages/ChatRoom'
import AttorneyDashboard from './pages/AttorneyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import MyPage from './pages/MyPage'

function AppInner() {
  const { user } = useAuth()
  const location = useLocation()

  // 소켓 연결 (로그인 시)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && user) connectSocket(token)
  }, [user])

  const noFooter = ['/chat', '/attorney/dashboard', '/admin']
  const isNoFooter = noFooter.some(p => location.pathname.startsWith(p))
  const isChat = location.pathname.startsWith('/chat/')

  return (
    <div className="min-h-screen flex flex-col">
      {!isChat && <Header />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<FindAttorney />} />
          <Route path="/attorney/:id" element={<AttorneyDetail />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contract" element={<ContractPage />} />
          <Route path="/qna" element={<QnA />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/attorney/dashboard" element={<AttorneyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/consultation" element={<Home />} />
          <Route path="/compare" element={<FindAttorney />} />
        </Routes>
      </div>
      {!isNoFooter && !isChat && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

```

## src/context/AuthContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [attorney, setAttorney] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(r => { setUser(r.data.user); setAttorney(r.data.attorney) })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', r.data.token)
    setUser(r.data.user)
    return r.data
  }

  const register = async (data) => {
    const r = await api.post('/auth/register', data)
    localStorage.setItem('token', r.data.token)
    setUser(r.data.user)
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setAttorney(null)
  }

  const refreshMe = async () => {
    const r = await api.get('/auth/me')
    setUser(r.data.user)
    setAttorney(r.data.attorney)
  }

  return (
    <AuthContext.Provider value={{ user, attorney, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

```

## src/lib/api.js
```js
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

```

## src/lib/socket.js
```js
import { io } from 'socket.io-client'

let socket = null

export function getSocket() {
  return socket
}

export function connectSocket(token) {
  if (socket?.connected) return socket
  socket = io('http://localhost:4000', {
    auth: { token },
    autoConnect: true,
  })
  return socket
}

export function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null }
}

```

## src/pages/Home.jsx
```jsx
import Hero from '../components/Hero'
import ConsultationForm from '../components/ConsultationForm'
import AttorneySection from '../components/AttorneySection'
import MarqueeSection from '../components/MarqueeSection'
import FeaturesSection from '../components/FeaturesSection'
import ReviewSection from '../components/ReviewSection'
import BlogSection from '../components/BlogSection'
import FAQSection from '../components/FAQSection'
import AppDownload from '../components/AppDownload'

export default function Home() {
  return (
    <main>
      <Hero />
      <ConsultationForm />
      <MarqueeSection />
      <AttorneySection />
      <FeaturesSection />
      <ReviewSection />
      <BlogSection />
      <FAQSection />
      <AppDownload />
    </main>
  )
}

```

## src/pages/Login.jsx
```jsx
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

```

## src/pages/AttorneyDetail.jsx
```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, MapPin, Clock, MessageCircle, Phone, Building, CheckCircle, ChevronRight } from 'lucide-react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

export default function AttorneyDetail() {
  const { id } = useParams()
  const auth = useAuth()
  const user = auth?.user
  const navigate = useNavigate()
  const [attorney, setAttorney] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConsult, setShowConsult] = useState(false)
  const [consultType, setConsultType] = useState('chat')
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('intro')

  useEffect(() => {
    api.get(`/attorneys/${id}`)
      .then(r => setAttorney(r.data))
      .catch(() => navigate('/find'))
      .finally(() => setLoading(false))
  }, [id])

  const handleConsult = async () => {
    if (!user) { navigate('/login'); return }
    if (!title.trim()) return alert('제목을 입력해주세요')
    setSubmitting(true)
    try {
      const r = await api.post('/consultations', {
        attorney_id: parseInt(id),
        type: consultType,
        topic,
        title,
        content,
      })
      navigate(`/chat/${r.data.id}`)
    } catch (e) {
      alert(e.response?.data?.error || '오류가 발생했어요')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!attorney) return null

  const days = Array.isArray(attorney.available_days)
    ? attorney.available_days
    : JSON.parse(attorney.available_days || '[]')
  const priceMap = { chat: attorney.chat_price, call: attorney.call_price, visit: attorney.visit_price }
  const typeLabel = { chat: '💬 채팅', call: '📞 전화', visit: '🏢 방문' }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-blue-700 text-3xl font-bold">
                {attorney.name?.[0]}
              </div>
              {attorney.is_online === 1 && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{attorney.name} <span className="text-gray-500 font-normal text-lg">노무사</span></h1>
                {attorney.is_online === 1 && (
                  <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">● 지금 상담 가능</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Building className="w-4 h-4" />{attorney.firm_name || '개인 사무소'}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{attorney.region}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <StarRow rating={Math.round(attorney.avg_rating)} />
                  <span className="font-bold text-gray-900 ml-1">{attorney.avg_rating || '0.0'}</span>
                  <span className="text-gray-400 text-sm">({attorney.review_count})</span>
                </div>
                <span className="text-sm text-gray-500">경력 {attorney.career_years}년</span>
                <span className="text-sm text-gray-500"><Clock className="w-3.5 h-3.5 inline mr-1" />평균 응답 {attorney.response_time}분</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(attorney.specialties || []).map(s => (
                  <span key={s} className="tag bg-blue-50 text-blue-700">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowConsult(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                채팅 상담 신청
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5" />
                전화 상담 신청
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-4">
            {[['intro','소개'], ['price','상담 가격'], ['reviews','후기']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'intro' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">노무사 소개</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {attorney.introduction || '소개글이 없어요.'}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">전문 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {(attorney.specialties || []).map(s => (
                    <div key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />{s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">상담 가능 시간</h3>
                <div className="flex gap-2 flex-wrap mb-3">
                  {['월','화','수','목','금','토','일'].map(d => (
                    <span key={d} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${days.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{d}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{attorney.available_from} ~ {attorney.available_to}</p>
              </div>
            </div>
          )}

          {activeTab === 'price' && (
            <div className="space-y-3">
              {[
                { type: 'chat', icon: '💬', label: '채팅 상담', desc: '실시간 텍스트 상담. 빠른 응답 보장.' },
                { type: 'call', icon: '📞', label: '전화 상담', desc: '통화로 자세한 상담을 받을 수 있어요.' },
                { type: 'visit', icon: '🏢', label: '방문 상담', desc: '직접 사무소를 방문해서 상담해요.' },
              ].map(({ type, icon, label, desc }) => (
                <div key={type} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-bold text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{desc}</div>
                      {attorney.free_first === 1 && type === 'chat' && (
                        <span className="text-xs text-green-600 font-medium">첫 상담 무료!</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-blue-600">{(priceMap[type] || 0).toLocaleString()}원</div>
                    <div className="text-xs text-gray-400">30분 기준</div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700">
                💡 첫 상담 후 만족하지 못하시면 100% 환불해드려요.
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {!attorney.reviews?.length ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">아직 후기가 없어요.</div>
              ) : attorney.reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm text-gray-900">{r.user_name?.replace(/(?<=.).(?=.)/g, '*')}</span>
                      {r.category && <span className="ml-2 tag bg-gray-100 text-gray-500">{r.category}</span>}
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{r.created_at?.slice(0,10)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - consult form */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">상담 신청하기</h3>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['chat', 'call', 'visit'].map(t => (
                <button key={t} onClick={() => setConsultType(t)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${consultType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {typeLabel[t]}
                </button>
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-4 text-center">
              <div className="text-xs text-gray-500 mb-0.5">상담 금액</div>
              <div className="text-2xl font-bold text-blue-600">
                {attorney.free_first === 1 && consultType === 'chat' ? (
                  <span>무료 <span className="text-sm text-gray-400 line-through">{priceMap[consultType].toLocaleString()}원</span></span>
                ) : (
                  `${(priceMap[consultType] || 0).toLocaleString()}원`
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">상담 주제</label>
                <select className="input-field text-sm" value={topic} onChange={e => setTopic(e.target.value)}>
                  <option value="">선택해주세요</option>
                  {['임금체불','퇴직금','부당해고','직장내괴롭힘','성희롱','산업재해','실업급여','근로계약','4대보험','기타'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">제목</label>
                <input className="input-field text-sm" placeholder="상담 제목을 입력해주세요" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">상담 내용</label>
                <textarea rows={3} className="input-field text-sm resize-none" placeholder="상담 내용을 간단히 적어주세요"
                  value={content} onChange={e => setContent(e.target.value)} />
              </div>
              <button
                onClick={handleConsult}
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                {user ? '상담 신청하기' : '로그인 후 신청'}
              </button>
              {!user && <p className="text-xs text-center text-gray-400">로그인이 필요해요</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

```

## src/pages/ChatRoom.jsx
```jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, Phone, MoreVertical, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { connectSocket, getSocket } from '../lib/socket'

function Message({ msg, isMe }) {
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
          {msg.sender_name?.[0]}
        </div>
      )}
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isMe && <span className="text-xs text-gray-500 ml-1">{msg.sender_name}</span>}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {msg.content}
        </div>
        <span className="text-xs text-gray-400 px-1">
          {msg.created_at?.slice(11, 16)}
          {isMe && <CheckCheck className="w-3 h-3 inline ml-1 text-blue-400" />}
        </span>
      </div>
    </div>
  )
}

export default function ChatRoom() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [peerTyping, setPeerTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }

    api.get(`/consultations/${id}`)
      .then(r => {
        setData(r.data)
        setMessages(r.data.messages || [])
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))

    // Socket 연결
    const token = localStorage.getItem('token')
    const socket = connectSocket(token)
    socket.emit('join_consultation', parseInt(id))

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on('peer_typing', ({ isTyping, name }) => {
      setPeerTyping(isTyping)
    })

    return () => {
      socket.off('new_message')
      socket.off('peer_typing')
    }
  }, [id, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, peerTyping])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const socket = getSocket()
    if (socket) {
      socket.emit('send_message', { consultationId: parseInt(id), content: text })
      socket.emit('typing', { consultationId: parseInt(id), isTyping: false })
    } else {
      // fallback REST
      api.post(`/consultations/${id}/messages`, { content: text })
        .then(r => setMessages(prev => [...prev, r.data]))
    }
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    const socket = getSocket()
    if (socket) {
      socket.emit('typing', { consultationId: parseInt(id), isTyping: true })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socket.emit('typing', { consultationId: parseInt(id), isTyping: false })
      }, 1500)
    }
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const completeConsultation = async () => {
    await api.patch(`/consultations/${id}/status`, { status: 'completed' })
    alert('상담이 완료되었어요!')
    navigate('/mypage')
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const { consultation, attorney, user: clientUser } = data || {}
  const isClient = user?.id === consultation?.user_id
  const peer = isClient ? attorney : clientUser
  const peerName = isClient ? attorney?.name : clientUser?.name

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
          {peerName?.[0]}
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-sm">{peerName} {isClient ? '노무사' : '님'}</div>
          <div className="text-xs text-gray-500">{consultation?.topic} · {consultation?.status === 'completed' ? '상담완료' : '상담중'}</div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Consultation info bar */}
      <div className="bg-blue-50 px-4 py-2 text-xs text-blue-700 flex items-center justify-between">
        <span>📋 {consultation?.title}</span>
        {consultation?.status !== 'completed' && (
          <button onClick={completeConsultation} className="text-blue-600 font-semibold hover:underline">
            상담 완료 처리
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-gray-500 text-sm">
              {isClient ? `${peerName} 노무사에게 먼저 인사해보세요!` : `${peerName}님이 상담을 신청했어요. 먼저 인사해보세요!`}
            </p>
          </div>
        )}
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} isMe={msg.sender_id === user?.id} />
        ))}
        {peerTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">{peerName?.[0]}</div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        {consultation?.status === 'completed' ? (
          <div className="text-center text-gray-400 text-sm py-2">상담이 완료된 채팅방이에요.</div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-28 overflow-auto"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={handleTyping}
              onKeyDown={handleKey}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

```

## src/pages/FindAttorney.jsx
```jsx
import { useState } from 'react'
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react'
import AttorneyCard from '../components/AttorneyCard'
import { attorneys } from '../data/attorneys'

const regions = ['전체', '서울', '경기', '부산', '인천', '대구', '광주', '대전', '울산']
const specialtyList = ['전체', '임금체불', '부당해고', '산재', '퇴직금', '실업급여', '직장내괴롭힘', '4대보험', '근로계약', '정부지원금']
const sortOptions = ['추천순', '평점순', '리뷰순', '가격낮은순', '응답빠른순']

export default function FindAttorney() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('전체')
  const [specialty, setSpecialty] = useState('전체')
  const [sort, setSort] = useState('추천순')
  const [onlineOnly, setOnlineOnly] = useState(false)

  const filtered = attorneys
    .filter(a => {
      if (onlineOnly && !a.isOnline) return false
      if (region !== '전체' && !a.location.includes(region)) return false
      if (specialty !== '전체' && !a.specialties.includes(specialty)) return false
      if (search && !a.name.includes(search) && !a.firm.includes(search) && !a.specialties.some(s => s.includes(search))) return false
      return true
    })
    .sort((a, b) => {
      if (sort === '평점순') return b.rating - a.rating
      if (sort === '리뷰순') return b.reviewCount - a.reviewCount
      if (sort === '가격낮은순') return a.price - b.price
      return 0
    })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">노무사 직접 찾기</h1>
          <p className="text-gray-500">전국 {attorneys.length}명의 전문 노무사를 검색하고 바로 상담하세요.</p>

          {/* Search */}
          <div className="relative mt-5 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 사무소, 전문분야로 검색"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-6 sticky top-20">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> 지역
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {regions.map(r => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        region === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" /> 전문분야
                </h3>
                <div className="flex flex-col gap-1.5">
                  {specialtyList.map(s => (
                    <button
                      key={s}
                      onClick={() => setSpecialty(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                        specialty === s ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlineOnly}
                    onChange={e => setOnlineOnly(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">온라인 가능만</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <strong className="text-gray-900">{filtered.length}명</strong>의 노무사
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500">검색 결과가 없어요. 다른 조건으로 검색해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(attorney => (
                  <AttorneyCard key={attorney.id} attorney={attorney} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

```

## src/pages/MyPage.jsx
```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, ChevronRight, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/consultations/my').then(r => setConsultations(r.data)).finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', matched: 'bg-blue-100 text-blue-700', in_progress: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' }
  const statusLabel = { pending: '대기중', matched: '매칭됨', in_progress: '상담중', completed: '완료', cancelled: '취소' }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-[700px] mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 text-2xl font-bold">
              {user?.name?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}님</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-4 py-6 space-y-4">
        <h2 className="font-bold text-gray-900">내 상담 내역</h2>
        {consultations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 mb-4">아직 상담 내역이 없어요.</p>
            <Link to="/find" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm">
              노무사 찾기 →
            </Link>
          </div>
        ) : consultations.map(c => (
          <Link key={c.id} to={`/chat/${c.id}`}
            className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`tag ${statusColor[c.status]}`}>{statusLabel[c.status] || c.status}</span>
                  {c.topic && <span className="tag bg-blue-50 text-blue-700">{c.topic}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{c.title}</h3>
                <p className="text-sm text-gray-500">{c.attorney_name ? `${c.attorney_name} 노무사` : '노무사 배정 대기'} · {c.created_at?.slice(0,10)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

```

## src/pages/AttorneyDashboard.jsx
```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Star, TrendingUp, User, Settings, Bell, Power, ChevronRight, Clock, Save, Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { connectSocket } from '../lib/socket'

const ALL_SPECIALTIES = ['임금체불', '퇴직금', '부당해고', '직장내괴롭힘', '성희롱', '산업재해', '실업급여', '근로계약', '4대보험', '취업규칙', '정부지원금', '육아휴직', '노동위원회', '인사노무', '기타']
const ALL_DAYS = ['월', '화', '수', '목', '금', '토', '일']

export default function AttorneyDashboard() {
  const { user, attorney, refreshMe } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [consultations, setConsultations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isOnline, setIsOnline] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'attorney') { navigate('/'); return }

    loadData()

    const token = localStorage.getItem('token')
    connectSocket(token)
  }, [user])

  useEffect(() => {
    if (attorney) {
      setIsOnline(attorney.is_online === 1)
      setProfile({
        firm_name: attorney.firm_name || '',
        introduction: attorney.introduction || '',
        career_years: attorney.career_years || 0,
        region: attorney.region || '',
        address: attorney.address || '',
        chat_price: attorney.chat_price || 30000,
        call_price: attorney.call_price || 50000,
        visit_price: attorney.visit_price || 100000,
        free_first: attorney.free_first === 1,
        available_from: attorney.available_from || '09:00',
        available_to: attorney.available_to || '18:00',
        available_days: attorney.available_days || [],
        specialties: attorney.specialties || [],
      })
    }
  }, [attorney])

  const loadData = async () => {
    const [consults, notifs] = await Promise.all([
      api.get('/consultations/my').then(r => r.data).catch(() => []),
      api.get('/notifications').then(r => r.data).catch(() => []),
    ])
    setConsultations(consults)
    setNotifications(notifs)
  }

  const toggleOnline = async () => {
    const next = !isOnline
    await api.patch('/attorneys/status/online', { is_online: next })
    setIsOnline(next)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.put('/attorneys/profile/me', profile)
      await refreshMe()
      alert('저장되었어요!')
    } catch (e) {
      alert(e.response?.data?.error || '저장 중 오류가 발생했어요')
    } finally { setSaving(false) }
  }

  const toggleSpecialty = s => {
    setProfile(p => ({
      ...p,
      specialties: p.specialties.includes(s) ? p.specialties.filter(x => x !== s) : [...p.specialties, s]
    }))
  }

  const toggleDay = d => {
    setProfile(p => ({
      ...p,
      available_days: p.available_days.includes(d) ? p.available_days.filter(x => x !== d) : [...p.available_days, d]
    }))
  }

  const stats = {
    total: consultations.length,
    active: consultations.filter(c => c.status === 'matched' || c.status === 'in_progress').length,
    completed: consultations.filter(c => c.status === 'completed').length,
    unread: notifications.filter(n => !n.is_read).length,
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', matched: 'bg-blue-100 text-blue-700', in_progress: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' }
  const statusLabel = { pending: '대기', matched: '매칭됨', in_progress: '상담중', completed: '완료', cancelled: '취소' }

  if (!user || !profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">노무사 대시보드</h1>
            <p className="text-sm text-gray-500">{user.name} 노무사님, 안녕하세요!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isOnline ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Power className="w-4 h-4" />
              {isOnline ? '온라인' : '오프라인'}
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
              {stats.unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{stats.unread}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '전체 상담', value: stats.total, icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '진행 중', value: stats.active, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '완료된 상담', value: stats.completed, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: '새 알림', value: stats.unread, icon: Bell, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-5 overflow-x-auto">
          {[['overview','상담 목록'],['profile','프로필 설정'],['price','가격 설정'],['notifications','알림']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* 상담 목록 */}
        {tab === 'overview' && (
          <div className="space-y-3">
            {consultations.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500">아직 상담 신청이 없어요.</p>
                <p className="text-sm text-gray-400 mt-1">온라인 상태로 전환하면 상담을 받을 수 있어요.</p>
              </div>
            ) : consultations.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`tag ${statusColor[c.status] || 'bg-gray-100 text-gray-500'}`}>{statusLabel[c.status] || c.status}</span>
                    {c.topic && <span className="tag bg-blue-50 text-blue-700">{c.topic}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.user_name} · {c.created_at?.slice(0,10)}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-blue-600 mb-1">{(c.price || 0).toLocaleString()}원</div>
                  <Link to={`/chat/${c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                    채팅방 <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 프로필 설정 */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">사무소/법인명</label>
                <input className="input-field" value={profile.firm_name} onChange={e => setProfile(p => ({ ...p, firm_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">경력 (년)</label>
                <input type="number" className="input-field" value={profile.career_years} onChange={e => setProfile(p => ({ ...p, career_years: +e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">활동 지역</label>
              <input className="input-field" placeholder="서울 강남구" value={profile.region} onChange={e => setProfile(p => ({ ...p, region: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">자기소개</label>
              <textarea rows={5} className="input-field resize-none" value={profile.introduction} onChange={e => setProfile(p => ({ ...p, introduction: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">전문 분야 선택</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SPECIALTIES.map(s => (
                  <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      profile.specialties.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}>
                    {profile.specialties.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">상담 가능 요일</label>
              <div className="flex gap-2">
                {ALL_DAYS.map(d => (
                  <button key={d} type="button" onClick={() => toggleDay(d)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${profile.available_days.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">상담 시작 시간</label>
                <input type="time" className="input-field" value={profile.available_from} onChange={e => setProfile(p => ({ ...p, available_from: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">상담 종료 시간</label>
                <input type="time" className="input-field" value={profile.available_to} onChange={e => setProfile(p => ({ ...p, available_to: e.target.value }))} />
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        )}

        {/* 가격 설정 */}
        {tab === 'price' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            {[
              { key: 'chat_price', label: '💬 채팅 상담 가격', desc: '30분 기준' },
              { key: 'call_price', label: '📞 전화 상담 가격', desc: '30분 기준' },
              { key: 'visit_price', label: '🏢 방문 상담 가격', desc: '1시간 기준' },
            ].map(({ key, label, desc }) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label} <span className="text-gray-400 font-normal">({desc})</span></label>
                <div className="relative">
                  <input type="number" className="input-field pr-10" value={profile[key]}
                    onChange={e => setProfile(p => ({ ...p, [key]: +e.target.value }))} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
            ))}
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-green-50 rounded-xl">
              <input type="checkbox" className="w-4 h-4 accent-green-600"
                checked={profile.free_first}
                onChange={e => setProfile(p => ({ ...p, free_first: e.target.checked }))} />
              <div>
                <div className="font-semibold text-green-800 text-sm">첫 상담 무료 제공</div>
                <div className="text-xs text-green-600">첫 채팅 상담을 무료로 제공해 더 많은 의뢰인을 유치해요</div>
              </div>
            </label>
            <button onClick={saveProfile} disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '가격 저장'}
            </button>
          </div>
        )}

        {/* 알림 */}
        {tab === 'notifications' && (
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-400">알림이 없어요.</div>
            ) : notifications.map(n => (
              <div key={n.id} className={`bg-white rounded-2xl p-4 border flex gap-3 ${n.is_read ? 'border-gray-100 opacity-60' : 'border-blue-100'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.is_read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <div>
                  <div className="font-semibold text-sm text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.body}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.created_at?.slice(0,16)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

```

## src/pages/AdminDashboard.jsx
```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MessageCircle, Star, TrendingUp, CheckCircle, XCircle, Eye, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function StatCard({ label, value, icon: Icon, color, bg, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [attorneys, setAttorneys] = useState([])
  const [users, setUsers] = useState([])
  const [consultations, setConsultations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin') { navigate('/'); return }
    loadAll()
  }, [user])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, a, u, c] = await Promise.all([
        api.get('/admin/stats').then(r => r.data),
        api.get('/admin/attorneys').then(r => r.data),
        api.get('/admin/users').then(r => r.data),
        api.get('/admin/consultations').then(r => r.data),
      ])
      setStats(s); setAttorneys(a); setUsers(u.users || []); setConsultations(c)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const approveAttorney = async (id, approved) => {
    await api.patch(`/admin/attorneys/${id}/approve`, { approved })
    setAttorneys(prev => prev.map(a => a.id === id ? { ...a, is_approved: approved ? 1 : 0 } : a))
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', matched: 'bg-blue-100 text-blue-700', in_progress: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500', cancelled: 'bg-red-100 text-red-500' }
  const statusLabel = { pending: '대기', matched: '매칭', in_progress: '진행중', completed: '완료', cancelled: '취소' }

  const filteredAttorneys = attorneys.filter(a =>
    !search || a.name?.includes(search) || a.email?.includes(search) || a.region?.includes(search)
  )
  const filteredUsers = users.filter(u =>
    !search || u.name?.includes(search) || u.email?.includes(search)
  )

  if (loading || !stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-gray-900 text-white px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">찾</div>
            <span className="font-bold">찾아줘노무사 관리자</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">ADMIN</span>
          </div>
          <div className="text-sm text-gray-400">{user.name}님 · <button onClick={() => navigate('/')} className="hover:text-white">사이트로</button></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="총 사용자" value={stats.total_users} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="전체 노무사" value={stats.total_attorneys} icon={Users} color="text-purple-600" bg="bg-purple-50"
            sub={`승인 대기 ${stats.pending_attorneys}명`} />
          <StatCard label="총 상담" value={stats.total_consultations} icon={MessageCircle} color="text-green-600" bg="bg-green-50"
            sub={`완료 ${stats.completed_consultations}건`} />
          <StatCard label="평균 평점" value={`${stats.avg_rating}점`} icon={Star} color="text-yellow-600" bg="bg-yellow-50"
            sub={`후기 ${stats.total_reviews}건`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-5 overflow-x-auto">
          {[['overview','최근 상담'],['attorneys','노무사 관리'],['users','사용자 관리'],['consultations','전체 상담']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* 검색 (attorneys, users 탭) */}
        {['attorneys', 'users'].includes(tab) && (
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="이름, 이메일, 지역 검색" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        )}

        {/* 최근 상담 */}
        {tab === 'overview' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 font-semibold text-gray-900">최근 상담 신청</div>
            <div className="divide-y divide-gray-50">
              {stats.recent_consultations?.map(c => (
                <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                  <span className={`tag ${statusColor[c.status]}`}>{statusLabel[c.status]}</span>
                  <span className="font-medium text-sm text-gray-900 flex-1 truncate">{c.title}</span>
                  <span className="text-xs text-gray-500">{c.user_name}</span>
                  <span className="text-xs text-gray-400">{c.created_at?.slice(0,10)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 노무사 관리 */}
        {tab === 'attorneys' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {['이름', '이메일', '사무소', '지역', '경력', '상담수', '평점', '상태', '승인'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAttorneys.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">{a.name}</td>
                      <td className="px-4 py-3 text-gray-500">{a.email}</td>
                      <td className="px-4 py-3 text-gray-600">{a.firm_name || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.region || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{a.career_years}년</td>
                      <td className="px-4 py-3 text-gray-600">{a.consultation_count}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-0.5 text-yellow-500 font-semibold">
                          ★ {a.avg_rating || '0.0'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${a.is_online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {a.is_online ? '온라인' : '오프라인'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {a.is_approved ? (
                          <button onClick={() => approveAttorney(a.id, false)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:underline font-medium">
                            <XCircle className="w-3.5 h-3.5" /> 승인 취소
                          </button>
                        ) : (
                          <button onClick={() => approveAttorney(a.id, true)}
                            className="flex items-center gap-1 text-xs text-green-600 hover:underline font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> 승인
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 사용자 관리 */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {['ID','이름','이메일','전화번호','역할','가입일'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{u.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">{u.phone || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`tag ${u.role === 'attorney' ? 'bg-blue-100 text-blue-700' : u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role === 'attorney' ? '노무사' : u.role === 'admin' ? '관리자' : '일반'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 전체 상담 */}
        {tab === 'consultations' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {['ID','제목','의뢰인','노무사','유형','상태','금액','일시'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {consultations.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{c.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{c.title}</td>
                      <td className="px-4 py-3 text-gray-600">{c.user_name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.attorney_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="tag bg-gray-100 text-gray-600">
                          {c.type === 'chat' ? '💬' : c.type === 'call' ? '📞' : '🏢'} {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`tag ${statusColor[c.status]}`}>{statusLabel[c.status] || c.status}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{(c.price || 0).toLocaleString()}원</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{c.created_at?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

```

## src/components/Header.jsx
```jsx
import { useState, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, MessageCircle, Bell, User, Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ServiceIntroModal from './ServiceIntroModal'

const navItems = [
  { label: '노무 상담', href: '/consultation', children: ['실시간 채팅상담', '노무 Q&A', '전화/방문 상담'] },
  { label: '수수료 비교', href: '/compare' },
  { label: '노무사 직접 찾기', href: '/find' },
  { label: '근로계약서 작성', href: '/contract' },
  { label: '자동세금계산기', href: '/calculator' },
  { label: '찾노BLOG', href: '/blog' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showIntro, setShowIntro] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const dashboardLink = user?.role === 'admin' ? '/admin' : user?.role === 'attorney' ? '/attorney/dashboard' : '/mypage'

  return (
    <Fragment>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">찾</span>
              </div>
              <span className="font-bold text-gray-900 text-base hidden sm:block">찾아줘노무사</span>
            </Link>

            {/* Search bar (desktop) */}
            <div className="hidden md:flex flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="노무사, 지역, 전문분야 검색"
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-2">
              <button
                onClick={() => setShowIntro(true)}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                서비스 소개
              </button>
              {navItems.map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-0.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-3 h-3" />}
                  </Link>
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[160px]">
                      {item.children.map(child => (
                        <a
                          key={child}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          {child}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                className="md:hidden p-2 text-gray-500 hover:text-blue-600"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                to="/mypage"
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden md:block">채팅내역</span>
              </Link>
              <button className="p-2 text-gray-500 hover:text-blue-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to={dashboardLink}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Link>
                  <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  로그인
                </Link>
              )}
              <button
                className="lg:hidden p-2 text-gray-500"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="노무사, 지역, 전문분야 검색"
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-1">
              <button
                onClick={() => { setShowIntro(true); setMobileOpen(false) }}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
              >
                서비스 소개
              </button>
              {navItems.map(item => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-2">
                <Link
                  to="/login"
                  className="block text-center bg-blue-600 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  로그인 / 회원가입
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      {showIntro && <ServiceIntroModal onClose={() => setShowIntro(false)} />}
    </Fragment>
  )
}

```

## src/components/ServiceIntroModal.jsx
```jsx
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

```

## src/components/Hero.jsx
```jsx
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

```

## src/components/Footer.jsx
```jsx
import { Link } from 'react-router-dom'

const links = {
  '서비스': ['노무 상담', '노무사 찾기', '수수료 비교', '근로계약서 작성', '자동 계산기', '찾노BLOG'],
  '고객지원': ['공지사항', 'FAQ', '1:1 문의', '카카오톡 문의', '이용가이드'],
  '회사': ['회사소개', '제휴 노무사 신청', '광고 문의', '채용'],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-[1200px] mx-auto px-4 py-14">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Brand */}
          <div className="lg:w-[280px] shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">찾</span>
              </div>
              <span className="font-bold text-white text-base">찾아줘노무사</span>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-gray-500">
              국내 1위 노무사 비교 플랫폼.<br />
              근로자와 사업주 모두를 위한<br />
              믿을 수 있는 노무 서비스예요.
            </p>
            <div className="flex gap-3">
              {['📱 앱스토어', '🤖 구글플레이'].map(label => (
                <button key={label} className="text-xs text-gray-500 border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 transition-colors">
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:1661-1071" className="hover:text-white transition-colors">1661-1071</a>
              </div>
              <div className="text-xs text-gray-600">평일 10:00~18:30 (점심 12:30~13:30)</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          {/* Company info */}
          <div className="text-xs text-gray-600 leading-relaxed mb-6 space-y-1">
            <p>주식회사 에스에프컴퍼니 | 대표: 허웅 | 사업자등록번호: 366-87-00968</p>
            <p>주소: 서울특별시 마포구 양화로 193 | 통신판매업신고번호: 제2021-서울마포-0000호</p>
            <p>직업정보제공사업 신고번호: J1200020210005 | 유료직업소개사업 등록번호: 서울마포-유-2021-0000</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4">
              {['개인정보처리방침', '이용약관', '노무사 이용약관'].map(item => (
                <a key={item} href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              {['블로그', '인스타그램', '유튜브', '카카오'].map(sns => (
                <a key={sns} href="#" className="text-xs text-gray-600 hover:text-white transition-colors">
                  {sns}
                </a>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-700 mt-4">
            © 2024 주식회사 에스에프컴퍼니. All rights reserved.
            찾아줘노무사는 노무사 소개 플랫폼으로 법률 자문을 직접 제공하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  )
}

```

## src/components/ConsultationForm.jsx
```jsx
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

```

## src/components/AttorneySection.jsx
```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AttorneyCard from './AttorneyCard'
import api from '../lib/api'

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'worker', label: '👷 근로자', filter: a => a.specialties?.some(s => ['임금체불','부당해고','산재','퇴직금','실업급여','직장내괴롭힘'].includes(s)) },
  { id: 'business', label: '🏢 사업자', filter: a => a.specialties?.some(s => ['4대보험','취업규칙','인사노무','정부지원금'].includes(s)) },
  { id: 'subsidy', label: '💰 지원금', filter: a => a.specialties?.some(s => ['정부지원금','고용장려금'].includes(s)) },
]

export default function AttorneySection() {
  const [activeTab, setActiveTab] = useState('all')
  const [attorneys, setAttorneys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/attorneys').then(r => setAttorneys(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const currentTab = tabs.find(t => t.id === activeTab)
  const displayed = activeTab === 'all' ? attorneys : attorneys.filter(currentTab.filter || (() => true))

  // API 데이터를 AttorneyCard 형식으로 변환
  const toCard = a => ({
    id: a.id,
    name: a.name,
    firm: a.firm_name || '개인 사무소',
    location: a.region || '지역 미설정',
    specialties: a.specialties || [],
    rating: a.avg_rating || 0,
    reviewCount: a.review_count || 0,
    responseTime: `평균 ${a.response_time || 30}분`,
    isOnline: a.is_online === 1,
    isRecommended: a.avg_rating >= 4.8 || a.review_count >= 50,
    experience: a.career_years || 0,
    price: a.chat_price || 30000,
    intro: a.introduction || '',
  })

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-600 font-semibold text-sm mb-2">실시간 채팅상담</p>
            <h2 className="section-title">지금 바로 연결 가능한<br className="sm:hidden" /> 노무사예요</h2>
          </div>
          <Link to="/find" className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline shrink-0">
            전체 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.slice(0, 6).map(a => (
              <AttorneyCard key={a.id} attorney={toCard(a)} />
            ))}
            {displayed.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-400">해당 분야의 노무사가 없어요.</div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/find" className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
            노무사 더 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

```

## src/components/AttorneyCard.jsx
```jsx
import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'

export default function AttorneyCard({ attorney }) {
  const { id, name, firm, location, specialties, rating, reviewCount, responseTime, isOnline, isRecommended, experience, price, intro } = attorney

  const initials = name.slice(0, 1)

  return (
    <div className="card group relative">
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          추천
        </div>
      )}

      <div className="flex gap-4 mb-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-blue-700 text-xl font-bold">
            {initials}
          </div>
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {name} <span className="text-gray-500 text-sm font-normal">노무사</span>
              </h3>
              <p className="text-sm text-gray-500 truncate">{firm}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {location}
            </div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{intro}</p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {specialties.map(s => (
          <span key={s} className="tag bg-blue-50 text-blue-700">
            {s}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {responseTime}
        </div>
        <div>경력 {experience}년</div>
        <div className={`ml-auto font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
          {isOnline ? '● 온라인' : '○ 오프라인'}
        </div>
      </div>

      {/* Price & CTA */}
      <div className="flex items-center gap-2">
        <div className="flex-1 text-center">
          <div className="text-xs text-gray-400 mb-0.5">상담 시작가</div>
          <div className="font-bold text-gray-900">{price.toLocaleString()}원</div>
        </div>
        <Link
          to={`/attorney/${id}`}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex-1 justify-center"
        >
          <MessageCircle className="w-4 h-4" />
          채팅상담
        </Link>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Phone className="w-4 h-4" />
          전화
        </button>
      </div>
    </div>
  )
}

```

## src/components/MarqueeSection.jsx
```jsx
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

```

## src/components/FeaturesSection.jsx
```jsx
import { Link } from 'react-router-dom'
import { MessageCircle, FileText, Calculator, Search, Star, Shield } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: '실시간 채팅 상담',
    description: '전문 노무사와 24시간 채팅으로 연결해요. 평균 7분 안에 응답을 받을 수 있어요.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    link: '/consultation',
    linkLabel: '상담 시작하기',
  },
  {
    icon: Search,
    title: '노무사 직접 찾기',
    description: '지역, 전문분야, 가격으로 필터링해서 원하는 노무사를 직접 선택할 수 있어요.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    link: '/find',
    linkLabel: '노무사 찾기',
  },
  {
    icon: FileText,
    title: '근로계약서 무료 작성',
    description: '법적 요건을 갖춘 근로계약서를 무료로 작성하고 카카오톡으로 전자서명까지 받아요.',
    color: 'text-green-600',
    bg: 'bg-green-50',
    link: '/contract',
    linkLabel: '계약서 작성하기',
  },
  {
    icon: Calculator,
    title: '자동 세금 계산기',
    description: '퇴직금, 실업급여, 4대보험, 연장근로수당 등을 자동으로 계산해드려요.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    link: '/calculator',
    linkLabel: '계산하기',
  },
  {
    icon: Star,
    title: '수수료 비교 견적',
    description: '여러 노무사에게 동시에 견적을 요청하고 수수료를 비교해서 가장 합리적인 선택을 해요.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    link: '/compare',
    linkLabel: '견적 요청하기',
  },
  {
    icon: Shield,
    title: '노무 Q&A 게시판',
    description: '유사한 사례를 검색하거나 직접 질문을 올리면 전문 노무사가 답변해드려요.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    link: '/qna',
    linkLabel: 'Q&A 보기',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm mb-2">우리가 제공하는 것</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            노무 문제, 이렇게 도와드려요
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            상담부터 서류 작성, 비용 비교까지.<br />
            노무 문제 해결에 필요한 모든 것이 여기 있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg, link, linkLabel }) => (
            <div key={title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 group">
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>
              <Link
                to={link}
                className={`text-sm font-semibold ${color} hover:underline flex items-center gap-1`}
              >
                {linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

```

## src/components/ReviewSection.jsx
```jsx
import { Star, ThumbsUp } from 'lucide-react'
import { reviews } from '../data/reviews'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div className="card shrink-0 w-[320px] sm:w-auto">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-gray-900 text-sm">{review.author}</div>
          <div className="text-xs text-gray-400 mt-0.5">{review.date} · {review.category}</div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <div className="text-xs text-blue-600 font-medium mb-2 bg-blue-50 px-2.5 py-1 rounded-full inline-block">
        {review.attorney}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{review.content}</p>

      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <ThumbsUp className="w-3.5 h-3.5" />
        <span>도움이 됐어요 {review.helpful}</span>
      </div>
    </div>
  )
}

export default function ReviewSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-600 font-semibold text-sm mb-2">실제 후기</p>
            <h2 className="section-title">이용자들이<br className="sm:hidden" /> 직접 남긴 후기예요</h2>
            <p className="section-subtitle">실제로 도움을 받은 분들의 솔직한 이야기예요.</p>
          </div>
          <div className="flex items-center gap-3 bg-yellow-50 px-5 py-3 rounded-2xl">
            <div className="text-3xl font-bold text-yellow-500">4.9</div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="text-xs text-gray-500">100,000+ 후기 기준</div>
            </div>
          </div>
        </div>

        {/* Grid (mobile: horizontal scroll, desktop: grid) */}
        <div className="flex gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

```

## src/components/BlogSection.jsx
```jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, Clock } from 'lucide-react'
import { blogPosts } from '../data/blogPosts'

function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`} className="group block">
      <div className="card hover:shadow-md transition-shadow duration-200 h-full">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            {post.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <span className="tag bg-gray-100 text-gray-600 mb-2">{post.category}</span>
            <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {post.views.toLocaleString()}
              </span>
              <span className="ml-auto">{post.date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-600 font-semibold text-sm mb-2">찾노BLOG</p>
            <h2 className="section-title">노무 지식,<br className="sm:hidden" /> 쉽게 알려드려요</h2>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline shrink-0"
          >
            전체 글 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

```

## src/components/FAQSection.jsx
```jsx
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

```

## src/components/AppDownload.jsx
```jsx
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

```

## server/db.js
```js
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', 'data', 'nomusa.db')

import { mkdirSync } from 'fs'
try { mkdirSync(join(__dirname, '..', 'data'), { recursive: true }) } catch {}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'user',  -- user | attorney | admin
      profile_image TEXT,
      points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      updated_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS attorney_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      license_number TEXT UNIQUE,
      firm_name TEXT,
      introduction TEXT,
      career_years INTEGER DEFAULT 0,
      region TEXT,
      address TEXT,
      is_online INTEGER DEFAULT 0,
      is_approved INTEGER DEFAULT 0,
      response_time INTEGER DEFAULT 30,
      chat_price INTEGER DEFAULT 30000,
      call_price INTEGER DEFAULT 50000,
      visit_price INTEGER DEFAULT 100000,
      free_first INTEGER DEFAULT 1,
      available_from TEXT DEFAULT '09:00',
      available_to TEXT DEFAULT '18:00',
      available_days TEXT DEFAULT '["월","화","수","목","금"]',
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS attorney_specialties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attorney_id INTEGER NOT NULL REFERENCES attorney_profiles(id) ON DELETE CASCADE,
      specialty TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      attorney_id INTEGER REFERENCES attorney_profiles(id),
      type TEXT DEFAULT 'chat',
      status TEXT DEFAULT 'pending',
      topic TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      price INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      updated_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
      sender_id INTEGER NOT NULL REFERENCES users(id),
      sender_role TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER NOT NULL REFERENCES consultations(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      attorney_id INTEGER NOT NULL REFERENCES attorney_profiles(id),
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      content TEXT NOT NULL,
      helpful_count INTEGER DEFAULT 0,
      category TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS qna_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      category TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      view_count INTEGER DEFAULT 0,
      is_anonymous INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS qna_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES qna_posts(id) ON DELETE CASCADE,
      attorney_id INTEGER NOT NULL REFERENCES attorney_profiles(id),
      content TEXT NOT NULL,
      is_best INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );
  `)

  // 기본 어드민 + 샘플 데이터 시드
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@nomusa.com')
  if (!adminExists) {
    const hash = bcrypt.hashSync('admin1234', 10)
    db.prepare(`INSERT INTO users (email, password, name, role) VALUES (?,?,?,?)`).run('admin@nomusa.com', hash, '관리자', 'admin')

    // 샘플 노무사
    const attorneys = [
      { email: 'kim@nomusa.com', name: '김민준', firm: '한울 노무법인', region: '서울 강남구', years: 12, intro: '근로자 권익 보호 전문. 임금체불, 부당해고 분쟁에서 높은 승소율을 자랑합니다.', chat: 30000, specialties: ['임금체불', '부당해고', '산재'] },
      { email: 'lee@nomusa.com', name: '이수진', firm: '서울 노무사 사무소', region: '서울 서초구', years: 8, intro: '직장 내 괴롭힘, 성희롱 피해자를 위한 법적 지원 전문 노무사입니다.', chat: 25000, specialties: ['직장내괴롭힘', '성희롱', '노동위원회'] },
      { email: 'park@nomusa.com', name: '박성호', firm: '더나은 노무컨설팅', region: '서울 마포구', years: 15, intro: '사업주를 위한 인사노무 관리, 취업규칙 작성 및 4대보험 신고 전문입니다.', chat: 40000, specialties: ['4대보험', '취업규칙', '인사노무'] },
    ]

    const pw = bcrypt.hashSync('test1234', 10)
    for (const a of attorneys) {
      const u = db.prepare(`INSERT INTO users (email, password, name, role) VALUES (?,?,?,?)`).run(a.email, pw, a.name, 'attorney')
      const prof = db.prepare(`INSERT INTO attorney_profiles (user_id, firm_name, introduction, career_years, region, chat_price, is_approved, is_online) VALUES (?,?,?,?,?,?,1,1)`).run(u.lastInsertRowid, a.firm, a.intro, a.years, a.region, a.chat)
      for (const s of a.specialties) {
        db.prepare(`INSERT INTO attorney_specialties (attorney_id, specialty) VALUES (?,?)`).run(prof.lastInsertRowid, s)
      }
    }

    // 샘플 일반 유저
    const user = db.prepare(`INSERT INTO users (email, password, name, phone) VALUES (?,?,?,?)`).run('user@test.com', pw, '홍길동', '010-1234-5678')
  }

  console.log('✅ DB initialized')
}

export default db

```

## server/index.js
```js
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { initDb } from './db.js'
import db from './db.js'
import authRoutes from './routes/auth.js'
import attorneyRoutes from './routes/attorneys.js'
import consultationRoutes from './routes/consultations.js'
import adminRoutes from './routes/admin.js'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from './middleware/auth.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', credentials: true }
})

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Init DB
initDb()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/attorneys', attorneyRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/admin', adminRoutes)

// Notifications
app.get('/api/notifications', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json([])
  try {
    const user = jwt.verify(token, SECRET_KEY)
    const notifs = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(user.id)
    res.json(notifs)
  } catch { res.status(401).json([]) }
})

app.patch('/api/notifications/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET is_read=1 WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

// ─── Socket.io 실시간 채팅 ───────────────────────────────────
const onlineUsers = new Map() // userId → socketId

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('인증 필요'))
  try {
    socket.user = jwt.verify(token, SECRET_KEY)
    next()
  } catch { next(new Error('토큰 오류')) }
})

io.on('connection', (socket) => {
  const user = socket.user
  onlineUsers.set(user.id, socket.id)

  // 노무사면 온라인 상태 업데이트
  if (user.role === 'attorney') {
    db.prepare('UPDATE attorney_profiles SET is_online=1 WHERE user_id=?').run(user.id)
    io.emit('attorney_online', { user_id: user.id, is_online: true })
  }

  console.log(`✅ 연결: ${user.name} (${user.role})`)

  // 상담방 입장
  socket.on('join_consultation', (consultationId) => {
    socket.join(`consultation_${consultationId}`)
    console.log(`${user.name} → 상담방 ${consultationId}`)
  })

  // 메시지 전송
  socket.on('send_message', ({ consultationId, content }) => {
    const result = db.prepare(`
      INSERT INTO chat_messages (consultation_id, sender_id, sender_role, content)
      VALUES (?,?,?,?)
    `).run(consultationId, user.id, user.role, content)

    const message = db.prepare(`
      SELECT m.*, u.name as sender_name
      FROM chat_messages m JOIN users u ON u.id = m.sender_id
      WHERE m.id = ?
    `).get(result.lastInsertRowid)

    // 상담방 전체에 브로드캐스트
    io.to(`consultation_${consultationId}`).emit('new_message', message)

    // 상대방에게 알림
    const consultation = db.prepare('SELECT * FROM consultations WHERE id=?').get(consultationId)
    const recipientId = user.id === consultation.user_id
      ? db.prepare('SELECT user_id FROM attorney_profiles WHERE id=?').get(consultation.attorney_id)?.user_id
      : consultation.user_id

    if (recipientId && onlineUsers.has(recipientId)) {
      io.to(onlineUsers.get(recipientId)).emit('notification', {
        type: 'message', consultationId, senderName: user.name, content
      })
    }
  })

  // 타이핑 표시
  socket.on('typing', ({ consultationId, isTyping }) => {
    socket.to(`consultation_${consultationId}`).emit('peer_typing', { isTyping, name: user.name })
  })

  socket.on('disconnect', () => {
    onlineUsers.delete(user.id)
    if (user.role === 'attorney') {
      db.prepare('UPDATE attorney_profiles SET is_online=0 WHERE user_id=?').run(user.id)
      io.emit('attorney_online', { user_id: user.id, is_online: false })
    }
    console.log(`❌ 연결 해제: ${user.name}`)
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`))

```

## server/middleware/auth.js
```js
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'nomusa_secret_2024'

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: '인증이 필요해요' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: '토큰이 유효하지 않아요' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: '권한이 없어요' })
    }
    next()
  }
}

export const SECRET_KEY = SECRET

```

## server/routes/auth.js
```js
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { SECRET_KEY, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/register', (req, res) => {
  const { email, password, name, phone, role = 'user' } = req.body
  if (!email || !password || !name) return res.status(400).json({ error: '필수 항목을 입력해주세요' })
  if (role === 'admin') return res.status(403).json({ error: '관리자 계정은 직접 생성할 수 없어요' })

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (exists) return res.status(409).json({ error: '이미 사용 중인 이메일이에요' })

  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare(
    'INSERT INTO users (email, password, name, phone, role) VALUES (?,?,?,?,?)'
  ).run(email, hash, name, phone || null, role)

  if (role === 'attorney') {
    db.prepare('INSERT INTO attorney_profiles (user_id) VALUES (?)').run(result.lastInsertRowid)
  }

  const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(result.lastInsertRowid)
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '7d' })
  res.json({ token, user })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸어요' })

  const ok = bcrypt.compareSync(password, user.password)
  if (!ok) return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸어요' })

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '7d' })
  const { password: _, ...safeUser } = user
  res.json({ token, user: safeUser })
})

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, name, phone, role, points, profile_image, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없어요' })

  let attorney = null
  if (user.role === 'attorney') {
    attorney = db.prepare('SELECT * FROM attorney_profiles WHERE user_id = ?').get(user.id)
    if (attorney) {
      attorney.specialties = db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(attorney.id).map(r => r.specialty)
      attorney.available_days = JSON.parse(attorney.available_days || '[]')
    }
  }
  res.json({ user, attorney })
})

router.put('/me', authMiddleware, (req, res) => {
  const { name, phone } = req.body
  db.prepare('UPDATE users SET name=?, phone=?, updated_at=datetime("now","localtime") WHERE id=?').run(name, phone, req.user.id)
  res.json({ ok: true })
})

export default router

```

## server/routes/attorneys.js
```js
import { Router } from 'express'
import db from '../db.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()

// 노무사 목록 조회
router.get('/', (req, res) => {
  const { region, specialty, sort = 'rating', online } = req.query

  let attorneys = db.prepare(`
    SELECT ap.*, u.name, u.email, u.profile_image,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(DISTINCT r.id) as review_count,
      COUNT(DISTINCT c.id) as consultation_count
    FROM attorney_profiles ap
    JOIN users u ON u.id = ap.user_id
    LEFT JOIN reviews r ON r.attorney_id = ap.id
    LEFT JOIN consultations c ON c.attorney_id = ap.id AND c.status = 'completed'
    WHERE ap.is_approved = 1
    ${region && region !== '전체' ? "AND ap.region LIKE '%' || ? || '%'" : ''}
    ${online === '1' ? 'AND ap.is_online = 1' : ''}
    GROUP BY ap.id
    ORDER BY ${sort === 'price' ? 'ap.chat_price ASC' : sort === 'reviews' ? 'review_count DESC' : 'avg_rating DESC'}
  `, ...(region && region !== '전체' ? [region] : [])).all(...(region && region !== '전체' ? [region] : []))

  // 전문분야 추가
  attorneys = attorneys.map(a => ({
    ...a,
    specialties: db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(a.id).map(r => r.specialty),
    avg_rating: Math.round(a.avg_rating * 10) / 10,
    available_days: JSON.parse(a.available_days || '[]'),
  }))

  if (specialty && specialty !== '전체') {
    attorneys = attorneys.filter(a => a.specialties.includes(specialty))
  }

  res.json(attorneys)
})

// 노무사 상세 조회
router.get('/:id', (req, res) => {
  const attorney = db.prepare(`
    SELECT ap.*, u.name, u.email, u.profile_image
    FROM attorney_profiles ap
    JOIN users u ON u.id = ap.user_id
    WHERE ap.id = ?
  `).get(req.params.id)

  if (!attorney) return res.status(404).json({ error: '노무사를 찾을 수 없어요' })

  attorney.specialties = db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(attorney.id).map(r => r.specialty)
  attorney.available_days = JSON.parse(attorney.available_days || '[]')

  const reviews = db.prepare(`
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.attorney_id = ?
    ORDER BY r.created_at DESC
    LIMIT 10
  `).all(attorney.id)

  const stats = db.prepare(`
    SELECT COUNT(*) as total, AVG(rating) as avg_rating
    FROM reviews WHERE attorney_id = ?
  `).get(attorney.id)

  res.json({
    ...attorney,
    reviews,
    avg_rating: Math.round((stats.avg_rating || 0) * 10) / 10,
    review_count: stats.total,
  })
})

// 노무사 프로필 수정 (본인)
router.put('/profile/me', authMiddleware, requireRole('attorney'), (req, res) => {
  const { firm_name, introduction, career_years, region, address,
    chat_price, call_price, visit_price, free_first,
    available_from, available_to, available_days, specialties } = req.body

  const prof = db.prepare('SELECT id FROM attorney_profiles WHERE user_id = ?').get(req.user.id)
  if (!prof) return res.status(404).json({ error: '노무사 프로필이 없어요' })

  db.prepare(`
    UPDATE attorney_profiles SET
      firm_name=?, introduction=?, career_years=?, region=?, address=?,
      chat_price=?, call_price=?, visit_price=?, free_first=?,
      available_from=?, available_to=?, available_days=?
    WHERE id=?
  `).run(firm_name, introduction, career_years, region, address,
    chat_price, call_price, visit_price, free_first ? 1 : 0,
    available_from, available_to, JSON.stringify(available_days || []), prof.id)

  if (specialties) {
    db.prepare('DELETE FROM attorney_specialties WHERE attorney_id = ?').run(prof.id)
    for (const s of specialties) {
      db.prepare('INSERT INTO attorney_specialties (attorney_id, specialty) VALUES (?,?)').run(prof.id, s)
    }
  }

  res.json({ ok: true })
})

// 온라인 상태 토글
router.patch('/status/online', authMiddleware, requireRole('attorney'), (req, res) => {
  const { is_online } = req.body
  db.prepare('UPDATE attorney_profiles SET is_online=? WHERE user_id=?').run(is_online ? 1 : 0, req.user.id)
  res.json({ ok: true, is_online })
})

// 노무사 후기 작성
router.post('/:id/reviews', authMiddleware, (req, res) => {
  const { consultation_id, rating, content, category } = req.body
  const attorney = db.prepare('SELECT id FROM attorney_profiles WHERE id = ?').get(req.params.id)
  if (!attorney) return res.status(404).json({ error: '노무사를 찾을 수 없어요' })

  const result = db.prepare(`
    INSERT INTO reviews (consultation_id, user_id, attorney_id, rating, content, category)
    VALUES (?,?,?,?,?,?)
  `).run(consultation_id, req.user.id, attorney.id, rating, content, category)

  res.json({ id: result.lastInsertRowid })
})

export default router

```

## server/routes/consultations.js
```js
import { Router } from 'express'
import db from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 상담 신청
router.post('/', authMiddleware, (req, res) => {
  const { attorney_id, type, topic, title, content } = req.body

  // 가격 조회
  let price = 0
  if (attorney_id) {
    const prof = db.prepare('SELECT chat_price, call_price, visit_price, free_first FROM attorney_profiles WHERE id = ?').get(attorney_id)
    if (prof) {
      const priceMap = { chat: prof.chat_price, call: prof.call_price, visit: prof.visit_price }
      price = prof.free_first ? 0 : (priceMap[type] || 0)
    }
  }

  const result = db.prepare(`
    INSERT INTO consultations (user_id, attorney_id, type, topic, title, content, price, status)
    VALUES (?,?,?,?,?,?,?, ?)
  `).run(req.user.id, attorney_id || null, type || 'chat', topic, title, content, price, attorney_id ? 'matched' : 'pending')

  // 알림
  if (attorney_id) {
    const prof = db.prepare('SELECT user_id FROM attorney_profiles WHERE id = ?').get(attorney_id)
    if (prof) {
      db.prepare(`INSERT INTO notifications (user_id, type, title, body) VALUES (?,?,?,?)`).run(
        prof.user_id, 'new_consultation', '새 상담 요청이 왔어요!', `${req.user.name}님이 상담을 신청했어요.`
      )
    }
  }

  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(result.lastInsertRowid)
  res.json(consultation)
})

// 내 상담 목록
router.get('/my', authMiddleware, (req, res) => {
  let consultations
  if (req.user.role === 'attorney') {
    const prof = db.prepare('SELECT id FROM attorney_profiles WHERE user_id = ?').get(req.user.id)
    if (!prof) return res.json([])
    consultations = db.prepare(`
      SELECT c.*, u.name as user_name, u.phone as user_phone
      FROM consultations c
      JOIN users u ON u.id = c.user_id
      WHERE c.attorney_id = ?
      ORDER BY c.created_at DESC
    `).all(prof.id)
  } else {
    consultations = db.prepare(`
      SELECT c.*, u.name as attorney_name, ap.firm_name
      FROM consultations c
      LEFT JOIN attorney_profiles ap ON ap.id = c.attorney_id
      LEFT JOIN users u ON u.id = ap.user_id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(req.user.id)
  }
  res.json(consultations)
})

// 상담 상세 + 채팅 메시지
router.get('/:id', authMiddleware, (req, res) => {
  const consultation = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id)
  if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없어요' })

  // 권한 체크
  const prof = req.user.role === 'attorney'
    ? db.prepare('SELECT id FROM attorney_profiles WHERE user_id = ?').get(req.user.id)
    : null

  const isOwner = consultation.user_id === req.user.id
  const isAttorney = prof && consultation.attorney_id === prof.id
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAttorney && !isAdmin) {
    return res.status(403).json({ error: '접근 권한이 없어요' })
  }

  const messages = db.prepare(`
    SELECT m.*, u.name as sender_name, u.role as sender_role_type
    FROM chat_messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.consultation_id = ?
    ORDER BY m.created_at ASC
  `).all(req.params.id)

  // 읽음 처리
  db.prepare('UPDATE chat_messages SET is_read=1 WHERE consultation_id=? AND sender_id != ?').run(req.params.id, req.user.id)

  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(consultation.user_id)
  let attorney = null
  if (consultation.attorney_id) {
    attorney = db.prepare(`
      SELECT ap.*, u.name, u.email FROM attorney_profiles ap
      JOIN users u ON u.id = ap.user_id
      WHERE ap.id = ?
    `).get(consultation.attorney_id)
  }

  res.json({ consultation, messages, user, attorney })
})

// 상담 상태 변경
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body
  db.prepare('UPDATE consultations SET status=?, updated_at=datetime("now","localtime") WHERE id=?').run(status, req.params.id)
  res.json({ ok: true })
})

// 메시지 전송 (REST fallback)
router.post('/:id/messages', authMiddleware, (req, res) => {
  const { content } = req.body
  const result = db.prepare(`
    INSERT INTO chat_messages (consultation_id, sender_id, sender_role, content)
    VALUES (?,?,?,?)
  `).run(req.params.id, req.user.id, req.user.role, content)

  const message = db.prepare(`
    SELECT m.*, u.name as sender_name FROM chat_messages m
    JOIN users u ON u.id = m.sender_id WHERE m.id = ?
  `).get(result.lastInsertRowid)

  res.json(message)
})

// Q&A 목록
router.get('/qna/list', (req, res) => {
  const { category } = req.query
  const posts = db.prepare(`
    SELECT q.*, u.name as author_name,
      (SELECT COUNT(*) FROM qna_answers WHERE post_id = q.id) as answer_count
    FROM qna_posts q
    JOIN users u ON u.id = q.user_id
    ${category && category !== '전체' ? "WHERE q.category = ?" : ''}
    ORDER BY q.created_at DESC LIMIT 20
  `).all(...(category && category !== '전체' ? [category] : []))
  res.json(posts)
})

router.post('/qna/post', authMiddleware, (req, res) => {
  const { category, title, content, is_anonymous } = req.body
  const result = db.prepare(`
    INSERT INTO qna_posts (user_id, category, title, content, is_anonymous) VALUES (?,?,?,?,?)
  `).run(req.user.id, category, title, content, is_anonymous ? 1 : 0)
  res.json({ id: result.lastInsertRowid })
})

export default router

```

## server/routes/admin.js
```js
import { Router } from 'express'
import db from '../db.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware, requireRole('admin'))

// 대시보드 통계
router.get('/stats', (req, res) => {
  const stats = {
    total_users: db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get().c,
    total_attorneys: db.prepare("SELECT COUNT(*) as c FROM attorney_profiles").get().c,
    approved_attorneys: db.prepare("SELECT COUNT(*) as c FROM attorney_profiles WHERE is_approved = 1").get().c,
    pending_attorneys: db.prepare("SELECT COUNT(*) as c FROM attorney_profiles WHERE is_approved = 0").get().c,
    total_consultations: db.prepare("SELECT COUNT(*) as c FROM consultations").get().c,
    completed_consultations: db.prepare("SELECT COUNT(*) as c FROM consultations WHERE status = 'completed'").get().c,
    total_reviews: db.prepare("SELECT COUNT(*) as c FROM reviews").get().c,
    avg_rating: db.prepare("SELECT ROUND(AVG(rating),2) as r FROM reviews").get().r || 0,
    recent_consultations: db.prepare(`
      SELECT c.*, u.name as user_name
      FROM consultations c JOIN users u ON u.id = c.user_id
      ORDER BY c.created_at DESC LIMIT 5
    `).all(),
  }
  res.json(stats)
})

// 전체 사용자 목록
router.get('/users', (req, res) => {
  const { role, page = 1, q } = req.query
  const limit = 20
  const offset = (page - 1) * limit

  const where = []
  const params = []
  if (role) { where.push('role = ?'); params.push(role) }
  if (q) { where.push('(name LIKE ? OR email LIKE ?)'); params.push(`%${q}%`, `%${q}%`) }

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : ''
  const users = db.prepare(`SELECT id, email, name, phone, role, points, created_at FROM users ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset)
  const total = db.prepare(`SELECT COUNT(*) as c FROM users ${whereStr}`).get(...params).c

  res.json({ users, total, pages: Math.ceil(total / limit) })
})

// 노무사 승인/거절
router.patch('/attorneys/:id/approve', (req, res) => {
  const { approved } = req.body
  db.prepare('UPDATE attorney_profiles SET is_approved = ? WHERE id = ?').run(approved ? 1 : 0, req.params.id)

  if (approved) {
    const prof = db.prepare('SELECT user_id FROM attorney_profiles WHERE id = ?').get(req.params.id)
    if (prof) {
      db.prepare("INSERT INTO notifications (user_id, type, title, body) VALUES (?,?,?,?)").run(
        prof.user_id, 'approved', '노무사 승인 완료!', '찾아줘노무사 파트너 노무사로 승인되었어요. 지금 바로 활동을 시작해보세요!'
      )
    }
  }
  res.json({ ok: true })
})

// 전체 노무사 목록
router.get('/attorneys', (req, res) => {
  const attorneys = db.prepare(`
    SELECT ap.*, u.name, u.email, u.created_at as joined_at,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(DISTINCT r.id) as review_count,
      COUNT(DISTINCT c.id) as consultation_count
    FROM attorney_profiles ap
    JOIN users u ON u.id = ap.user_id
    LEFT JOIN reviews r ON r.attorney_id = ap.id
    LEFT JOIN consultations c ON c.attorney_id = ap.id
    GROUP BY ap.id
    ORDER BY ap.is_approved DESC, ap.created_at DESC
  `).all().map(a => ({
    ...a,
    specialties: db.prepare('SELECT specialty FROM attorney_specialties WHERE attorney_id = ?').all(a.id).map(r => r.specialty),
    avg_rating: Math.round(a.avg_rating * 10) / 10,
  }))
  res.json(attorneys)
})

// 전체 상담 목록
router.get('/consultations', (req, res) => {
  const consultations = db.prepare(`
    SELECT c.*, u.name as user_name,
      au.name as attorney_name, ap.firm_name
    FROM consultations c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN attorney_profiles ap ON ap.id = c.attorney_id
    LEFT JOIN users au ON au.id = ap.user_id
    ORDER BY c.created_at DESC
    LIMIT 50
  `).all()
  res.json(consultations)
})

// 사용자 비활성화
router.patch('/users/:id/toggle', (req, res) => {
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.params.id)
  if (user?.role === 'admin') return res.status(403).json({ error: '관리자는 변경 불가' })
  // 실제론 is_active 컬럼 추가 필요 - 여기선 메모
  res.json({ ok: true })
})

export default router

```

