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
