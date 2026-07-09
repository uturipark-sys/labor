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
