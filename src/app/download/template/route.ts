import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { type } = new URL(request.url).searchParams

    let csvContent = ''
    let filename = ''

    if (type === 'sources') {
      csvContent = `name,url,rssUrl,description,category
مثال: موقع التقنية,https://tech-example.com,https://tech-example.com/feed,مصدر أخبار التقنية,تقنية
مثال: موقع الذكاء الاصطناعي,https://ai-example.com,https://ai-example.com/rss,مصدر أخبار الذكاء الاصطناعي,ذكاء اصطناعي
مثال: موقع المطورين,https://dev-example.com,https://dev-example.com/feed,مصدر أخبار المطورين,تطوير
مثال: موقع الأمن السيبراني,https://security-example.com,https://security-example.com/rss,مصدر أخبار الأمن السيبراني,أمن سيبراني
مثال: موقع البلوك تشين,https://blockchain-example.com,https://blockchain-example.com/feed,مصدر أخبار البلوك تشين,بلوك تشين`
      filename = 'news_sources_template.csv'
    } else if (type === 'articles') {
      csvContent = `title,content,source,category,url,publishedAt
مثال: تطور جديد في الذكاء الاصطناعي,"شهدت تقنيات الذكاء الاصطناعي تطوراً كبيراً هذا العام مع إطلاق نماذج جديدة تتفوق في قدراتها على الفهم والاستدلال.",موقع التقنية,ذكاء اصطناعي,https://tech-example.com/ai-news,2025-06-20
مثال: تحديث أمني مهم,"اكتشف باحثون ثغرة أمنية خطيرة في بعض الأنظمة الشائعة، ويوصي المستخدمون بتحديث أنظمتهم فوراً.",موقع الأمن السيبراني,أمن سيبراني,https://security-example.com/vulnerability,2025-06-19
مثال: ابتكار في البلوك تشين,"أعلنت شركة ناشئة عن تقنية بلوك تشين جديدة تسرع المعاملات وتقلل التكاليف بشكل كبير.",موقع البلوك تشين,بلوك تشين,https://blockchain-example.com/innovation,2025-06-18`
      filename = 'news_articles_template.csv'
    } else {
      return NextResponse.json(
        { error: 'نوع القالب غير صالح' },
        { status: 400 }
      )
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv;charset=utf-8')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)

    return new NextResponse(blob, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء القالب' },
      { status: 500 }
    )
  }
}