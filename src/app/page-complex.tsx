'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Clock, 
  Tag, 
  Bell, 
  Mail, 
  Download,
  ArrowUpRight,
  Sparkles,
  Star,
  Code,
  Database,
  Zap,
  Package,
  FileText
} from 'lucide-react'
import EnhancedNewsCard from '@/components/EnhancedNewsCard'
import NewsClientFeatures from '@/components/NewsClientFeatures'
import Link from 'next/link'
import DownloadButton from '@/components/DownloadButton'

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
  insights?: {
    type: string
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    category: string
  }[]
  imageUrl?: string
  readTime?: number
}

async function getNewsArticles() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/news?limit=20`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.articles
    }
  } catch (error) {
    console.error('Error fetching news:', error)
  }
  
  // Fallback mock data if API fails
  return [
    {
      id: '1',
      title: 'انسحاب "هايك" من السوق بعد قرار الهند بحظر الألعاب النقدية',
      summary: 'توقفت شركة "هايك"، التي بدأت كمنافس لواتساب ثم تحولت للألعاب النقدية، عن العمل بعد فرض الهند حظراً شاملاً على هذا النوع من الألعاب.',
      fullContent: 'توقفت شركة "هايك"، التي بدأت كمنافس لواتساب ثم تحولت للألعاب النقدية، عن العمل بعد فرض الهند حظراً شاملاً على هذا النوع من الألعاب. **النقاط الرئيسية:** 1. **البداية والتحول:** تأسيس "هايك" كمنافس لواتساب ثم تحولها إلى قطاع الألعاب النقدية. 2. **الحظر الهندي:** قرار الهند بحظر الألعاب النقدية بشكل شامل. 3. **توقف العمليات:** إيقاف "هايك" لجميع عملياتها نتيجة للحظر. 4. **تأثير على السوق:** انعكاسات قرار الحظر على شركات الألعاب النقدية في الهند. 5. **التحديات المستقبلية:** الصعوبات التي تواجهها الشركات التقنية في ظل التشريعات الصارمة.',
      source: 'TechCrunch',
      publishedAt: '2025-06-20',
      tags: ['ألعاب نقدية', 'تقنية', 'هند', 'حظر', 'هايك'],
      category: 'تقنية',
      originalUrl: 'https://example.com/article1',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      readTime: 3,
      confidence: 0.92,
      wordCount: 150,
      insights: [
        {
          type: 'strategic',
          title: 'البداية والتحول',
          description: 'تأسيس "هايك" كمنافس لواتساب ثم تحولها إلى قطاع الألعاب النقدية.',
          impact: 'high' as const,
          category: 'استراتيجية'
        },
        {
          type: 'market',
          title: 'الحظر الهندي',
          description: 'قرار الهند بحظر الألعاب النقدية بشكل شامل.',
          impact: 'high' as const,
          category: 'سوق'
        },
        {
          type: 'operational',
          title: 'توقف العمليات',
          description: 'إيقاف "هايك" لجميع عملياتها نتيجة للحظر.',
          impact: 'high' as const,
          category: 'عمليات'
        },
        {
          type: 'market',
          title: 'تأثير على السوق',
          description: 'انعكاسات قرار الحظر على شركات الألعاب النقدية في الهند.',
          impact: 'medium' as const,
          category: 'سوق'
        },
        {
          type: 'strategic',
          title: 'التحديات المستقبلية',
          description: 'الصعوبات التي تواجهها الشركات التقنية في ظل التشريعات الصارمة.',
          impact: 'medium' as const,
          category: 'استراتيجية'
        }
      ]
    }
  ]
}

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch articles
        const newsData = await getNewsArticles()
        setArticles(newsData)
        setFilteredArticles(newsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = (filters: { searchTerm: string; category: string; tag: string }) => {
    let filtered = articles

    if (filters.searchTerm) {
      filtered = filtered.filter(article =>
        article.title.includes(filters.searchTerm) ||
        article.summary.includes(filters.searchTerm) ||
        article.tags.some(tag => tag.includes(filters.searchTerm))
      )
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(article => article.category === filters.category)
    }

    if (filters.tag !== 'all') {
      filtered = filtered.filter(article => article.tags.includes(filters.tag))
    }

    setFilteredArticles(filtered)
  }

  const featuredArticles = filteredArticles.filter(article => article.isFeatured)
  const regularArticles = filteredArticles.filter(article => !article.isFeatured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ملخص التقنية
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  أخبار التقنية والذكاء الاصطناعي للمتخصصين واصحاب القرار
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200">
                <Clock className="w-3 h-3" />
                تحديث يومي
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 border-blue-200 text-blue-700">
                <TrendingUp className="w-3 h-3" />
                للمتخصصين
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                className="hidden sm:flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300"
              >
                <Bell className="w-4 h-4" />
                اشترك
              </Button>
                <Link href="/download">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex items-center gap-1 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Download className="w-4 h-4" />
                  تحميل الكود
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              احصل على ملخصات أخبار التقنية
              <span className="block text-yellow-300">بدقة واحترافية</span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              نحوّل الأخبار التقنية المعقدة إلى ملخصات واضحة ومفيدة للمتخصصين واصحاب القرار
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                استكشف الأخبار
                <ArrowUpRight className="w-4 h-4 mr-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                اشترك في النشرة
                <Mail className="w-4 h-4 mr-2" />
              </Button>
              <Link href="/download">
                <Button size="lg" className="bg-yellow-500 text-blue-900 hover:bg-yellow-400 border-yellow-500">
                  <Download className="w-4 h-4 mr-2" />
                  تحميل الكود المصدري
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12 sm:py-16 border-y border-purple-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                احصل على الكود المصدري الكامل
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                قم بتنزيل المشروع الكامل مع جميع الملفات والمكونات. جاهز للتطوير والتخصيص مباشرة!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">كود نظيف</h3>
                <p className="text-sm text-gray-600">TypeScript مع أفضل الممارسات والتعليقات</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">قاعدة بيانات</h3>
                <p className="text-sm text-gray-600">Prisma + SQLite جاهزة للاستخدام</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">جاهز للتشغيل</h3>
                <p className="text-sm text-gray-600">npm install && npm run dev</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/download">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  تحميل الكود المصدري
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>0.46 MB</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>123 ملف</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                يتضمن جميع الملفات • توثيق كامل • جاهز للتطوير المباشر
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الأخبار...</p>
          </div>
        ) : (
          <>
            {/* Client-side Features */}
            <NewsClientFeatures 
              articles={articles} 
              onFilterChange={handleFilterChange} 
            />

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    الأخبار المميزة
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredArticles.map(article => (
                    <EnhancedNewsCard key={article.id} article={article} variant="featured" />
                  ))}
                </div>
              </section>
            )}

            {/* Latest Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  أحدث الأخبار
                </h2>
              </div>
              
              <div className="space-y-6">
                {regularArticles.map(article => (
                  <EnhancedNewsCard key={article.id} article={article} variant="compact" />
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">لا توجد أخبار تطابق معايير البحث</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

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