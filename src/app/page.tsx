'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, TrendingUp, Clock, Tag, ExternalLink, Calendar, Building2, Download, Settings, Package, CheckCircle } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  tags: string[]
  category: string
  originalUrl: string
  isFeatured: boolean
}

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'تقييم مشترك بين أنثروبيك وأوبن إيه آي يكشف عن أداء نماذج الذكاء الاصطناعي',
      summary: 'في صيف 2025 أجرت شركتا أنثروبيك وأوبن إيه آي تجربة تقييم متبادلة لأنظمة الذكاء الاصطناعي الخاصة بهما، باستخدام اختبارات داخلية تركّز على قضايا المواءمة والسلوكيات المثيرة للقلق.',
      source: 'TechCrunch',
      publishedAt: '2025-06-20',
      tags: ['ذكاء اصطناعي', 'تقييم', 'أوبن إيه آي', 'أنثروبيك'],
      category: 'ذكاء اصطناعي',
      originalUrl: 'https://example.com/article1',
      isFeatured: true
    },
    {
      id: '2',
      title: 'تطورات جديدة في تقنيات التعلم العميق لعام 2025',
      summary: 'شهدت تقنيات التعلم العميق تطورات كبيرة هذا العام، مع إطلاق نماذج جديدة تتفوق في قدراتها على الفهم والاستدلال.',
      source: 'Wired',
      publishedAt: '2025-06-19',
      tags: ['تعلم عميق', 'تطوير', 'نماذج جديدة'],
      category: 'تطوير',
      originalUrl: 'https://example.com/article2',
      isFeatured: false
    },
    {
      id: '3',
      title: 'استراتيجيات التحول الرقمي للشركات العربية',
      summary: 'تستكشف الشركات العربية استراتيجيات جديدة للتحول الرقمي، مع التركيز على تبني تقنيات الذكاء الاصطناعي والتحليلات المتقدمة.',
      source: 'Forbes Middle East',
      publishedAt: '2025-06-18',
      tags: ['تحول رقمي', 'شركات', 'استراتيجية'],
      category: 'إدارة',
      originalUrl: 'https://example.com/article3',
      isFeatured: true
    },
    {
      id: '4',
      title: 'أمن المعلومات في عصر الذكاء الاصطناعي',
      summary: 'مع تزايد اعتماد المؤسسات على تقنيات الذكاء الاصطناعي، تبرز الحاجة إلى استراتيجيات أمنية متطورة لحماية البيانات والأنظمة.',
      source: 'Ars Technica',
      publishedAt: '2025-06-17',
      tags: ['أمن سيبراني', 'ذكاء اصطناعي', 'حماية'],
      category: 'أمن',
      originalUrl: 'https://example.com/article4',
      isFeatured: false
    },
    {
      id: '5',
      title: 'ثورة إنترنت الأشياء في المدن الذكية',
      summary: 'تشهد المدن الذكية حول العالم تحولاً كبيراً بفضل تقنيات إنترنت الأشياء، مما يحسن كفاءة الخدمات وجودة الحياة.',
      source: 'MIT Technology Review',
      publishedAt: '2025-06-16',
      tags: ['إنترنت الأشياء', 'مدن ذكية', 'تكنولوجيا'],
      category: 'تقنية',
      originalUrl: 'https://example.com/article5',
      isFeatured: true
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles)
      setFilteredArticles(mockArticles)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.includes(searchTerm) ||
        article.summary.includes(searchTerm) ||
        article.tags.some(tag => tag.includes(searchTerm))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(article => article.tags.includes(selectedTag))
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory, selectedTag])

  const categories = ['all', ...new Set(articles.map(article => article.category))]
  const allTags = [...new Set(articles.flatMap(article => article.tags))]

  const featuredArticles = filteredArticles.filter(article => article.isFeatured)
  const regularArticles = filteredArticles.filter(article => !article.isFeatured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">ملخص التقنية</h1>
              <p className="text-muted-foreground mt-1">أحدث أخبار التقنية والذكاء الاصطناعي للمتخصصين واصحاب القرار</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                تحديث يومي
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                للمتخصصين
              </Badge>
              <Button 
                asChild
                variant="default" 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <a href="/download">
                  <Download className="w-4 h-4" />
                  تحميل المشروع
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              ملخصات أخبار التقنية
              <span className="block text-yellow-300">بدقة واحترافية</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              نحوّل الأخبار التقنية المعقدة إلى ملخصات واضحة ومفيدة
            </p>
          </div>
        </div>
      </section>

      {/* Project Download Promotion */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-right">
              <h2 className="text-3xl font-bold mb-4">احصل على المشروع الكامل!</h2>
              <p className="text-lg mb-6 opacity-90">
                قم بتحميل النسخة الكاملة من مشروع ملخص التقنية مع جميع الميزات المتقدمة والكود المصدري
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <a href="/download" className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    تحميل المشروع
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                  <a href="/admin" className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    لوحة التحكم
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  ما يتضمنه المشروع:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    نظام تلخيص الأخبار بالذكاء الاصطناعي
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    واجهة إدارة متكاملة
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    معالجة تلقائية لخلاصات RSS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    نظام تصنيف ذكي
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    تصميم متجاوب للجوال
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    وثائق كاملة وPRD
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ابحث في الأخبار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
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
                <SelectTrigger className="w-[150px]">
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
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الأخبار...</p>
          </div>
        ) : (
          <>
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  الأخبار المميزة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredArticles.map(article => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="default">{article.category}</Badge>
                          <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                        </div>
                        <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4 text-right">
                          {article.summary}
                        </CardDescription>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {article.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 ml-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{article.source}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(article.originalUrl, '_blank')}
                          >
                            قراءة المزيد
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Latest Articles */}
            <section>
              <h2 className="text-2xl font-bold mb-6">أحدث الأخبار</h2>
              <div className="space-y-4">
                {regularArticles.map(article => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {article.source}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {article.publishedAt}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-muted-foreground mb-3">{article.summary}</p>
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => window.open(article.originalUrl, '_blank')}
                        >
                          قراءة المزيد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد أخبار تطابق معايير البحث</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p>ملخص التقنية - خدمة تلخيص الأخبار التقنية للمتخصصين واصحاب القرار</p>
            <p className="text-sm mt-2">تحديث تلقائي يومي باستخدام أحدث تقنيات الذكاء الاصطناعي</p>
          </div>
        </div>
      </footer>
    </div>
  )
}