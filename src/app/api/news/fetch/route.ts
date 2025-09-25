import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// RSS feeds to fetch from
const RSS_FEEDS = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'تقنية'
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'تقنية'
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'تقنية'
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'تقنية'
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'ذكاء اصطناعي'
  }
]

export async function POST() {
  try {
    let fetchedCount = 0

    for (const feedSource of RSS_FEEDS) {
      try {
        // Get or create news source
        let source = await db.newsSource.findFirst({
          where: { name: feedSource.name }
        })

        if (!source) {
          source = await db.newsSource.create({
            data: {
              name: feedSource.name,
              url: `https://${feedSource.name.toLowerCase().replace(' ', '')}.com`,
              rssUrl: feedSource.url,
              description: `مصدر أخبار ${feedSource.name}`
            }
          })
        }

        // Fetch RSS feed
        const response = await fetch(feedSource.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TechNewsBot/1.0)'
          }
        })

        if (!response.ok) {
          console.error(`Failed to fetch RSS from ${feedSource.name}:`, response.statusText)
          continue
        }

        const rssText = await response.text()
        
        // Parse RSS (simple XML parsing)
        const items = parseRSS(rssText)
        
        for (const item of items) {
          try {
            // Check if article already exists
            const existingArticle = await db.newsArticle.findFirst({
              where: { url: item.link }
            })

            if (existingArticle) {
              continue
            }

            // Get or create category
            let category = await db.category.findFirst({
              where: { name: feedSource.category }
            })

            if (!category) {
              category = await db.category.create({
                data: {
                  name: feedSource.category,
                  description: `أخبار ${feedSource.category}`
                }
              })
            }

            // Create article
            const article = await db.newsArticle.create({
              data: {
                title: item.title,
                content: item.content || item.description || '',
                url: item.link,
                publishedAt: new Date(item.pubDate || Date.now()),
                sourceId: source.id,
                categoryId: category.id,
                imageUrl: item.imageUrl,
                language: 'en'
              }
            })

            fetchedCount++

            // Log the fetch
            await db.processingLog.create({
              data: {
                action: 'fetch',
                status: 'success',
                message: `Fetched article: ${item.title}`,
                metadata: JSON.stringify({
                  source: feedSource.name,
                  articleId: article.id
                })
              }
            })
          } catch (error) {
            console.error('Error processing article:', error)
            await db.processingLog.create({
              data: {
                action: 'fetch',
                status: 'error',
                message: `Failed to process article: ${error}`,
                metadata: JSON.stringify({
                  source: feedSource.name,
                  title: item.title
                })
              }
            })
          }
        }
      } catch (error) {
        console.error(`Error processing RSS feed ${feedSource.name}:`, error)
        await db.processingLog.create({
          data: {
            action: 'fetch',
            status: 'error',
            message: `Failed to process RSS feed: ${error}`,
            metadata: JSON.stringify({
              source: feedSource.name
            })
          }
        })
      }
    }

    return NextResponse.json({
      message: 'تم جلب الأخبار بنجاح',
      fetchedCount,
      sources: RSS_FEEDS.length
    })
  } catch (error) {
    console.error('Error in fetch news:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الأخبار' },
      { status: 500 }
    )
  }
}

// Simple RSS parser
function parseRSS(rssText: string) {
  const items: any[] = []
  
  try {
    // Extract items from RSS
    const itemRegex = /<item>(.*?)<\/item>/gs
    const itemMatches = rssText.match(itemRegex)
    
    if (itemMatches) {
      for (const itemMatch of itemMatches) {
        const titleMatch = itemMatch.match(/<title>(.*?)<\/title>/s)
        const linkMatch = itemMatch.match(/<link>(.*?)<\/link>/s)
        const pubDateMatch = itemMatch.match(/<pubDate>(.*?)<\/pubDate>/s)
        const descriptionMatch = itemMatch.match(/<description>(.*?)<\/description>/s)
        const contentMatch = itemMatch.match(/<content:encoded>(.*?)<\/content:encoded>/s)
        const imageMatch = itemMatch.match(/<media:thumbnail url="(.*?)"/s) || 
                          itemMatch.match(/<enclosure url="(.*?)" type="image\/.*?"/s)

        if (titleMatch && linkMatch) {
          items.push({
            title: titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim(),
            link: linkMatch[1].trim(),
            pubDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString(),
            description: descriptionMatch ? descriptionMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').replace(/<[^>]*>/g, '').trim() : '',
            content: contentMatch ? contentMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').replace(/<[^>]*>/g, '').trim() : '',
            imageUrl: imageMatch ? imageMatch[1].trim() : null
          })
        }
      }
    }
  } catch (error) {
    console.error('Error parsing RSS:', error)
  }

  return items
}