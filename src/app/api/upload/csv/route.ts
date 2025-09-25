import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'الملف مطلوب' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'يجب أن يكون الملف بتنسيق CSV' },
        { status: 400 }
      )
    }

    // Read file content
    const csvText = await file.text()
    
    // Parse CSV
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'الملف فارغ أو غير صالح' },
        { status: 400 }
      )
    }

    // Get headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    // Validate required headers
    const requiredHeaders = ['title', 'content', 'source']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `الأعمدة المطلوبة مفقودة: ${missingHeaders.join(', ')}` },
        { status: 400 }
      )
    }

    // Process articles
    const articles = []
    let processedCount = 0
    let errorCount = 0

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length < headers.length) continue

        const article: any = {}
        headers.forEach((header, index) => {
          article[header] = values[index] || ''
        })

        // Validate required fields
        if (!article.title || !article.content || !article.source) {
          errorCount++
          continue
        }

        // Check if article already exists
        const existingArticle = await db.newsArticle.findFirst({
          where: { 
            OR: [
              { title: article.title },
              { url: article.url || '' }
            ]
          }
        })

        if (existingArticle) {
          continue
        }

        // Get or create source
        let source = await db.newsSource.findFirst({
          where: { name: article.source }
        })

        if (!source) {
          source = await db.newsSource.create({
            data: {
              name: article.source,
              url: article.url || `https://${article.source.toLowerCase().replace(' ', '')}.com`,
              description: `مصدر مستورد من CSV`,
              isActive: true
            }
          })
        }

        // Get or create category
        const categoryName = article.category || 'تقنية'
        let category = await db.category.findFirst({
          where: { name: categoryName }
        })

        if (!category) {
          category = await db.category.create({
            data: {
              name: categoryName,
              description: `تصنيف مستورد من CSV`
            }
          })
        }

        // Create article
        const newArticle = await db.newsArticle.create({
          data: {
            title: article.title,
            content: article.content,
            url: article.url || `${source.url}/article/${Date.now()}`,
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
            sourceId: source.id,
            categoryId: category.id,
            language: 'ar',
            isProcessed: false
          }
        })

        articles.push(newArticle)
        processedCount++

      } catch (error) {
        console.error(`Error processing line ${i}:`, error)
        errorCount++
      }
    }

    // Log the import
    await db.processingLog.create({
      data: {
        action: 'csv_import',
        status: 'success',
        message: `Imported ${processedCount} articles from CSV`,
        metadata: JSON.stringify({
          fileName: file.name,
          totalLines: lines.length - 1,
          processedCount,
          errorCount
        })
      }
    })

    return NextResponse.json({
      message: 'تم استيراد المقالات بنجاح',
      processedCount,
      errorCount,
      totalArticles: articles.length
    })

  } catch (error) {
    console.error('Error in CSV upload:', error)
    
    // Log error
    await db.processingLog.create({
      data: {
        action: 'csv_import',
        status: 'error',
        message: `Failed to import CSV: ${error}`,
        metadata: JSON.stringify({
          fileName: (request.formData?.get('file') as File)?.name
        })
      }
    })

    return NextResponse.json(
      { error: 'فشل في استيراد الملف' },
      { status: 500 }
    )
  }
}