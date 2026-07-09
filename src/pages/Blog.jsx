import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Clock, Search } from 'lucide-react'
import { blogPosts } from '../data/blogPosts'

const allCategories = ['전체', ...new Set(blogPosts.map(p => p.category))]

export default function Blog() {
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')

  const filtered = blogPosts.filter(p => {
    if (category !== '전체' && p.category !== category) return false
    if (search && !p.title.includes(search) && !p.excerpt.includes(search)) return false
    return true
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">찾노BLOG</h1>
          <p className="text-gray-500 mb-5">노무 지식을 쉽고 빠르게 알려드려요.</p>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="글 제목 검색"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{post.emoji}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{post.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
                  <span className="ml-auto">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
