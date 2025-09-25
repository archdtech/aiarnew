'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Package, 
  FileText, 
  HardDrive, 
  Clock, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Code,
  Database,
  Zap
} from 'lucide-react'

interface DownloadOptions {
  includeNodeModules: boolean
  includeDocumentation: boolean
  includeEnvironment: boolean
}

interface ProjectStats {
  totalFiles: number
  totalSize: string
  lastUpdated: string
  technologies: string[]
}

export default function SourceCodeDownloader() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'preparing' | 'downloading' | 'completed' | 'error'>('idle')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [options, setOptions] = useState<DownloadOptions>({
    includeNodeModules: false,
    includeDocumentation: true,
    includeEnvironment: false
  })

  // Mock project statistics
  const projectStats: ProjectStats = {
    totalFiles: 156,
    totalSize: '2.4 MB',
    lastUpdated: new Date().toLocaleDateString('ar-SA'),
    technologies: [
      'Next.js 15', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 
      'Prisma', 'SQLite', 'z-ai-web-dev-sdk', 'Lucide React'
    ]
  }

  const handleDownload = async (customOptions?: Partial<DownloadOptions>) => {
    try {
      console.log('🚀 Starting download process...')
      setIsDownloading(true)
      setDownloadStatus('preparing')
      setDownloadProgress(0)

      // Simulate preparation time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDownloadStatus('downloading')
      
      // Determine download type
      const downloadOptions = { ...options, ...customOptions }
      console.log('📋 Download options:', downloadOptions)
      
      let url = '/api/download'
      let response: Response
      
      if (downloadOptions.includeNodeModules) {
        // Use POST endpoint for custom options
        console.log('📦 Using POST endpoint for full download...')
        response = await fetch('/api/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            includeNodeModules: downloadOptions.includeNodeModules,
            customFiles: downloadOptions.includeDocumentation ? ['README.md', 'package.json'] : []
          })
        })
      } else {
        // Use GET endpoint for standard download
        console.log('📦 Using GET endpoint for standard download...')
        response = await fetch('/api/download')
      }

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Download failed:', response.status, errorText)
        throw new Error(`Download failed: ${response.status} ${errorText}`)
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/["']/g, '') || 'source-code.zip'
        : 'arabic-tech-news-summarizer.zip'

      console.log('📄 Filename:', filename)

      // Get additional info from headers
      const filesCount = response.headers.get('X-Content-Files-Count')
      const totalSize = response.headers.get('X-Content-Total-Size')
      const zipSize = response.headers.get('X-Zip-Size')

      console.log(`📊 Download info: ${filesCount} files, total size: ${totalSize}, zip size: ${zipSize}`)

      // Create blob and download
      console.log('🔄 Creating blob...')
      const blob = await response.blob()
      console.log(`✅ Blob created, size: ${blob.size} bytes`)
      
      setDownloadProgress(95)
      
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      
      console.log('🖱️ Triggering download...')
      // Trigger download
      link.click()
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        console.log('🧹 Cleanup completed')
      }, 100)

      setDownloadProgress(100)
      setDownloadStatus('completed')
      console.log('✅ Download completed successfully!')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle')
        setDownloadProgress(0)
      }, 3000)

    } catch (error) {
      console.error('❌ Download error:', error)
      setDownloadStatus('error')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle')
        setDownloadProgress(0)
      }, 3000)
    } finally {
      setIsDownloading(false)
    }
  }

  const getStatusIcon = () => {
    switch (downloadStatus) {
      case 'preparing':
        return <Package className="w-4 h-4 animate-pulse" />
      case 'downloading':
        return <Download className="w-4 h-4 animate-bounce" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Download className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (downloadStatus) {
      case 'preparing':
        return 'جاري تحضير الملفات...'
      case 'downloading':
        return `جاري التنزيل... ${Math.round(downloadProgress)}%`
      case 'completed':
        return 'تم التنزيل بنجاح!'
      case 'error':
        return 'فشل التنزيل'
      default:
        return 'تحميل الكود المصدري'
    }
  }

  const getDownloadButtonVariant = () => {
    switch (downloadStatus) {
      case 'completed':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6" dir="rtl">
      <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            تحميل الكود المصدري للمشروع
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            قم بتنزيل كود المشروع الكامل مع جميع الملفات والمكونات
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Project Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{projectStats.totalFiles}</div>
              <div className="text-sm text-blue-700">ملف</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <HardDrive className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{projectStats.totalSize}</div>
              <div className="text-sm text-green-700">الحجم</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-purple-600">{projectStats.lastUpdated}</div>
              <div className="text-sm text-purple-700">آخر تحديث</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{projectStats.technologies.length}</div>
              <div className="text-sm text-orange-700">تقنية</div>
            </div>
          </div>

          {/* Technologies Stack */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Database className="w-5 h-5" />
              التقنيات المستخدمة
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectStats.technologies.map(tech => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                خيارات التنزيل
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'إخفاء' : 'عرض'} الخيارات المتقدمة
              </Button>
            </div>

            {/* Quick Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleDownload()}
                disabled={isDownloading}
                className="flex-1 h-12 text-lg"
                variant={getDownloadButtonVariant()}
              >
                {getStatusIcon()}
                <span className="mr-2">{getStatusText()}</span>
                {isDownloading && downloadStatus === 'downloading' && (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                )}
              </Button>

              <Button
                onClick={() => handleDownload({ includeNodeModules: true })}
                disabled={isDownloading}
                variant="outline"
                className="flex-1 h-12"
              >
                <Package className="w-4 h-4 mr-2" />
                تحميل مع node_modules
              </Button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <Card className="bg-gray-50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">تضمين node_modules</span>
                    <input
                      type="checkbox"
                      checked={options.includeNodeModules}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeNodeModules: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">تضمين الملفات التوثيقية</span>
                    <input
                      type="checkbox"
                      checked={options.includeDocumentation}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeDocumentation: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">تضمين ملفات البيئة</span>
                    <input
                      type="checkbox"
                      checked={options.includeEnvironment}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeEnvironment: e.target.checked }))}
                      className="rounded"
                    />
                  </div>

                  <Button
                    onClick={() => handleDownload(options)}
                    disabled={isDownloading}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    تنزيل مخصص
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Progress Bar */}
          {downloadStatus === 'downloading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري إنشاء أرشيف ZIP...</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">معلومات مهمة:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• الملف المضغوط يحتوي على جميع ملفات المشروع الأساسية</li>
                  <li>• يتم استبعاد الملفات المؤقتة وملفات النظام تلقائياً</li>
                  <li>• حجم الملف يعتمد على الخيارات المختارة</li>
                  <li>• يدعم المتصفحات الحديثة عملية التنزيل المباشر</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}