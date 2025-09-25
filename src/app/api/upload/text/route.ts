import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, content, source, category, url } = await request.json()

    // Validate required fields
    if (!title || !content || !source) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى والمصدر مطلوبة' },
        { status: 400 }
      )
    }

    // Check if article already exists
    const existingArticle = await db.newsArticle.findFirst({
      where: { 
        OR: [
          { title },
          { url: url || '' }
        ]
      }
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: 'المقال موجود بالفعل' },
        { status: 400 }
      )
    }

    // Get or create source
    let newsSource = await db.newsSource.findFirst({
      where: { name: source }
    })

    if (!newsSource) {
      newsSource = await db.newsSource.create({
        data: {
          name: source,
          url: url || `https://${source.toLowerCase().replace(' ', '')}.com`,
          description: `مصدر مضاف يدوياً`,
          isActive: true
        }
      })
    }

    // Get or create category
    const categoryName = category || 'تقنية'
    let newsCategory = await db.category.findFirst({
      where: { name: categoryName }
    })

    if (!newsCategory) {
      newsCategory = await db.category.create({
        data: {
          name: categoryName,
          description: `تصنيف مضاف يدوياً`
        }
      })
    }

    // Create article
    const article = await db.newsArticle.create({
      data: {
        title,
        content,
        url: url || `${newsSource.url}/article/${Date.now()}`,
        publishedAt: new Date(),
        sourceId: newsSource.id,
        categoryId: newsCategory.id,
        language: 'ar',
        isProcessed: false
      }
    })

    // Log the creation
    await db.processingLog.create({
      data: {
        action: 'text_upload',
        status: 'success',
        message: `Created article from text upload: ${title}`,
        metadata: JSON.stringify({
          articleId: article.id,
          title,
          source,
          category,
          contentLength: content.length
        })
      }
    })

    return NextResponse.json({
      message: 'تم إضافة المقال بنجاح',
      article: {
        id: article.id,
        title: article.title,
        source: newsSource.name,
        category: newsCategory.name,
        publishedAt: article.publishedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error in text upload:', error)
    
    // Log error
    await db.processingLog.create({
      data: {
        action: 'text_upload',
        status: 'error',
        message: `Failed to create article from text: ${error}`,
        metadata: JSON.stringify({
          title: request.body?.title,
          source: request.body?.source
        })
      }
    })

    return NextResponse.json(
      { error: 'فشل في إضافة المقال' },
      { status: 500 }
    )
  }
}