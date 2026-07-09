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
