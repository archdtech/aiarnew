import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isProcessed: true,
      arabicSummary: {
        isNot: null
      }
    }

    if (category && category !== 'all') {
      where.category = {
        name: category
      }
    }

    if (tag && tag !== 'all') {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      }
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          summary: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          arabicSummary: {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          arabicSummary: {
            content: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Get articles with their summaries
    const articles = await db.newsArticle.findMany({
      where,
      include: {
        source: true,
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        arabicSummary: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await db.newsArticle.count({ where })

    // Transform the response
    const transformedArticles = articles.map(article => ({
      id: article.id,
      title: article.arabicSummary?.title || article.title,
      summary: article.arabicSummary?.content || article.summary || '',
      fullContent: article.content,
      source: article.source.name,
      publishedAt: article.publishedAt.toISOString().split('T')[0],
      tags: article.tags.map(t => t.tag.name),
      category: article.category?.name || 'غير مصنف',
      originalUrl: article.url,
      isFeatured: article.isFeatured,
      confidence: article.arabicSummary?.confidence,
      wordCount: article.arabicSummary?.wordCount
    }))

    return NextResponse.json({
      articles: transformedArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الأخبار' },
      { status: 500 }
    )
  }
}