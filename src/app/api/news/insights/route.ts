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

    // Get the article with its summary
    const article = await db.newsArticle.findUnique({
      where: { id: articleId },
      include: {
        source: true,
        category: true,
        arabicSummary: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // Check if insights already exist
    const existingInsight = await db.contextualInsight.findFirst({
      where: { articleId }
    })

    if (existingInsight) {
      return NextResponse.json({
        message: 'الرؤى التحليلية موجودة بالفعل',
        insight: existingInsight
      })
    }

    // Initialize ZAI
    const zai = await ZAI.create()

    // Prepare content for analysis
    const contentToAnalyze = `
    العنوان: ${article.title}
    الملخص العربي: ${article.arabicSummary?.content || ''}
    المحتوى الأصلي: ${article.content.substring(0, 3000)}
    التصنيف: ${article.category?.name || 'غير مصنف'}
    المصدر: ${article.source.name}
    الوسوم: ${article.tags.map(t => t.tag.name).join(', ')}
    `

    // Generate contextual insights using AI
    const insightPrompt = `
    قم بتحليل المقال التقني التالي وتقديم رؤى تحليلية متعمقة للمتخصصين واصحاب القرار.
    
    ${contentToAnalyze}
    
    قدم تحليلاً شاملاً يشمل الجوانب التالية:
    
    1. الاتجاهات (Trends):
       - ما هي الاتجاهات التقنية التي يلمح إليها المقال؟
       - كيف يرتبط هذا المقال بالتطورات الحالية في المجال؟
       - ما هي التوجهات المستقبلية المحتملة؟
    
    2. التأثير (Impact):
       - ما هو التأثير المحتمل لهذا التطور على الشركات والمؤسسات؟
       - كيف يمكن أن يؤثر على الصناعة أو السوق؟
       - ما هي الآثار المترتبة على استراتيجيات الأعمال؟
    
    3. الفرص (Opportunities):
       - ما هي الفرص التجارية أو التقنية التي يخلقها هذا التطور؟
       - كيف يمكن استغلال هذه الفرص من قبل الشركات؟
       - ما هي المجالات الجديدة المحتملة للاستثمار أو التطوير؟
    
    4. المخاطر (Risks):
       - ما هي المخاطر أو التحديات المحتملة المرتبطة بهذا التطور؟
       - كيف يمكن تخفيف هذه المخاطر؟
       - ما هي الجوانب التي تتطلب حذراً أو دراسة متأنية؟
    
    قدم التحليل في تنسيق JSON كالتالي:
    {
      "trend": {
        "title": "عنوان الاتجاه",
        "description": "وصف مفصل للاتجاه",
        "confidence": 0.8
      },
      "impact": {
        "title": "عنوان التأثير",
        "description": "وصف التأثير المحتمل",
        "confidence": 0.7
      },
      "opportunity": {
        "title": "عنوان الفرصة",
        "description": "وصف الفرص المحتملة",
        "confidence": 0.6
      },
      "risk": {
        "title": "عنوان المخاطرة",
        "description": "وصف المخاطر المحتملة",
        "confidence": 0.5
      },
      "keyInsights": ["رؤية رئيسية 1", "رؤية رئيسية 2", "رؤية رئيسية 3"],
      "recommendations": ["توصية 1", "توصية 2", "توصية 3"],
      "targetAudience": ["المديرون التنفيذيون", "مديرو التقنية", "المستثمرون"],
      "timeHorizon": "قصير/متوسط/طويل الأجل",
      "overallConfidence": 0.7
    }
    
    يجب أن يكون التحليل:
    - عميقاً ومفصلاً
    - موجهاً لصناع القرار
    - قائماً على الحقائق الواردة في المقال
    - عملياً وقابلاً للتطبيق
    - مكتوباً باللغة العربية الفصحى
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في تحليل المحتوى التقني وتقديم رؤى استراتيجية للمتخصصين واصحاب القرار. متخصص في تحويل المعلومات التقنية المعقدة إلى رؤى قابلة للتنفيذ.'
        },
        {
          role: 'user',
          content: insightPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    const insightContent = completion.choices[0]?.message?.content

    if (!insightContent) {
      throw new Error('فشل في توليد الرؤى التحليلية')
    }

    // Parse JSON response
    let analysisResult
    try {
      // Extract JSON from the response
      const jsonMatch = insightContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('لم يتم العثور على JSON في الرد')
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return NextResponse.json(
        { error: 'فشل في تحليل نتائج الرؤى' },
        { status: 500 }
      )
    }

    // Create insights for each type
    const insightTypes = ['trend', 'impact', 'opportunity', 'risk']
    const createdInsights = []

    for (const insightType of insightTypes) {
      if (analysisResult[insightType]) {
        const insight = await db.contextualInsight.create({
          data: {
            articleId,
            title: analysisResult[insightType].title,
            content: analysisResult[insightType].description,
            type: insightType,
            confidence: analysisResult[insightType].confidence || 0.7,
            metadata: JSON.stringify({
              keyInsights: analysisResult.keyInsights || [],
              recommendations: analysisResult.recommendations || [],
              targetAudience: analysisResult.targetAudience || [],
              timeHorizon: analysisResult.timeHorizon || 'medium',
              overallConfidence: analysisResult.overallConfidence || 0.7
            })
          }
        })
        createdInsights.push(insight)
      }
    }

    // Log the insight generation
    await db.processingLog.create({
      data: {
        action: 'insights',
        status: 'success',
        message: `Generated insights for article: ${article.title}`,
        metadata: JSON.stringify({
          articleId: article.id,
          insightTypes: insightTypes,
          insightsCount: createdInsights.length,
          overallConfidence: analysisResult.overallConfidence
        })
      }
    })

    return NextResponse.json({
      message: 'تم توليد الرؤى التحليلية بنجاح',
      insights: createdInsights,
      analysis: analysisResult
    })
  } catch (error) {
    console.error('Error in generating insights:', error)
    
    // Log the error
    try {
      await db.processingLog.create({
        data: {
          action: 'insights',
          status: 'error',
          message: `Failed to generate insights: ${error}`,
          metadata: JSON.stringify({
            articleId: request.body?.articleId
          })
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'فشل في توليد الرؤى التحليلية' },
      { status: 500 }
    )
  }
}

// Batch generate insights for multiple articles
export async function GET() {
  try {
    // Get articles that need insights
    const articles = await db.newsArticle.findMany({
      where: {
        isProcessed: true,
        arabicSummary: {
          isNot: null
        },
        insights: {
          none: {}
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
        }
      },
      take: 3 // Limit to 3 articles per batch (insights are resource-intensive)
    })

    if (articles.length === 0) {
      return NextResponse.json({
        message: 'لا توجد مقالات تحتاج إلى رؤى تحليلية',
        processed: 0
      })
    }

    const zai = await ZAI.create()
    let processedCount = 0

    for (const article of articles) {
      try {
        // Prepare content for analysis
        const contentToAnalyze = `
        العنوان: ${article.title}
        الملخص العربي: ${article.arabicSummary?.content || ''}
        المحتوى الأصلي: ${article.content.substring(0, 3000)}
        التصنيف: ${article.category?.name || 'غير مصنف'}
        المصدر: ${article.source.name}
        الوسوم: ${article.tags.map(t => t.tag.name).join(', ')}
        `

        // Generate contextual insights using AI
        const insightPrompt = `
        قم بتحليل المقال التقني التالي وتقديم رؤى تحليلية متعمقة للمتخصصين واصحاب القرار.
        
        ${contentToAnalyze}
        
        قدم تحليلاً شاملاً يشمل الجوانب التالية:
        
        1. الاتجاهات (Trends):
           - ما هي الاتجاهات التقنية التي يلمح إليها المقال؟
           - كيف يرتبط هذا المقال بالتطورات الحالية في المجال؟
           - ما هي التوجهات المستقبلية المحتملة؟
        
        2. التأثير (Impact):
           - ما هو التأثير المحتمل لهذا التطور على الشركات والمؤسسات؟
           - كيف يمكن أن يؤثر على الصناعة أو السوق؟
           - ما هي الآثار المترتبة على استراتيجيات الأعمال؟
        
        3. الفرص (Opportunities):
           - ما هي الفرص التجارية أو التقنية التي يخلقها هذا التطور؟
           - كيف يمكن استغلال هذه الفرص من قبل الشركات؟
           - ما هي المجالات الجديدة المحتملة للاستثمار أو التطوير؟
        
        4. المخاطر (Risks):
           - ما هي المخاطر أو التحديات المحتملة المرتبطة بهذا التطور؟
           - كيف يمكن تخفيف هذه المخاطر؟
           - ما هي الجوانب التي تتطلب حذراً أو دراسة متأنية؟
        
        قدم التحليل في تنسيق JSON كالتالي:
        {
          "trend": {
            "title": "عنوان الاتجاه",
            "description": "وصف مفصل للاتجاه",
            "confidence": 0.8
          },
          "impact": {
            "title": "عنوان التأثير",
            "description": "وصف التأثير المحتمل",
            "confidence": 0.7
          },
          "opportunity": {
            "title": "عنوان الفرصة",
            "description": "وصف الفرص المحتملة",
            "confidence": 0.6
          },
          "risk": {
            "title": "عنوان المخاطرة",
            "description": "وصف المخاطر المحتملة",
            "confidence": 0.5
          },
          "keyInsights": ["رؤية رئيسية 1", "رؤية رئيسية 2", "رؤية رئيسية 3"],
          "recommendations": ["توصية 1", "توصية 2", "توصية 3"],
          "targetAudience": ["المديرون التنفيذيون", "مديرو التقنية", "المستثمرون"],
          "timeHorizon": "قصير/متوسط/طويل الأجل",
          "overallConfidence": 0.7
        }
        `

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'أنت خبير في تحليل المحتوى التقني وتقديم رؤى استراتيجية للمتخصصين واصحاب القرار.'
            },
            {
              role: 'user',
              content: insightPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })

        const insightContent = completion.choices[0]?.message?.content

        if (!insightContent) {
          throw new Error('فشل في توليد الرؤى التحليلية')
        }

        // Parse JSON response
        let analysisResult
        try {
          const jsonMatch = insightContent.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            analysisResult = JSON.parse(jsonMatch[0])
          } else {
            throw new Error('لم يتم العثور على JSON في الرد')
          }
        } catch (error) {
          throw new Error('فشل في تحليل نتائج الرؤى')
        }

        // Create insights for each type
        const insightTypes = ['trend', 'impact', 'opportunity', 'risk']
        const createdInsights = []

        for (const insightType of insightTypes) {
          if (analysisResult[insightType]) {
            const insight = await db.contextualInsight.create({
              data: {
                articleId: article.id,
                title: analysisResult[insightType].title,
                content: analysisResult[insightType].description,
                type: insightType,
                confidence: analysisResult[insightType].confidence || 0.7,
                metadata: JSON.stringify({
                  keyInsights: analysisResult.keyInsights || [],
                  recommendations: analysisResult.recommendations || [],
                  targetAudience: analysisResult.targetAudience || [],
                  timeHorizon: analysisResult.timeHorizon || 'medium',
                  overallConfidence: analysisResult.overallConfidence || 0.7
                })
              }
            })
            createdInsights.push(insight)
          }
        }

        processedCount++

        // Log success
        await db.processingLog.create({
          data: {
            action: 'insights',
            status: 'success',
            message: `Batch generated insights for article: ${article.title}`,
            metadata: JSON.stringify({
              articleId: article.id,
              insightTypes: insightTypes,
              insightsCount: createdInsights.length
            })
          }
        })
      } catch (error) {
        console.error(`Error generating insights for article ${article.id}:`, error)
        
        // Log error
        await db.processingLog.create({
          data: {
            action: 'insights',
            status: 'error',
            message: `Batch insights failed: ${error}`,
            metadata: JSON.stringify({
              articleId: article.id
            })
          }
        })
      }
    }

    return NextResponse.json({
      message: 'تمت معالجة دفعة الرؤى التحليلية',
      processed: processedCount,
      total: articles.length
    })
  } catch (error) {
    console.error('Error in batch insights:', error)
    return NextResponse.json(
      { error: 'فشل في معالجة دفعة الرؤى التحليلية' },
      { status: 500 }
    )
  }
}