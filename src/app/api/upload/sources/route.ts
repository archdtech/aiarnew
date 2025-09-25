import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    const requiredHeaders = ['name', 'url', 'rssUrl']
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `الأعمدة المطلوبة مفقودة: ${missingHeaders.join(', ')}` },
        { status: 400 }
      )
    }

    // Process sources
    const sources = []
    let processedCount = 0
    let errorCount = 0

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length < headers.length) continue

        const sourceData: any = {}
        headers.forEach((header, index) => {
          sourceData[header] = values[index] || ''
        })

        // Validate required fields
        if (!sourceData.name || !sourceData.url || !sourceData.rssUrl) {
          errorCount++
          continue
        }

        // Check if source already exists
        const existingSource = await db.newsSource.findFirst({
          where: { 
            OR: [
              { name: sourceData.name },
              { url: sourceData.url },
              { rssUrl: sourceData.rssUrl }
            ]
          }
        })

        if (existingSource) {
          continue
        }

        // Test RSS feed
        try {
          const rssResponse = await fetch(sourceData.rssUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; TechNewsBot/1.0)'
            }
          })

          if (!rssResponse.ok) {
            errorCount++
            continue
          }

          const rssText = await rssResponse.text()
          
          // Simple RSS validation
          if (!rssText.includes('<rss') && !rssText.includes('<feed')) {
            errorCount++
            continue
          }
        } catch (error) {
          errorCount++
          continue
        }

        // Create source
        const newSource = await db.newsSource.create({
          data: {
            name: sourceData.name,
            url: sourceData.url,
            rssUrl: sourceData.rssUrl,
            description: sourceData.description || `مصدر مستورد من CSV`,
            isActive: true
          }
        })

        sources.push(newSource)
        processedCount++

      } catch (error) {
        console.error(`Error processing line ${i}:`, error)
        errorCount++
      }
    }

    // Log the import
    await db.processingLog.create({
      data: {
        action: 'sources_import',
        status: 'success',
        message: `Imported ${processedCount} sources from CSV`,
        metadata: JSON.stringify({
          fileName: file.name,
          totalLines: lines.length - 1,
          processedCount,
          errorCount
        })
      }
    })

    return NextResponse.json({
      message: 'تم استيراد المصادر بنجاح',
      processedCount,
      errorCount,
      totalSources: sources.length
    })

  } catch (error) {
    console.error('Error in sources CSV upload:', error)
    
    // Log error
    await db.processingLog.create({
      data: {
        action: 'sources_import',
        status: 'error',
        message: `Failed to import sources CSV: ${error}`,
        metadata: JSON.stringify({
          fileName: (request.formData?.get('file') as File)?.name
        })
      }
    })

    return NextResponse.json(
      { error: 'فشل في استيراد المصادر' },
      { status: 500 }
    )
  }
}