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
