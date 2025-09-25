import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
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

    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      articleCount: category._count.articles
    }))

    return NextResponse.json({
      categories: transformedCategories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'فشل في جلب التصنيفات' },
      { status: 500 }
    )
  }
}