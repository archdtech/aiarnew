import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get overview statistics
    const [totalArticles, totalSources, recentArticles] = await Promise.all([
      db.newsArticle.count({
        where: {
          createdAt: {
            gte: startDate
          },
          isProcessed: true,
          arabicSummary: {
            isNot: null
          }
        }
      }),
      db.newsSource.count({
        where: {
          isActive: true
        }
      }),
      db.newsArticle.findMany({
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) // Today
          },
          isProcessed: true,
          arabicSummary: {
            isNot: null
          }
        }
      })
    ])

    // Get top articles by views (mock data for now)
    const topArticles = await db.newsArticle.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        isProcessed: true,
        arabicSummary: {
          isNot: null
        }
      },
      include: {
        source: true,
        category: true
      },
      orderBy: {
        views: 'desc'
      },
      take: 10
    })

    // Get top sources by article count
    const topSources = await db.newsSource.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                createdAt: {
                  gte: startDate
                },
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
        articles: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Get category statistics
    const categoryStats = await db.category.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                createdAt: {
                  gte: startDate
                },
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
        articles: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Get tag statistics
    const tagStats = await db.tag.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                article: {
                  createdAt: {
                    gte: startDate
                  },
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
        articles: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Generate timeline data
    const timeline = []
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)
      
      const [articles, sources] = await Promise.all([
        db.newsArticle.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            },
            isProcessed: true,
            arabicSummary: {
              isNot: null
            }
          }
        }),
        db.newsSource.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            },
            isActive: true
          }
        })
      ])
      
      timeline.push({
        date: date.toISOString().split('T')[0],
        articles,
        views: Math.floor(Math.random() * 1000) + 500, // Mock views data
        sources
      })
    }

    // Calculate total views (mock data)
    const totalViews = topArticles.reduce((sum, article) => sum + (article.views || 0), 0)

    // Calculate category percentages
    const totalCategoryArticles = categoryStats.reduce((sum, cat) => sum + cat._count.articles, 0)

    const analytics = {
      overview: {
        totalArticles,
        totalViews,
        totalSources,
        avgProcessingTime: 2.4, // Mock data
        todayArticles: recentArticles.length,
        todayViews: Math.floor(totalViews / days), // Average daily views
        weeklyGrowth: 12.5, // Mock growth percentage
        monthlyGrowth: 34.8 // Mock growth percentage
      },
      topArticles: topArticles.map(article => ({
        id: article.id,
        title: article.title,
        views: article.views || Math.floor(Math.random() * 3000) + 500,
        category: article.category?.name || 'غير مصنف',
        publishedAt: article.publishedAt.toISOString().split('T')[0],
        source: article.source.name
      })),
      topSources: topSources.map(source => ({
        id: source.id,
        name: source.name,
        articleCount: source._count.articles,
        totalViews: Math.floor(Math.random() * 15000) + 1000,
        avgViewsPerArticle: Math.floor((source._count.articles * 75) / source._count.articles) || 75,
        lastUpdated: new Date().toISOString().split('T')[0]
      })),
      categoryStats: categoryStats.map(category => ({
        name: category.name,
        count: category._count.articles,
        percentage: totalCategoryArticles > 0 ? (category._count.articles / totalCategoryArticles) * 100 : 0,
        views: Math.floor(Math.random() * 20000) + 5000,
        growth: Math.random() * 20 - 5 // Random growth between -5% and +15%
      })),
      tagStats: tagStats.map(tag => ({
        name: tag.name,
        count: tag._count.articles,
        articles: tag._count.articles,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable'
      })),
      engagement: {
        avgReadTime: 4.2,
        bounceRate: 32.5,
        returnVisitors: Math.floor(Math.random() * 2000) + 500,
        popularCategories: categoryStats.slice(0, 3).map(cat => cat.name)
      },
      timeline
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'فشل في جلب البيانات التحليلية' },
      { status: 500 }
    )
  }
}