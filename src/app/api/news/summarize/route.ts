import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'معرّف المقال مطلوب' },
        { status: 400 }
      )
    }

    // Get the article
    const article = await db.newsArticle.findUnique({
      where: { id: articleId },
      include: { source: true, category: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // Check if summary already exists
    const existingSummary = await db.newsSummary.findFirst({
      where: { articleId }
    })

    if (existingSummary) {
      return NextResponse.json({
        message: 'الملخص موجود بالفعل',
        summary: existingSummary
      })
    }

    // Initialize ZAI
    const zai = await ZAI.create()

    // Prepare content for summarization
    const contentToSummarize = article.content.substring(0, 4000) // Limit content length

    // Generate summary in Arabic
    const summaryPrompt = `
    أنت خبير في تحليل وتلخيص الأخبار التقنية للمتخصصين واصحاب القرار. قم بتحليل المقال التالي وتقديم ملخص شامل يتضمن:

    العنوان: ${article.title}
    المصدر: ${article.source.name}
    التصنيف: ${article.category?.name || 'تقنية'}
    المحتوى: ${contentToSummarize}

    قدم الملخص في التنسيق التالي باللغة العربية الفصحى:

    ## العنوان الملخص
    [عنوان جذاب وواضح يعكس جوهر الخبر]

    ## ملخص تنفيذي
    [ملخص من 4-6 أسطر يغطي النقاط الأساسية بطريقة احترافية]

    ## النقاط الرئيسية
    • [النقطة الأولى: أهم تطور أو إعلان]
    • [النقطة الثانية: تقنية أو منتج جديد]
    • [النقطة الثالثة: تأثير على السوق أو الصناعة]
    • [النقطة الرابعة: ردود فعل أو تحليلات]

    ## التحليل الاستراتيجي
    **الفرص:**
    - [فرصة 1: كيف يمكن الاستفادة من هذا التطور]
    - [فرصة 2: تطبيقات عملية في السوق]

    **المخاطر:**
    - [مخاطرة 1: تحديات محتملة]
    - [مخاطرة 2: تأثير على الأعمال الحالية]

    ## التوصيات التنفيذية
    **للشركات الناشئة:**
    [نصيحة عملية للشركات الصغيرة والمتوسطة]

    **للشركات الكبرى:**
    [نصيحة للمؤسسات الكبيرة]

    **للمستثمرين:**
    [نصيحة استثمارية بناءً على الخبر]

    ## المؤشرات الرئيسية للأداء (KPIs)
    - [مؤشر 1: كيفية قياس النجاح في هذا المجال]
    - [مؤشر 2: معايير التقييم المهمة]

    ## الجدول الزمني المتوقع
    **قصير المدى (3-6 أشهر):** [تطورات متوقعة]
    **متوسط المدى (6-12 شهر):** [توجهات السوق]
    **طويل المدى (1-2 سنة):** [رؤية مستقبلية]

    يجب أن يكون الملخص:
    - استراتيجياً وقابلاً للتنفيذ
    - مركزاً على القيمة العملية
    - مدعوماً بتحليل واقعي
    - مناسباً لاتخاذ القرارات
    - واضحاً ومباشراً
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'أنت مساعد خبير متخصص في تحليل وتلخيص المقالات التقنية باللغة العربية. متخصص في تقديم تحليلات عميقة ورؤى استراتيجية وتوصيات عملية قابلة للتنفيذ للمتخصصين واصحاب القرار في القطاع التقني.'
        },
        {
          role: 'user',
          content: summaryPrompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2000
    })

    const summaryContent = completion.choices[0]?.message?.content

    if (!summaryContent) {
      throw new Error('فشل في توليد الملخص')
    }

    // Parse the enhanced summary response
    const lines = summaryContent.split('\n').filter(line => line.trim())
    let title = article.title
    let summary = ''
    let executiveSummary = ''
    let keyPoints: string[] = []
    let strategicAnalysis = ''
    let recommendations = ''
    let kpis = ''
    let timeline = ''

    let currentSection = ''
    let sectionContent: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('## ')) {
        // Save previous section
        if (currentSection && sectionContent.length > 0) {
          const content = sectionContent.join(' ').trim()
          switch (currentSection) {
            case 'العنوان الملخص':
              title = content
              break
            case 'ملخص تنفيذي':
              executiveSummary = content
              break
            case 'النقاط الرئيسية':
              keyPoints = sectionContent.filter(item => item.trim()).map(item => 
                item.replace(/^[-•\d.\s*]+/, '').trim()
              )
              break
            case 'التحليل الاستراتيجي':
              strategicAnalysis = content
              break
            case 'التوصيات التنفيذية':
              recommendations = content
              break
            case 'المؤشرات الرئيسية للأداء (KPIs)':
              kpis = content
              break
            case 'الجدول الزمني المتوقع':
              timeline = content
              break
          }
        }
        
        // Start new section
        currentSection = trimmedLine.replace('## ', '')
        sectionContent = []
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Subsection headers
        sectionContent.push(trimmedLine)
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || trimmedLine.match(/^\d+\./)) {
        // This is a bullet point
        sectionContent.push(trimmedLine)
      } else if (trimmedLine.length > 10 && !trimmedLine.startsWith('#')) {
        // Regular content
        sectionContent.push(trimmedLine)
      }
    }

    // Save the last section
    if (currentSection && sectionContent.length > 0) {
      const content = sectionContent.join(' ').trim()
      switch (currentSection) {
        case 'العنوان الملخص':
          title = content
          break
        case 'ملخص تنفيذي':
          executiveSummary = content
          break
        case 'النقاط الرئيسية':
          keyPoints = sectionContent.filter(item => item.trim()).map(item => 
            item.replace(/^[-•\d.\s*]+/, '').trim()
          )
          break
        case 'التحليل الاستراتيجي':
          strategicAnalysis = content
          break
        case 'التوصيات التنفيذية':
          recommendations = content
          break
        case 'المؤشرات الرئيسية للأداء (KPIs)':
          kpis = content
          break
        case 'الجدول الزمني المتوقع':
          timeline = content
          break
      }
    }

    // Create comprehensive summary
    summary = executiveSummary || ''
    if (strategicAnalysis) {
      summary += '\n\n' + strategicAnalysis
    }
    if (recommendations) {
      summary += '\n\n' + recommendations
    }

    // If we couldn't parse properly, use the whole response as summary
    if (!summary) {
      summary = summaryContent
      title = article.title
    }

    // Create the enhanced summary
    const newsSummary = await db.newsSummary.create({
      data: {
        title: title,
        content: summary,
        keyPoints: JSON.stringify({
          executiveSummary,
          keyPoints,
          strategicAnalysis,
          recommendations,
          kpis,
          timeline
        }),
        language: 'ar',
        confidence: 0.9, // Higher confidence for enhanced summaries
        wordCount: summary.split(' ').length,
        articleId: article.id
      }
    })

    // Update article as processed
    await db.newsArticle.update({
      where: { id: article.id },
      data: { isProcessed: true }
    })

    // Log the summarization
    await db.processingLog.create({
      data: {
        action: 'summarize',
        status: 'success',
        message: `Summarized article: ${article.title}`,
        metadata: JSON.stringify({
          articleId: article.id,
          summaryId: newsSummary.id,
          wordCount: newsSummary.wordCount
        })
      }
    })

    return NextResponse.json({
      message: 'تم تلخيص المقال بنجاح',
      summary: newsSummary
    })
  } catch (error) {
    console.error('Error in summarize news:', error)
    
    // Log the error
    try {
      await db.processingLog.create({
        data: {
          action: 'summarize',
          status: 'error',
          message: `Failed to summarize article: ${error}`,
          metadata: JSON.stringify({
            articleId: request.body?.articleId
          })
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'فشل في تلخيص المقال' },
      { status: 500 }
    )
  }
}

// Batch summarize multiple articles
export async function GET() {
  try {
    // Get articles that need summarization
    const articles = await db.newsArticle.findMany({
      where: {
        isProcessed: false,
        arabicSummary: {
          is: null
        }
      },
      include: { source: true, category: true },
      take: 5 // Limit to 5 articles per batch
    })

    if (articles.length === 0) {
      return NextResponse.json({
        message: 'لا توجد مقالات تحتاج إلى تلخيص',
        processed: 0
      })
    }

    const zai = await ZAI.create()
    let processedCount = 0

    for (const article of articles) {
      try {
        // Prepare content for summarization
        const contentToSummarize = article.content.substring(0, 4000)

        // Generate enhanced summary in Arabic
        const summaryPrompt = `
        أنت خبير في تحليل وتلخيص الأخبار التقنية للمتخصصين واصحاب القرار. قم بتحليل المقال التالي وتقديم ملخص شامل يتضمن:

        العنوان: ${article.title}
        المصدر: ${article.source.name}
        التصنيف: ${article.category?.name || 'تقنية'}
        المحتوى: ${contentToSummarize}

        قدم الملخص في التنسيق التالي باللغة العربية الفصحى:

        ## العنوان الملخص
        [عنوان جذاب وواضح يعكس جوهر الخبر]

        ## ملخص تنفيذي
        [ملخص من 4-6 أسطر يغطي النقاط الأساسية بطريقة احترافية]

        ## النقاط الرئيسية
        • [النقطة الأولى: أهم تطور أو إعلان]
        • [النقطة الثانية: تقنية أو منتج جديد]
        • [النقطة الثالثة: تأثير على السوق أو الصناعة]
        • [النقطة الرابعة: ردود فعل أو تحليلات]

        ## التحليل الاستراتيجي
        **الفرص:**
        - [فرصة 1: كيف يمكن الاستفادة من هذا التطور]
        - [فرصة 2: تطبيقات عملية في السوق]

        **المخاطر:**
        - [مخاطرة 1: تحديات محتملة]
        - [مخاطرة 2: تأثير على الأعمال الحالية]

        ## التوصيات التنفيذية
        **للشركات الناشئة:**
        [نصيحة عملية للشركات الصغيرة والمتوسطة]

        **للشركات الكبرى:**
        [نصيحة للمؤسسات الكبيرة]

        **للمستثمرين:**
        [نصيحة استثمارية بناءً على الخبر]

        ## المؤشرات الرئيسية للأداء (KPIs)
        - [مؤشر 1: كيفية قياس النجاح في هذا المجال]
        - [مؤشر 2: معايير التقييم المهمة]

        ## الجدول الزمني المتوقع
        **قصير المدى (3-6 أشهر):** [تطورات متوقعة]
        **متوسط المدى (6-12 شهر):** [توجهات السوق]
        **طويل المدى (1-2 سنة):** [رؤية مستقبلية]

        يجب أن يكون الملخص:
        - استراتيجياً وقابلاً للتنفيذ
        - مركزاً على القيمة العملية
        - مدعوماً بتحليل واقعي
        - مناسباً لاتخاذ القرارات
        - واضحاً ومباشراً
        `

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد خبير في تلخيص المقالات التقنية باللغة العربية. متخصص في تحويل المحتوى التقني المعقد إلى ملخصات واضحة ومفيدة للمتخصصين واصحاب القرار.'
            },
            {
              role: 'user',
              content: summaryPrompt
            }
          ],
          temperature: 0.6,
          max_tokens: 2000
        })

        const summaryContent = completion.choices[0]?.message?.content

        if (!summaryContent) {
          throw new Error('فشل في توليد الملخص')
        }

          // Parse the enhanced summary response
        const lines = summaryContent.split('\n').filter(line => line.trim())
        let title = article.title
        let summary = ''
        let executiveSummary = ''
        let keyPoints: string[] = []
        let strategicAnalysis = ''
        let recommendations = ''
        let kpis = ''
        let timeline = ''

        let currentSection = ''
        let sectionContent: string[] = []

        for (const line of lines) {
          const trimmedLine = line.trim()
          
          if (trimmedLine.startsWith('## ')) {
            // Save previous section
            if (currentSection && sectionContent.length > 0) {
              const content = sectionContent.join(' ').trim()
              switch (currentSection) {
                case 'العنوان الملخص':
                  title = content
                  break
                case 'ملخص تنفيذي':
                  executiveSummary = content
                  break
                case 'النقاط الرئيسية':
                  keyPoints = sectionContent.filter(item => item.trim()).map(item => 
                    item.replace(/^[-•\d.\s*]+/, '').trim()
                  )
                  break
                case 'التحليل الاستراتيجي':
                  strategicAnalysis = content
                  break
                case 'التوصيات التنفيذية':
                  recommendations = content
                  break
                case 'المؤشرات الرئيسية للأداء (KPIs)':
                  kpis = content
                  break
                case 'الجدول الزمني المتوقع':
                  timeline = content
                  break
              }
            }
            
            // Start new section
            currentSection = trimmedLine.replace('## ', '')
            sectionContent = []
          } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
            // Subsection headers
            sectionContent.push(trimmedLine)
          } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || trimmedLine.match(/^\d+\./)) {
            // This is a bullet point
            sectionContent.push(trimmedLine)
          } else if (trimmedLine.length > 10 && !trimmedLine.startsWith('#')) {
            // Regular content
            sectionContent.push(trimmedLine)
          }
        }

        // Save the last section
        if (currentSection && sectionContent.length > 0) {
          const content = sectionContent.join(' ').trim()
          switch (currentSection) {
            case 'العنوان الملخص':
              title = content
              break
            case 'ملخص تنفيذي':
              executiveSummary = content
              break
            case 'النقاط الرئيسية':
              keyPoints = sectionContent.filter(item => item.trim()).map(item => 
                item.replace(/^[-•\d.\s*]+/, '').trim()
              )
              break
            case 'التحليل الاستراتيجي':
              strategicAnalysis = content
              break
            case 'التوصيات التنفيذية':
              recommendations = content
              break
            case 'المؤشرات الرئيسية للأداء (KPIs)':
              kpis = content
              break
            case 'الجدول الزمني المتوقع':
              timeline = content
              break
          }
        }

        // Create comprehensive summary
        summary = executiveSummary || ''
        if (strategicAnalysis) {
          summary += '\n\n' + strategicAnalysis
        }
        if (recommendations) {
          summary += '\n\n' + recommendations
        }

        // If we couldn't parse properly, use the whole response as summary
        if (!summary) {
          summary = summaryContent
          title = article.title
        }

        // Create the enhanced summary
        await db.newsSummary.create({
          data: {
            title: title,
            content: summary,
            keyPoints: JSON.stringify({
              executiveSummary,
              keyPoints,
              strategicAnalysis,
              recommendations,
              kpis,
              timeline
            }),
            language: 'ar',
            confidence: 0.9, // Higher confidence for enhanced summaries
            wordCount: summary.split(' ').length,
            articleId: article.id
          }
        })

        // Update article as processed
        await db.newsArticle.update({
          where: { id: article.id },
          data: { isProcessed: true }
        })

        processedCount++

        // Log success
        await db.processingLog.create({
          data: {
            action: 'summarize',
            status: 'success',
            message: `Batch summarized article: ${article.title}`,
            metadata: JSON.stringify({
              articleId: article.id
            })
          }
        })
      } catch (error) {
        console.error(`Error summarizing article ${article.id}:`, error)
        
        // Log error
        await db.processingLog.create({
          data: {
            action: 'summarize',
            status: 'error',
            message: `Batch summarize failed: ${error}`,
            metadata: JSON.stringify({
              articleId: article.id
            })
          }
        })
      }
    }

    return NextResponse.json({
      message: 'تمت معالجة دفعة التلخيص',
      processed: processedCount,
      total: articles.length
    })
  } catch (error) {
    console.error('Error in batch summarize:', error)
    return NextResponse.json(
      { error: 'فشل في معالجة دفعة التلخيص' },
      { status: 500 }
    )
  }
}