import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
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

    const transformedSources = sources.map(source => ({
      id: source.id,
      name: source.name,
      url: source.url,
      description: source.description,
      isActive: source.isActive,
      articleCount: source._count.articles
    }))

    return NextResponse.json({
      sources: transformedSources
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
    const { name, url, rssUrl, description } = await request.json()

    if (!name || !url) {
      return NextResponse.json(
        { error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      )
    }

    // Check if source already exists
    const existingSource = await db.newsSource.findFirst({
      where: { name }
    })

    if (existingSource) {
      return NextResponse.json(
        { error: 'المصدر موجود بالفعل' },
        { status: 400 }
      )
    }

    const newSource = await db.newsSource.create({
      data: {
        name,
        url,
        rssUrl,
        description: description || `مصدر أخبار ${name}`
      }
    })

    return NextResponse.json({
      message: 'تم إضافة المصدر بنجاح',
      source: newSource
    })
  } catch (error) {
    console.error('Error creating source:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة المصدر' },
      { status: 500 }
    )
  }
}