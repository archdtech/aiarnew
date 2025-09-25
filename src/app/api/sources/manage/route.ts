import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Default RSS sources
const DEFAULT_SOURCES = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com',
    rssUrl: 'https://techcrunch.com/feed/',
    description: 'أحدث أخبار التقنية والشركات الناشئة',
    category: 'تقنية'
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com',
    rssUrl: 'https://www.wired.com/feed/rss',
    description: 'أخبار التقنية والثقافة الرقمية',
    category: 'تقنية'
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com',
    rssUrl: 'https://www.theverge.com/rss/index.xml',
    description: 'أخبار التقنية والمراجعات',
    category: 'تقنية'
  },
  {
    name: 'Ars Technica',
    url: 'https://arstechnica.com',
    rssUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    description: 'أخبار التقنية المتخصصة',
    category: 'تقنية'
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com',
    rssUrl: 'https://www.technologyreview.com/feed/',
    description: 'أخبار التقنية من معهد ماساتشوستس',
    category: 'ذكاء اصطناعي'
  },
  {
    name: 'VentureBeat',
    url: 'https://venturebeat.com',
    rssUrl: 'https://venturebeat.com/feed/',
    description: 'أخبار التقنية والأعمال',
    category: 'أعمال'
  },
  {
    name: 'ZDNet',
    url: 'https://www.zdnet.com',
    rssUrl: 'https://www.zdnet.com/news/rss.xml',
    description: 'أخبار التقنية وتحليلات',
    category: 'تقنية'
  },
  {
    name: 'Engadget',
    url: 'https://www.engadget.com',
    rssUrl: 'https://www.engadget.com/rss.xml',
    description: 'أخبار التقنية والأجهزة',
    category: 'تقنية'
  },
  {
    name: 'AI News',
    url: 'https://artificialintelligence-news.com',
    rssUrl: 'https://artificialintelligence-news.com/feed/',
    description: 'أخبار الذكاء الاصطناعي',
    category: 'ذكاء اصطناعي'
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com',
    rssUrl: 'https://towardsdatascience.com/feed',
    description: 'علم البيانات والتعلم الآلي',
    category: 'علم بيانات'
  }
]

export async function GET() {
  try {
    // Get all sources
    const sources = await db.newsSource.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                isProcessed: true,
                arabicSummary: {
                  isNot: null
                }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      sources: sources.map(source => ({
        id: source.id,
        name: source.name,
        url: source.url,
        rssUrl: source.rssUrl,
        description: source.description,
        isActive: source.isActive,
        articleCount: source._count.articles,
        createdAt: source.createdAt.toISOString(),
        updatedAt: source.updatedAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching sources:', error)
    return NextResponse.json(
      { error: 'فشل في جلب المصادر' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, source } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'الإجراء مطلوب' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'initialize':
        return await initializeSources()
      case 'add':
        return await addSource(source)
      case 'update':
        return await updateSource(source)
      case 'toggle':
        return await toggleSource(source.id)
      case 'delete':
        return await deleteSource(source.id)
      case 'test':
        return await testSource(source)
      default:
        return NextResponse.json(
          { error: 'إجراء غير صالح' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in sources management:', error)
    return NextResponse.json(
      { error: 'فشل في إدارة المصادر' },
      { status: 500 }
    )
  }
}

async function initializeSources() {
  try {
    let addedCount = 0
    let updatedCount = 0

    for (const sourceData of DEFAULT_SOURCES) {
      try {
        // Check if source exists
        const existingSource = await db.newsSource.findFirst({
          where: { name: sourceData.name }
        })

        if (existingSource) {
          // Update existing source
          await db.newsSource.update({
            where: { id: existingSource.id },
            data: {
              url: sourceData.url,
              rssUrl: sourceData.rssUrl,
              description: sourceData.description,
              isActive: true
            }
          })
          updatedCount++
        } else {
          // Create new source
          await db.newsSource.create({
            data: {
              name: sourceData.name,
              url: sourceData.url,
              rssUrl: sourceData.rssUrl,
              description: sourceData.description,
              isActive: true
            }
          })
          addedCount++
        }

        // Ensure category exists
        let category = await db.category.findFirst({
          where: { name: sourceData.category }
        })

        if (!category) {
          category = await db.category.create({
            data: {
              name: sourceData.category,
              description: `أخبار ${sourceData.category}`
            }
          })
        }
      } catch (error) {
        console.error(`Error processing source ${sourceData.name}:`, error)
      }
    }

    return NextResponse.json({
      message: 'تم تهيئة المصادر بنجاح',
      added: addedCount,
      updated: updatedCount,
      total: DEFAULT_SOURCES.length
    })
  } catch (error) {
    console.error('Error initializing sources:', error)
    return NextResponse.json(
      { error: 'فشل في تهيئة المصادر' },
      { status: 500 }
    )
  }
}

async function addSource(sourceData: any) {
  try {
    if (!sourceData.name || !sourceData.rssUrl) {
      return NextResponse.json(
        { error: 'اسم المصدر ورابط RSS مطلوبان' },
        { status: 400 }
      )
    }

    // Check if source already exists
    const existingSource = await db.newsSource.findFirst({
      where: {
        OR: [
          { name: sourceData.name },
          { rssUrl: sourceData.rssUrl }
        ]
      }
    })

    if (existingSource) {
      return NextResponse.json(
        { error: 'المصدر موجود بالفعل' },
        { status: 400 }
      )
    }

    // Create new source
    const newSource = await db.newsSource.create({
      data: {
        name: sourceData.name,
        url: sourceData.url || sourceData.rssUrl,
        rssUrl: sourceData.rssUrl,
        description: sourceData.description || `مصدر أخبار ${sourceData.name}`,
        isActive: sourceData.isActive !== false
      }
    })

    return NextResponse.json({
      message: 'تمت إضافة المصدر بنجاح',
      source: newSource
    })
  } catch (error) {
    console.error('Error adding source:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة المصدر' },
      { status: 500 }
    )
  }
}

async function updateSource(sourceData: any) {
  try {
    if (!sourceData.id) {
      return NextResponse.json(
        { error: 'معرّف المصدر مطلوب' },
        { status: 400 }
      )
    }

    const updatedSource = await db.newsSource.update({
      where: { id: sourceData.id },
      data: {
        name: sourceData.name,
        url: sourceData.url,
        rssUrl: sourceData.rssUrl,
        description: sourceData.description,
        isActive: sourceData.isActive
      }
    })

    return NextResponse.json({
      message: 'تم تحديث المصدر بنجاح',
      source: updatedSource
    })
  } catch (error) {
    console.error('Error updating source:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث المصدر' },
      { status: 500 }
    )
  }
}

async function toggleSource(sourceId: string) {
  try {
    const source = await db.newsSource.findUnique({
      where: { id: sourceId }
    })

    if (!source) {
      return NextResponse.json(
        { error: 'المصدر غير موجود' },
        { status: 404 }
      )
    }

    const updatedSource = await db.newsSource.update({
      where: { id: sourceId },
      data: { isActive: !source.isActive }
    })

    return NextResponse.json({
      message: `تم ${updatedSource.isActive ? 'تفعيل' : 'تعطيل'} المصدر بنجاح`,
      source: updatedSource
    })
  } catch (error) {
    console.error('Error toggling source:', error)
    return NextResponse.json(
      { error: 'فشل في تبديل حالة المصدر' },
      { status: 500 }
    )
  }
}

async function deleteSource(sourceId: string) {
  try {
    const source = await db.newsSource.findUnique({
      where: { id: sourceId }
    })

    if (!source) {
      return NextResponse.json(
        { error: 'المصدر غير موجود' },
        { status: 404 }
      )
    }

    await db.newsSource.delete({
      where: { id: sourceId }
    })

    return NextResponse.json({
      message: 'تم حذف المصدر بنجاح',
      source
    })
  } catch (error) {
    console.error('Error deleting source:', error)
    return NextResponse.json(
      { error: 'فشل في حذف المصدر' },
      { status: 500 }
    )
  }
}

async function testSource(sourceData: any) {
  try {
    if (!sourceData.rssUrl) {
      return NextResponse.json(
        { error: 'رابط RSS مطلوب' },
        { status: 400 }
      )
    }

    const response = await fetch(sourceData.rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TechNewsBot/1.0)'
      }
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `فشل في الاتصال: ${response.status} ${response.statusText}`,
        status: response.status
      })
    }

    const content = await response.text()
    
    // Simple RSS validation
    const hasRSS = content.includes('<rss') || content.includes('<feed')
    const hasItems = content.includes('<item') || content.includes('<entry')

    return NextResponse.json({
      success: true,
      message: 'RSS صالح',
      details: {
        hasRSS,
        hasItems,
        contentLength: content.length,
        status: response.status
      }
    })
  } catch (error) {
    console.error('Error testing source:', error)
    return NextResponse.json({
      success: false,
      error: `فشل في الاختبار: ${error}`
    })
  }
}