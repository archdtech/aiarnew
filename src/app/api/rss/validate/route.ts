import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'رابط RSS مطلوب' },
        { status: 400 }
      )
    }

    // Initialize ZAI
    const zai = await ZAI.create()

    // First, try to fetch the RSS feed
    const fetchResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TechNewsBot/1.0)'
      }
    })

    if (!fetchResponse.ok) {
      return NextResponse.json(
        { error: 'فشل في جلب مصدر RSS' },
        { status: 400 }
      )
    }

    const rssContent = await fetchResponse.text()

    // Analyze RSS content with AI
    const analysisPrompt = `
    قم بتحليل مصدر RSS التالي وتقييمه كخبر في مجال التقنية والذكاء الاصطناعي.
    
    رابط RSS: ${url}
    محتوى RSS (أول 2000 حرف): ${rssContent.substring(0, 2000)}
    
    قدم تحليلاً شاملاً يشمل:
    
    1. صحة مصدر RSS:
       - هل هو مصدر RSS صالح؟
       - هل يحتوي على بنية XML صحيحة؟
       - هل يحتوي على عناصر <item>؟
    
    2. جودة المحتوى:
       - ما هو نوع المحتوى الرئيسي؟ (أخبار تقنية، ذكاء اصطناعي، تطوير، إلخ)
       - هل المحتوى مناسب للمتخصصين واصحاب القرار؟
       - ما هي جودة العناوين والأوصاف؟
    
    3. التحديث والانتظام:
       - ما هو تاريخ آخر تحديث؟
       - هل هناك إشارة إلى انتظام النشر؟
       - كم عدد المقالات المتاحة؟
    
    4. المصداقية والموثوقية:
       - هل المصدر معروف وموثوق؟
       - هل هناك إشارة إلى المؤلفين أو المحررين؟
       - هل المحتوى يبدو احترافياً؟
    
    5. التخصص والتركيز:
       - ما هي المجالات التقنية التي يركز عليها المصدر؟
       - هل هناك تركيز على مجالات محددة مثل الذكاء الاصطناعي، الأمن السيبراني، إلخ؟
       - هل المحتوى متخصص أم عام؟
    
    6. التوصية:
       - هل توصي بإضافة هذا المصدر إلى نظام تلخيص الأخبار؟
       - ما هي الفئة المناسبة لهذا المصدر؟
       - ما هي الوسوم المناسبة؟
    
    قدم الإجابة في تنسيق JSON كالتالي:
    {
      "isValid": true/false,
      "qualityScore": 0.0-1.0,
      "contentTypes": ["نوع المحتوى"],
      "updateFrequency": "description",
      "credibility": "high/medium/low",
      "specialization": ["مجالات التخصص"],
      "recommendation": "recommended/not_recommended",
      "category": "التصنيف المقترح",
      "suggestedTags": ["وسوم مقترحة"],
      "reasoning": "شرح مفصل للتحليل"
    }
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في تحليل مصادر RSS وتقييم جودتها للمحتوى التقني والعربي. متخصص في تحديد المصادر الموثوقة والمناسبة للمتخصصين واصحاب القرار.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const analysisContent = completion.choices[0]?.message?.content

    if (!analysisContent) {
      throw new Error('فشل في تحليل مصدر RSS')
    }

    // Parse JSON response
    let analysisResult
    try {
      // Extract JSON from the response
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('لم يتم العثور على JSON في الرد')
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return NextResponse.json(
        { error: 'فشل في تحليل نتائج التقييم' },
        { status: 500 }
      )
    }

    // Parse RSS to get additional info
    const rssInfo = parseRSSBasicInfo(rssContent)

    return NextResponse.json({
      message: 'تم تقييم مصدر RSS بنجاح',
      url,
      analysis: analysisResult,
      rssInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in RSS validation:', error)
    return NextResponse.json(
      { error: 'فشل في تقييم مصدر RSS' },
      { status: 500 }
    )
  }
}

// Basic RSS parsing to extract title, description, etc.
function parseRSSBasicInfo(rssContent: string) {
  const info: any = {
    title: '',
    description: '',
    link: '',
    language: '',
    lastBuildDate: '',
    itemCount: 0
  }

  try {
    // Extract channel info
    const titleMatch = rssContent.match(/<title>(.*?)<\/title>/s)
    if (titleMatch) {
      info.title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim()
    }

    const descriptionMatch = rssContent.match(/<description>(.*?)<\/description>/s)
    if (descriptionMatch) {
      info.description = descriptionMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').replace(/<[^>]*>/g, '').trim()
    }

    const linkMatch = rssContent.match(/<link>(.*?)<\/link>/s)
    if (linkMatch) {
      info.link = linkMatch[1].trim()
    }

    const languageMatch = rssContent.match(/<language>(.*?)<\/language>/s)
    if (languageMatch) {
      info.language = languageMatch[1].trim()
    }

    const lastBuildDateMatch = rssContent.match(/<lastBuildDate>(.*?)<\/lastBuildDate>/s)
    if (lastBuildDateMatch) {
      info.lastBuildDate = lastBuildDateMatch[1].trim()
    }

    // Count items
    const itemMatches = rssContent.match(/<item>/g)
    info.itemCount = itemMatches ? itemMatches.length : 0
  } catch (error) {
    console.error('Error parsing RSS info:', error)
  }

  return info
}