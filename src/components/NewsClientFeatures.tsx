'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, TrendingUp, Users, Target, Clock, Zap } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  summary: string
  fullContent: string
  source: string
  publishedAt: string
  tags: string[]
  category: string
  originalUrl: string
  isFeatured: boolean
  confidence?: number
  wordCount?: number
  insights?: any[]
  imageUrl?: string
  readTime?: number
}

interface NewsClientFeaturesProps {
  articles: NewsArticle[]
  onFilterChange: (filters: { searchTerm: string; category: string; tag: string }) => void
}

export default function NewsClientFeatures({ articles, onFilterChange }: NewsClientFeaturesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])

  const categories = ['all', ...new Set(articles.map(article => article.category))]
  const allTags = [...new Set(articles.flatMap(article => article.tags))]

  useEffect(() => {
    // Calculate trending topics based on frequency
    const tagCounts: { [key: string]: number } = {}
    articles.forEach(article => {
      article.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    const sorted = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([tag]) => tag)
    
    setTrendingTopics(sorted)
  }, [articles])

  useEffect(() => {
    const filters = {
      searchTerm,
      category: selectedCategory,
      tag: selectedTag
    }
    onFilterChange(filters)
  }, [searchTerm, selectedCategory, selectedTag, onFilterChange])

  const quickStats = {
    totalArticles: articles.length,
    featuredArticles: articles.filter(a => a.isFeatured).length,
    avgConfidence: articles.length > 0 
      ? Math.round(articles.reduce((sum, a) => sum + (a.confidence || 0), 0) / articles.length * 100)
      : 0,
    totalSources: new Set(articles.map(a => a.source)).size
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">إجمالي الأخبار</p>
                <p className="text-2xl font-bold text-blue-900">{quickStats.totalArticles}</p>
              </div>
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">مميزة</p>
                <p className="text-2xl font-bold text-yellow-900">{quickStats.featuredArticles}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">متوسط الدقة</p>
                <p className="text-2xl font-bold text-green-900">{quickStats.avgConfidence}%</p>
              </div>
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">المصادر</p>
                <p className="text-2xl font-bold text-purple-900">{quickStats.totalSources}</p>
              </div>
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ابحث في العناوين والملخصات والوسوم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="الوسوم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الوسوم</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              المواضيع الرائجة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(topic)}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  #{index + 1} {topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            فلاتر سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all')
                setSelectedTag('all')
                setSearchTerm('')
              }}
            >
              الكل
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const featured = articles.filter(a => a.isFeatured)
                if (featured.length > 0) {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedTag('all')
                }
              }}
            >
              المميزة فقط
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const highConfidence = articles.filter(a => (a.confidence || 0) > 0.8)
                if (highConfidence.length > 0) {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedTag('all')
                }
              }}
            >
              عالية الدقة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const recent = articles.filter(a => {
                  const articleDate = new Date(a.publishedAt)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return articleDate >= weekAgo
                })
                if (recent.length > 0) {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedTag('all')
                }
              }}
            >
              هذا الأسبوع
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}