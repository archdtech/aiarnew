'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Clock, 
  Star,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  FileText,
  Tag,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalArticles: number
    totalViews: number
    totalSources: number
    avgProcessingTime: number
    todayArticles: number
    todayViews: number
    weeklyGrowth: number
    monthlyGrowth: number
  }
  topArticles: Array<{
    id: string
    title: string
    views: number
    category: string
    publishedAt: string
    source: string
  }>
  topSources: Array<{
    id: string
    name: string
    articleCount: number
    totalViews: number
    avgViewsPerArticle: number
    lastUpdated: string
  }>
  categoryStats: Array<{
    name: string
    count: number
    percentage: number
    views: number
    growth: number
  }>
  tagStats: Array<{
    name: string
    count: number
    articles: number
    trend: 'up' | 'down' | 'stable'
  }>
  engagement: {
    avgReadTime: number
    bounceRate: number
    returnVisitors: number
    popularCategories: string[]
  }
  timeline: Array<{
    date: string
    articles: number
    views: number
    sources: number
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Mock data for demonstration
      setAnalytics(generateMockAnalytics())
    } finally {
      setLoading(false)
    }
  }

  const generateMockAnalytics = (): AnalyticsData => ({
    overview: {
      totalArticles: 1247,
      totalViews: 45632,
      totalSources: 23,
      avgProcessingTime: 2.4,
      todayArticles: 18,
      todayViews: 1234,
      weeklyGrowth: 12.5,
      monthlyGrowth: 34.8
    },
    topArticles: [
      {
        id: '1',
        title: 'تقييم مشترك بين أنثروبيك وأوبن إيه آي يكشف عن أداء نماذج الذكاء الاصطناعي',
        views: 2341,
        category: 'ذكاء اصطناعي',
        publishedAt: '2025-06-20',
        source: 'TechCrunch'
      },
      {
        id: '2',
        title: 'تطورات جديدة في تقنيات التعلم العميق لعام 2025',
        views: 1876,
        category: 'تطوير',
        publishedAt: '2025-06-19',
        source: 'Wired'
      },
      {
        id: '3',
        title: 'استراتيجيات التحول الرقمي للشركات العربية',
        views: 1654,
        category: 'إدارة',
        publishedAt: '2025-06-18',
        source: 'Forbes Middle East'
      }
    ],
    topSources: [
      {
        id: '1',
        name: 'TechCrunch',
        articleCount: 156,
        totalViews: 12450,
        avgViewsPerArticle: 79.8,
        lastUpdated: '2025-06-20'
      },
      {
        id: '2',
        name: 'Wired',
        articleCount: 134,
        totalViews: 9876,
        avgViewsPerArticle: 73.7,
        lastUpdated: '2025-06-20'
      },
      {
        id: '3',
        name: 'The Verge',
        articleCount: 98,
        totalViews: 8234,
        avgViewsPerArticle: 84.0,
        lastUpdated: '2025-06-19'
      }
    ],
    categoryStats: [
      {
        name: 'ذكاء اصطناعي',
        count: 342,
        percentage: 27.4,
        views: 15678,
        growth: 15.2
      },
      {
        name: 'تطوير',
        count: 298,
        percentage: 23.9,
        views: 12456,
        growth: 8.7
      },
      {
        name: 'إدارة',
        count: 234,
        percentage: 18.8,
        views: 9876,
        growth: 12.3
      },
      {
        name: 'أمن سيبراني',
        count: 187,
        percentage: 15.0,
        views: 7654,
        growth: 5.4
      },
      {
        name: 'سحابة',
        count: 186,
        percentage: 14.9,
        views: 6968,
        growth: 9.1
      }
    ],
    tagStats: [
      {
        name: 'ذكاء اصطناعي',
        count: 456,
        articles: 342,
        trend: 'up'
      },
      {
        name: 'تعلم عميق',
        count: 234,
        articles: 187,
        trend: 'up'
      },
      {
        name: 'تحول رقمي',
        count: 198,
        articles: 156,
        trend: 'stable'
      },
      {
        name: 'أمن سيبراني',
        count: 167,
        articles: 134,
        trend: 'down'
      },
      {
        name: 'سحابة',
        count: 145,
        articles: 98,
        trend: 'up'
      }
    ],
    engagement: {
      avgReadTime: 4.2,
      bounceRate: 32.5,
      returnVisitors: 1234,
      popularCategories: ['ذكاء اصطناعي', 'تطوير', 'إدارة']
    },
    timeline: [
      { date: '2025-06-14', articles: 15, views: 890, sources: 18 },
      { date: '2025-06-15', articles: 18, views: 1023, sources: 19 },
      { date: '2025-06-16', articles: 22, views: 1156, sources: 20 },
      { date: '2025-06-17', articles: 20, views: 1089, sources: 20 },
      { date: '2025-06-18', articles: 25, views: 1345, sources: 21 },
      { date: '2025-06-19', articles: 23, views: 1298, sources: 22 },
      { date: '2025-06-20', articles: 28, views: 1456, sources: 23 }
    ]
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable', value?: number) => {
    if (trend === 'up' || (value && value > 0)) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (trend === 'down' || (value && value < 0)) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    }
    return <Activity className="w-4 h-4 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">لا توجد بيانات تحليلية متاحة</h2>
          <p className="text-muted-foreground mb-4">سيتم إضافة الرؤى التحليلية قريباً</p>
          <Button onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">الرؤى التحليلية</h1>
              <p className="text-muted-foreground mt-1">تحليلات متقدمة لأداء المحتوى والمصادر</p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 90 يوم</option>
                <option value="1y">آخر سنة</option>
              </select>
              <Button variant="outline" onClick={fetchAnalytics}>
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المقالات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalArticles)}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon('up', analytics.overview.weeklyGrowth)}
                <span>+{formatPercentage(analytics.overview.weeklyGrowth)} هذا الأسبوع</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalViews)}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon('up', analytics.overview.monthlyGrowth)}
                <span>+{formatPercentage(analytics.overview.monthlyGrowth)} هذا الشهر</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المصادر النشطة</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalSources}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{analytics.overview.todayArticles} مقال اليوم</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط وقت المعالجة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.avgProcessingTime}s</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{analytics.overview.todayViews} مشاهدة اليوم</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="articles">المقالات</TabsTrigger>
            <TabsTrigger value="sources">المصادر</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات</TabsTrigger>
            <TabsTrigger value="engagement">المشاركة</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Timeline Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  النشاط خلال الفترة المحددة
                </CardTitle>
                <CardDescription>
                  تطور عدد المقالات والمشاهدات والمصادر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.timeline.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{new Date(day.date).toLocaleDateString('ar-SA', { weekday: 'short' })}</span>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{day.articles} مقال</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{day.views} مشاهدة</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">{day.sources} مصدر</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    التصنيفات الأكثر أداءً
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.categoryStats.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{formatPercentage(category.percentage)}</span>
                            {getTrendIcon('up', category.growth)}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{category.count} مقال</span>
                          <span>{formatNumber(category.views)} مشاهدة</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    الوسوم الأكثر شيوعاً
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.tagStats.map((tag, index) => (
                      <div key={tag.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{tag.name}</Badge>
                          <span className="text-sm text-muted-foreground">{tag.articles} مقال</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{tag.count}</span>
                          {getTrendIcon(tag.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  المقالات الأكثر مشاهدة
                </CardTitle>
                <CardDescription>
                  أفضل المقالات أداءً بناءً على عدد المشاهدات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topArticles.map((article, index) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                          <Badge variant="outline">{article.category}</Badge>
                          <span className="text-sm text-muted-foreground">{article.source}</span>
                          <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                        </div>
                        <h3 className="font-medium mb-2">{article.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{formatNumber(article.views)}</div>
                          <div className="text-sm text-muted-foreground">مشاهدة</div>
                        </div>
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  أداء المصادر
                </CardTitle>
                <CardDescription>
                  إحصائيات مفصلة عن أداء كل مصدر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topSources.map((source, index) => (
                    <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{source.name}</h3>
                          <Badge variant="outline">{source.articleCount} مقال</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>آخر تحديث: {source.lastUpdated}</span>
                          <span>متوسط المشاهدات: {formatNumber(source.avgViewsPerArticle)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{formatNumber(source.totalViews)}</div>
                        <div className="text-sm text-muted-foreground">إجمالي المشاهدات</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  تحليل التصنيفات
                </CardTitle>
                <CardDescription>
                  تفصيل أداء كل تصنيف واتجاهات النمو
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.categoryStats.map((category, index) => (
                    <Card key={category.name} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">المقالات</span>
                            <span className="font-semibold">{category.count}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">المشاهدات</span>
                            <span className="font-semibold">{formatNumber(category.views)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">النسبة المئوية</span>
                            <span className="font-semibold">{formatPercentage(category.percentage)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">النمو</span>
                            <div className="flex items-center gap-1">
                              {getTrendIcon('up', category.growth)}
                              <span className="font-semibold text-green-600">+{formatPercentage(category.growth)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">متوسط وقت القراءة</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.engagement.avgReadTime} دقيقة</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span>+0.3 دقيقة عن الأسبوع الماضي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">معدل الارتداد</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(analytics.engagement.bounceRate)}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span>-2.1% عن الأسبوع الماضي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الزوار العائدون</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analytics.engagement.returnVisitors)}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span>+15% عن الأسبوع الماضي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">التصنيفات الشائعة</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.engagement.popularCategories.length}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>أكثر التصنيفات تفاعلاً</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  تفاصيل المشاركة
                </CardTitle>
                <CardDescription>
                  تحليل تفصيلي لمشاركة المستخدمين مع المحتوى
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">التصنيفات الأكثر تفاعلاً</h4>
                    <div className="space-y-2">
                      {analytics.engagement.popularCategories.map((category, index) => (
                        <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{category}</span>
                          <Badge variant="secondary">{index + 1}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">مقاييس الأداء</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">معدل التفاعل اليومي</span>
                        <span className="font-semibold">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">معدل التحويل</span>
                        <span className="font-semibold">12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">معدل المشاركة</span>
                        <span className="font-semibold">34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">رضا المستخدمين</span>
                        <span className="font-semibold">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}