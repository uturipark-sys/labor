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
