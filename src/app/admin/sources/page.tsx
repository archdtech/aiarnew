'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  RefreshCw, 
  Feed, 
  ExternalLink, 
  Trash2, 
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Activity
} from 'lucide-react'

interface NewsSource {
  id: string
  name: string
  url: string
  description: string
  isActive: boolean
  articleCount: number
}

export default function AdminSources() {
  const [sources, setSources] = useState<NewsSource[]>([])
  const [loading, setLoading] = useState(true)
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    rssUrl: '',
    description: ''
  })

  useEffect(() => {
    fetchSources()
  }, [])

  const fetchSources = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sources')
      if (response.ok) {
        const data = await response.json()
        setSources(data.sources)
      }
    } catch (error) {
      console.error('Error fetching sources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.url) return

    try {
      const response = await fetch('/api/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSource)
      })

      if (response.ok) {
        setNewSource({ name: '', url: '', rssUrl: '', description: '' })
        await fetchSources()
      }
    } catch (error) {
      console.error('Error adding source:', error)
    }
  }

  const handleToggleSource = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/sources/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        await fetchSources()
      }
    } catch (error) {
      console.error('Error toggling source:', error)
    }
  }

  const handleDeleteSource = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المصدر؟')) return

    try {
      const response = await fetch(`/api/sources/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchSources()
      }
    } catch (error) {
      console.error('Error deleting source:', error)
    }
  }

  const testSource = async (source: NewsSource) => {
    try {
      const response = await fetch(`/api/sources/${source.id}/test`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        alert(`اختبار المصدر: ${result.message}`)
      }
    } catch (error) {
      console.error('Error testing source:', error)
      alert('فشل في اختبار المصدر')
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة المصادر</h1>
              <p className="text-muted-foreground mt-1">إدارة مصادر الأخبار وخلاصات RSS</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={fetchSources}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Badge variant="outline" className="flex items-center gap-1">
                <Feed className="w-4 h-4" />
                {sources.length} مصدر
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sources">المصادر</TabsTrigger>
            <TabsTrigger value="add">إضافة مصدر</TabsTrigger>
            <TabsTrigger value="stats">إحصائيات</TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">جاري تحميل المصادر...</p>
                </div>
              ) : (
                sources.map((source) => (
                  <Card key={source.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{source.name}</h3>
                            <Badge variant={source.isActive ? "default" : "secondary"}>
                              {source.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              {source.articleCount} مقال
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{source.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary"
                              >
                                {source.url}
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => testSource(source)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Activity className="w-4 h-4" />
                            اختبار
                          </Button>
                          <Button 
                            onClick={() => handleToggleSource(source.id, source.isActive)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {source.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {source.isActive ? 'تعطيل' : 'تفعيل'}
                          </Button>
                          <Button 
                            onClick={() => handleDeleteSource(source.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة مصدر جديد
                </CardTitle>
                <CardDescription>
                  أضف مصدر أخبار جديد لجلب المقالات تلقائياً
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المصدر</label>
                    <Input
                      placeholder="مثال: TechCrunch"
                      value={newSource.name}
                      onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رابط الموقع</label>
                    <Input
                      placeholder="https://example.com"
                      value={newSource.url}
                      onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رابط RSS</label>
                    <Input
                      placeholder="https://example.com/feed"
                      value={newSource.rssUrl}
                      onChange={(e) => setNewSource({...newSource, rssUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الوصف</label>
                    <Input
                      placeholder="وصف قصير للمصدر"
                      value={newSource.description}
                      onChange={(e) => setNewSource({...newSource, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddSource}
                    disabled={!newSource.name || !newSource.url}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة المصدر
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المصادر</CardTitle>
                  <Feed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sources.length}</div>
                  <p className="text-xs text-muted-foreground">مصادر مسجلة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المصادر النشطة</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sources.filter(s => s.isActive).length}
                  </div>
                  <p className="text-xs text-muted-foreground">مصادر نشطة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المقالات</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sources.reduce((sum, source) => sum + source.articleCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">مقالات من جميع المصادر</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}