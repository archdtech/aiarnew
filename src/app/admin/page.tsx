'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Database, 
  FileText, 
  Tag, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Zap
} from 'lucide-react'

interface AutomationStatus {
  status: string
  lastChecked: string
  todayLogs: number
  totalArticles: number
  automation: {
    fetch: number
    summarize: number
    tag: number
  }
}

interface ProcessingLog {
  id: string
  action: string
  status: string
  message: string
  metadata: any
  createdAt: string
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<AutomationStatus | null>(null)
  const [logs, setLogs] = useState<ProcessingLog[]>([])
  const [loading, setLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  useEffect(() => {
    fetchStatus()
    fetchLogs()
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/automation')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/automation/logs?limit=50')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const runAutomation = async (action: string) => {
    setLoading(true)
    setLastAction(action)
    
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Automation result:', result)
        
        // Refresh status and logs
        setTimeout(() => {
          fetchStatus()
          fetchLogs()
        }, 2000)
      }
    } catch (error) {
      console.error('Error running automation:', error)
    } finally {
      setLoading(false)
      setTimeout(() => setLastAction(null), 3000)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'fetch':
        return <Database className="w-4 h-4" />
      case 'summarize':
        return <FileText className="w-4 h-4" />
      case 'tag':
        return <Tag className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActionName = (action: string) => {
    switch (action) {
      case 'fetch':
        return 'جلب الأخبار'
      case 'summarize':
        return 'تلخيص الأخبار'
      case 'tag':
        return 'تصنيف الأخبار'
      default:
        return action
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">لوحة التحكم</h1>
              <p className="text-muted-foreground mt-1">إدارة وتحكم في نظام تلخيص الأخبار التقنية</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {status?.status === 'running' ? 'يعمل' : 'متوقف'}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المقالات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status?.totalArticles || 0}</div>
              <p className="text-xs text-muted-foreground">مقالات معالجة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عمليات اليوم</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status?.todayLogs || 0}</div>
              <p className="text-xs text-muted-foreground">عملية منجزة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">جلب الأخبار</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status?.automation.fetch || 0}</div>
              <p className="text-xs text-muted-foreground">عملية جلب</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آخر تحديث</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {status?.lastChecked ? new Date(status.lastChecked).toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '--:--'}
              </div>
              <p className="text-xs text-muted-foreground">آخر فحص</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              لوحة التحكم بالأتمتة
            </CardTitle>
            <CardDescription>
              تشغيل العمليات التلقائية لجلب وتلخيص وتصنيف الأخبار
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => runAutomation('fetch')}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                جلب الأخبار
                {loading && lastAction === 'fetch' && <RefreshCw className="w-4 h-4 animate-spin" />}
              </Button>
              
              <Button 
                onClick={() => runAutomation('summarize')}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                تلخيص الأخبار
                {loading && lastAction === 'summarize' && <RefreshCw className="w-4 h-4 animate-spin" />}
              </Button>
              
              <Button 
                onClick={() => runAutomation('tag')}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                تصنيف الأخبار
                {loading && lastAction === 'tag' && <RefreshCw className="w-4 h-4 animate-spin" />}
              </Button>
              
              <Button 
                onClick={() => runAutomation('full')}
                disabled={loading}
                variant="default"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                تشغيل الكل
                {loading && lastAction === 'full' && <RefreshCw className="w-4 h-4 animate-spin" />}
              </Button>
              
              <Button 
                onClick={() => {
                  fetchStatus()
                  fetchLogs()
                }}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs and Activity */}
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">سجل العمليات</TabsTrigger>
            <TabsTrigger value="stats">إحصائيات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>سجل العمليات الحديث</CardTitle>
                <CardDescription>
                  آخر 50 عملية تم تنفيذها في النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد عمليات مسجلة
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getStatusIcon(log.status)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{getActionName(log.action)}</span>
                            <Badge variant="secondary" className={getStatusColor(log.status)}>
                              {log.status === 'success' ? 'نجح' : log.status === 'error' ? 'فشل' : 'قيد الانتظار'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(log.createdAt).toLocaleString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات النظام</CardTitle>
                <CardDescription>
                  نظرة عامة على أداء النظام والعمليات المنجزة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {logs.filter(log => log.status === 'success').length}
                    </div>
                    <p className="text-sm text-muted-foreground">عمليات ناجحة</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {logs.filter(log => log.status === 'error').length}
                    </div>
                    <p className="text-sm text-muted-foreground">عمليات فاشلة</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {logs.filter(log => log.action === 'fetch').length}
                    </div>
                    <p className="text-sm text-muted-foreground">عمليات جلب</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">توزيع العمليات</h4>
                  <div className="space-y-2">
                    {['fetch', 'summarize', 'tag'].map((action) => {
                      const actionLogs = logs.filter(log => log.action === action)
                      const successCount = actionLogs.filter(log => log.status === 'success').length
                      const totalCount = actionLogs.length
                      
                      return (
                        <div key={action} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getActionIcon(action)}
                            <span className="text-sm">{getActionName(action)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {successCount}/{totalCount}
                            </span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: totalCount > 0 ? `${(successCount / totalCount) * 100}%` : '0%' }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
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