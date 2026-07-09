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
