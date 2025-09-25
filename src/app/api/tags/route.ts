import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                article: {
                  isProcessed: true,
                  arabicSummary: {
                    isNot: null
                  }
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

    const transformedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      articleCount: tag._count.articles
    }))

    return NextResponse.json({
      tags: transformedTags
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الوسوم' },
      { status: 500 }
    )
  }
}