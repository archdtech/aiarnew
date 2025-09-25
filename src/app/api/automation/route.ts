import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'الإجراء مطلوب' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'fetch':
        result = await fetchNews()
        break
      case 'summarize':
        result = await summarizeNews()
        break
      case 'tag':
        result = await tagNews()
        break
      case 'full':
        result = await runFullAutomation()
        break
      default:
        return NextResponse.json(
          { error: 'إجراء غير صالح' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in automation:', error)
    return NextResponse.json(
      { error: 'فشل في تنفيذ الأتمتة' },
      { status: 500 }
    )
  }
}

async function fetchNews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/news/fetch`, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('فشل في جلب الأخبار')
    }

    const data = await response.json()
    return {
      action: 'fetch',
      success: true,
      message: data.message,
      data: {
        fetchedCount: data.fetchedCount,
        sources: data.sources
      }
    }
  } catch (error) {
    console.error('Error in fetch news:', error)
    return {
      action: 'fetch',
      success: false,
      error: error.message
    }
  }
}

async function summarizeNews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/news/summarize`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('فشل في تلخيص الأخبار')
    }

    const data = await response.json()
    return {
      action: 'summarize',
      success: true,
      message: data.message,
      data: {
        processed: data.processed,
        total: data.total
      }
    }
  } catch (error) {
    console.error('Error in summarize news:', error)
    return {
      action: 'summarize',
      success: false,
      error: error.message
    }
  }
}

async function tagNews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/news/tag`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('فشل في تصنيف الأخبار')
    }

    const data = await response.json()
    return {
      action: 'tag',
      success: true,
      message: data.message,
      data: {
        processed: data.processed,
        total: data.total
      }
    }
  } catch (error) {
    console.error('Error in tag news:', error)
    return {
      action: 'tag',
      success: false,
      error: error.message
    }
  }
}

async function runFullAutomation() {
  const results = {
    fetch: null,
    summarize: null,
    tag: null,
    summary: {}
  }

  try {
    // Step 1: Fetch news
    console.log('Starting news fetch...')
    results.fetch = await fetchNews()
    
    if (results.fetch.success) {
      results.summary.fetched = results.fetch.data.fetchedCount
    }

    // Wait a bit between steps
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 2: Summarize news
    console.log('Starting news summarization...')
    results.summarize = await summarizeNews()
    
    if (results.summarize.success) {
      results.summary.summarized = results.summarize.data.processed
    }

    // Wait a bit between steps
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 3: Tag news
    console.log('Starting news tagging...')
    results.tag = await tagNews()
    
    if (results.tag.success) {
      results.summary.tagged = results.tag.data.processed
    }

    return {
      action: 'full',
      success: true,
      message: 'اكتملت الأتمتة بنجاح',
      results,
      summary: results.summary
    }
  } catch (error) {
    console.error('Error in full automation:', error)
    return {
      action: 'full',
      success: false,
      error: error.message,
      results
    }
  }
}

// GET endpoint for status check
export async function GET() {
  try {
    // Get automation status from processing logs
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    
    // Get today's processing logs
    const logsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/automation/logs?date=${today.toISOString().split('T')[0]}`)
    const logsData = logsResponse.ok ? await logsResponse.json() : { logs: [] }
    
    // Get current statistics
    const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/news?limit=1`)
    const newsData = newsResponse.ok ? await newsResponse.json() : { pagination: { total: 0 } }
    
    return NextResponse.json({
      status: 'running',
      lastChecked: new Date().toISOString(),
      todayLogs: logsData.logs.length,
      totalArticles: newsData.pagination.total,
      automation: {
        fetch: logsData.logs.filter(log => log.action === 'fetch' && log.status === 'success').length,
        summarize: logsData.logs.filter(log => log.action === 'summarize' && log.status === 'success').length,
        tag: logsData.logs.filter(log => log.action === 'tag' && log.status === 'success').length
      }
    })
  } catch (error) {
    console.error('Error getting automation status:', error)
    return NextResponse.json(
      { error: 'فشل في جلب حالة الأتمتة' },
      { status: 500 }
    )
  }
}