import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { rssUrl } = await request.json()

    if (!rssUrl) {
      return NextResponse.json(
        { error: 'رابط RSS مطلوب' },
        { status: 400 }
      )
    }

    // Test RSS feed
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TechNewsBot/1.0)'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'فشل في الوصول إلى رابط RSS' },
        { status: 400 }
      )
    }

    const rssText = await response.text()

    // Parse RSS and count items
    const itemRegex = /<item>(.*?)<\/item>/gs
    const itemMatches = rssText.match(itemRegex)
    const itemCount = itemMatches ? itemMatches.length : 0

    // Extract some sample items
    const sampleItems = []
    if (itemMatches) {
      for (let i = 0; i < Math.min(3, itemMatches.length); i++) {
        const itemMatch = itemMatches[i]
        const titleMatch = itemMatch.match(/<title>(.*?)<\/title>/s)
        const linkMatch = itemMatch.match(/<link>(.*?)<\/link>/s)
        
        if (titleMatch && linkMatch) {
          sampleItems.push({
            title: titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim(),
            link: linkMatch[1].trim()
          })
        }
      }
    }

    return NextResponse.json({
      message: 'RSS Feed صالح',
      itemCount,
      sampleItems,
      feedSize: rssText.length
    })
  } catch (error) {
    console.error('Error testing RSS:', error)
    return NextResponse.json(
      { error: 'فشل في اختبار RSS Feed' },
      { status: 500 }
    )
  }
}