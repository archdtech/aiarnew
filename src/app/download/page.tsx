'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileArchive, Calendar, HardDrive, Code, Database, Zap } from 'lucide-react'

interface ProjectInfo {
  version: string
  size: string
  files: number
  created: string
  features: string[]
  techStack: string[]
}

export default function DownloadPage() {
  const [projectInfo] = useState<ProjectInfo>({
    version: 'v2.0.0',
    size: '443 KB',
    files: 50,
    created: '2025-09-14T15:11:17',
    features: [
      'AI-Powered Arabic Translation & Summarization',
      'Automated RSS Feed Processing',
      'Intelligent Tagging System',
      'Executive Dashboard',
      'Mobile-First Responsive Design',
      'Advanced Filtering & Search',
      'Real-time Automation',
      'Comprehensive Admin Panel'
    ],
    techStack: [
      'Next.js 15 with App Router',
      'TypeScript 5',
      'Tailwind CSS 4',
      'shadcn/ui Components',
      'Prisma ORM with SQLite',
      'Z-AI Web Dev SDK',
      'React 18',
      'Lucide Icons'
    ]
  })

  const [downloadCount, setDownloadCount] = useState(0)

  useEffect(() => {
    // Simulate download count
    const count = localStorage.getItem('downloadCount') || '0'
    setDownloadCount(parseInt(count as string))
  }, [])

  const handleDownload = () => {
    // Update download count
    const newCount = downloadCount + 1
    setDownloadCount(newCount)
    localStorage.setItem('downloadCount', newCount.toString())

    // Trigger download
    const link = document.createElement('a')
    link.href = '/arabic-tech-news-summarizer-v2.0.0-complete-2025-09-14T15-11-17.tar.gz'
    link.download = 'arabic-tech-news-summarizer-v2.0.0-complete-source.tar.gz'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ملخص التقنية</h1>
              <p className="text-gray-600 mt-1">تحميل المشروع الكامل - Arabic Tech News Summarizer</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {downloadCount} تحميل
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <FileArchive className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            تحميل المشروع الكامل
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على النسخة الكاملة من مشروع ملخص التقنية مع جميع الميزات المتقدمة والكود المصدري
          </p>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإصدار</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectInfo.version}</div>
              <p className="text-xs text-muted-foreground">أحدث إصدار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الحجم</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectInfo.size}</div>
              <p className="text-xs text-muted-foreground">مضغوط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الملفات</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectInfo.files}</div>
              <p className="text-xs text-muted-foreground">ملف مصدري</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آخر تحديث</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(projectInfo.created).toLocaleDateString('ar-SA')}
              </div>
              <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              الميزات المتقدمة
            </CardTitle>
            <CardDescription>
              جميع الميزات المتضمنة في المشروع الكامل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>تقنيات المشروع</CardTitle>
            <CardDescription>
              التقنيات والأدوات المستخدمة في تطوير المشروع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {projectInfo.techStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="justify-center p-2">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">تحميل المشروع</CardTitle>
            <CardDescription className="text-center">
              اضغط على الزر أدناه لتحميل النسخة الكاملة من المشروع
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={handleDownload}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Download className="w-5 h-5 ml-2" />
              تحميل المشروع الكامل
            </Button>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>اسم الملف: arabic-tech-news-summarizer-v2.0.0-complete-source.tar.gz</p>
              <p className="mt-1">الحجم: {projectInfo.size} | عدد الملفات: {projectInfo.files}</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">ملاحظات هامة:</h4>
              <ul className="text-sm text-blue-800 space-y-1 text-right">
                <li>• يتطلب Node.js 18+ و npm 8+ للتشغيل</li>
                <li>• يحتوي على جميع الملفات المصدري والاعتمادات</li>
                <li>• يتطلب إعداد متغيرات البيئة في ملف .env</li>
                <li>• يتطلب تشغيل npm install بعد فك الضغط</li>
                <li>• يحتوي على وثائق كاملة في ملف PRD.md</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>طريقة التشغيل</CardTitle>
            <CardDescription>
              خطوات بسيطة لتشغيل المشروع بعد التحميل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">فك ضغط الملف</h4>
                  <p className="text-gray-600 text-sm">استخدم الأمر التالي لفك ضغط الملف:</p>
                  <code className="block mt-1 p-2 bg-gray-800 text-white rounded text-sm">
                    tar -xzf arabic-tech-news-summarizer-v2.0.0-complete-source.tar.gz
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">الدخول إلى مجلد المشروع</h4>
                  <p className="text-gray-600 text-sm">انتقل إلى مجلد المشروع:</p>
                  <code className="block mt-1 p-2 bg-gray-800 text-white rounded text-sm">
                    cd arabic-tech-news-summarizer
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">تثبيت الاعتمادات</h4>
                  <p className="text-gray-600 text-sm">قم بتثبيت جميع الحزم المطلوبة:</p>
                  <code className="block mt-1 p-2 bg-gray-800 text-white rounded text-sm">
                    npm install
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">إعداد قاعدة البيانات</h4>
                  <p className="text-gray-600 text-sm">قم بتطبيق مخطط قاعدة البيانات:</p>
                  <code className="block mt-1 p-2 bg-gray-800 text-white rounded text-sm">
                    npm run db:push
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-semibold">تشغيل المشروع</h4>
                  <p className="text-gray-600 text-sm">ابدأ خادم التطوير:</p>
                  <code className="block mt-1 p-2 bg-gray-800 text-white rounded text-sm">
                    npm run dev
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>ملخص التقنية - مشروع مفتوح المصدر لخدمة الأخبار التقنية باللغة العربية</p>
            <p className="text-sm mt-2">تم تطويره باستخدام أحدث تقنيات الذكاء الاصطناعي وتطوير الويب</p>
          </div>
        </div>
      </footer>
    </div>
  )
}