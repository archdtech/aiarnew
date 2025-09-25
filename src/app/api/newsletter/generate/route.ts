import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { frequency = 'daily', customRecipients } = await request.json()

    // Get active subscribers
    const subscribers = await db.userPreferences.findMany({
      where: {
        isActive: true,
        email: {
          not: null
        },
        frequency: frequency
      }
    })

    if (subscribers.length === 0) {
      return NextResponse.json({
        message: 'لا توجد اشتراكات نشطة',
        sent: 0
      })
    }

    // Get recent articles based on frequency
    const dateLimit = new Date()
    switch (frequency) {
      case 'daily':
        dateLimit.setDate(dateLimit.getDate() - 1)
        break
      case 'weekly':
        dateLimit.setDate(dateLimit.getDate() - 7)
        break
      case 'monthly':
        dateLimit.setMonth(dateLimit.getMonth() - 1)
        break
    }

    const recentArticles = await db.newsArticle.findMany({
      where: {
        isProcessed: true,
        arabicSummary: {
          isNot: null
        },
        publishedAt: {
          gte: dateLimit
        }
      },
      include: {
        source: true,
        category: true,
        arabicSummary: true,
        tags: {
          include: {
            tag: true
          }
        },
        insights: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 20
    })

    if (recentArticles.length === 0) {
      return NextResponse.json({
        message: 'لا توجد مقالات جديدة للنشرة البريدية',
        sent: 0
      })
    }

    // Initialize ZAI
    const zai = await ZAI.create()

    // Generate newsletter content
    const newsletterContent = await generateNewsletterContent(zai, recentArticles, frequency)

    // Create newsletter record
    const newsletter = await db.newsletter.create({
      data: {
        subject: newsletterContent.subject,
        content: newsletterContent.textContent,
        htmlContent: newsletterContent.htmlContent,
        frequency,
        recipientCount: subscribers.length,
        status: 'sent'
      }
    })

    // Update last sent time for subscribers
    await db.userPreferences.updateMany({
      where: {
        id: {
          in: subscribers.map(s => s.id)
        }
      },
      data: {
        lastSentAt: new Date()
      }
    })

    // Log the newsletter generation
    await db.processingLog.create({
      data: {
        action: 'newsletter',
        status: 'success',
        message: `Generated ${frequency} newsletter`,
        metadata: JSON.stringify({
          newsletterId: newsletter.id,
          recipientCount: subscribers.length,
          articleCount: recentArticles.length,
          frequency
        })
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء النشرة البريدية بنجاح',
      newsletter: {
        id: newsletter.id,
        subject: newsletter.subject,
        recipientCount: newsletter.recipientCount,
        frequency,
        sentAt: newsletter.sentAt
      },
      content: newsletterContent
    })
  } catch (error) {
    console.error('Error generating newsletter:', error)
    
    // Log the error
    try {
      await db.processingLog.create({
        data: {
          action: 'newsletter',
          status: 'error',
          message: `Failed to generate newsletter: ${error}`,
          metadata: JSON.stringify({
            frequency: request.body?.frequency
          })
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'فشل في إنشاء النشرة البريدية' },
      { status: 500 }
    )
  }
}

async function generateNewsletterContent(zai: any, articles: any[], frequency: string) {
  const frequencyText = {
    daily: 'يومية',
    weekly: 'أسبوعية',
    monthly: 'شهرية'
  }[frequency] || 'يومية'

  // Prepare articles summary
  const articlesSummary = articles.map((article, index) => `
    المقال ${index + 1}:
    العنوان: ${article.arabicSummary?.title || article.title}
    الملخص: ${article.arabicSummary?.content || ''}
    التصنيف: ${article.category?.name || 'غير مصنف'}
    المصدر: ${article.source.name}
    الوسوم: ${article.tags.map(t => t.tag.name).join(', ')}
    الرابط: ${article.url}
  `).join('\n')

  // Generate newsletter with AI
  const newsletterPrompt = `
  قم بإنشاء نشرة بريدية احترافية ${frequencyText} باللغة العربية للمتخصصين في مجال التقنية واصحاب القرار.
  
  المقالات المختارة:
  ${articlesSummary}
  
  قم بإنشاء النشرة البريدية بالتنسيق التالي:
  
  1. عنوان جذاب يعكس محتوى النشرة
  2. مقدمة قصيرة تبرز أهمية الأخبار الواردة
  3. ملخص للمقالات الأهم (اختر 3-5 مقالات الأكثر أهمية)
  4. قسم للمقالات حسب التصنيف
  5. تحليل سريع للاتجاهات الرئيسية
  6. توصيات للمتخصصين
  7. خاتمة تدعو للمتابعة
  
  يجب أن تكون النشرة:
  - احترافية وموجهة لصناع القرار
  - مكتوبة بالعربية الفصحى الواضحة
  - منظمة وسهلة القراءة
  - تحتوي على معلومات قيمة وعملية
  - تشجع على النقر والقراءة المفصلة
  
  قدم المحتوى في تنسيق HTML مناسب للبريد الإلكتروني، مع استخدام التنسيق المناسب للعناوين والفقرات.
  `

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'أنت خبير في إنشاء النشرات البريدية الاحترافية للمتخصصين في مجال التقنية. متخصص في تلخيص الأخبار التقنية وتقديمها بطريقة جذابة ومفيدة.'
      },
      {
        role: 'user',
        content: newsletterPrompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4000
  })

  const newsletterContent = completion.choices[0]?.message?.content

  if (!newsletterContent) {
    throw new Error('فشل في إنشاء محتوى النشرة البريدية')
  }

  // Extract subject and create HTML content
  const subject = extractSubject(newsletterContent)
  const htmlContent = createHTMLContent(newsletterContent, articles, frequency)
  const textContent = createTextContent(newsletterContent, articles, frequency)

  return {
    subject,
    htmlContent,
    textContent
  }
}

function extractSubject(content: string): string {
  // Try to extract subject from the first line or create a default one
  const lines = content.split('\n').filter(line => line.trim())
  const firstLine = lines[0]?.trim()
  
  if (firstLine && firstLine.length < 100) {
    return firstLine
  }
  
  return 'ملخص التقنية - أحدث الأخبار التقنية للمتخصصين'
}

function createHTMLContent(content: string, articles: any[], frequency: string): string {
  const frequencyText = {
    daily: 'يومية',
    weekly: 'أسبوعية',
    monthly: 'شهرية'
  }[frequency] || 'يومية'

  const date = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ملخص التقنية - النشرة ${frequencyText}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 2px solid #007bff;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #007bff;
        margin: 0;
        font-size: 24px;
      }
      .header p {
        color: #666;
        margin: 5px 0 0 0;
        font-size: 14px;
      }
      .content {
        margin-bottom: 20px;
      }
      .article {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 15px;
        background-color: #f9f9f9;
      }
      .article h3 {
        color: #007bff;
        margin: 0 0 10px 0;
        font-size: 18px;
      }
      .article p {
        margin: 0 0 10px 0;
      }
      .article-meta {
        font-size: 12px;
        color: #666;
        margin-bottom: 10px;
      }
      .tags {
        margin-top: 10px;
      }
      .tag {
        display: inline-block;
        background-color: #007bff;
        color: white;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 11px;
        margin-left: 5px;
      }
      .read-more {
        display: inline-block;
        background-color: #007bff;
        color: white;
        padding: 8px 15px;
        text-decoration: none;
        border-radius: 3px;
        font-size: 12px;
        margin-top: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px 0;
        border-top: 1px solid #ddd;
        color: #666;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>ملخص التقنية</h1>
        <p>النشرة البريدية ${frequencyText} - ${date}</p>
      </div>
      
      <div class="content">
        ${content.replace(/\n/g, '<br>')}
        
        <h2>أحدث المقالات</h2>
        ${articles.map(article => `
          <div class="article">
            <h3>${article.arabicSummary?.title || article.title}</h3>
            <div class="article-meta">
              المصدر: ${article.source.name} | التصنيف: ${article.category?.name || 'غير مصنف'} | ${new Date(article.publishedAt).toLocaleDateString('ar-SA')}
            </div>
            <p>${article.arabicSummary?.content || ''}</p>
            <div class="tags">
              ${article.tags.map(tag => `<span class="tag">${tag.tag.name}</span>`).join('')}
            </div>
            <a href="${article.url}" class="read-more">قراءة المزيد</a>
          </div>
        `).join('')}
      </div>
      
      <div class="footer">
        <p>هذه النشرة البريدية مقدمة من خدمة ملخص التقنية</p>
        <p>لإلغاء الاشتراك، يرجى التواصل معنا</p>
      </div>
    </div>
  </body>
  </html>
  `
}

function createTextContent(content: string, articles: any[], frequency: string): string {
  const frequencyText = {
    daily: 'يومية',
    weekly: 'أسبوعية',
    monthly: 'شهرية'
  }[frequency] || 'يومية'

  const date = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  let textContent = `
ملخص التقنية - النشرة ${frequencyText}
${date}

${content}

أحدث المقالات:
`

  articles.forEach(article => {
    textContent += `
${article.arabicSummary?.title || article.title}
المصدر: ${article.source.name} | التصنيف: ${article.category?.name || 'غير مصنف'}
${article.arabicSummary?.content || ''}
الوسوم: ${article.tags.map(tag => tag.tag.name).join(', ')}
اقرأ المزيد: ${article.url}

---
`
  })

  textContent += `
هذه النشرة البريدية مقدمة من خدمة ملخص التقنية
لإلغاء الاشتراك، يرجى التواصل معنا
`

  return textContent
}