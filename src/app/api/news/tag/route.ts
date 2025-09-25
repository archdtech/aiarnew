import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// Predefined tech tags in Arabic
const TECH_TAGS = [
  'ذكاء اصطناعي',
  'تعلم آلي',
  'تعلم عميق',
  'شبكات عصبية',
  'معالجة اللغات الطبيعية',
  'رؤية حاسوبية',
  'روبوتات',
  'أتمتة',
  'تحليلات',
  'بيانات ضخمة',
  'سحابة',
  'حوسبة سحابية',
  'أمن سيبراني',
  'أمن المعلومات',
  'تشفير',
  'خصوصية',
  'بلوك تشين',
  'عملات رقمية',
  'ويب 3',
  'ميتافيرس',
  'واقع افتراضي',
  'واقع معزز',
  'إنترنت الأشياء',
  '5G',
  'اتصالات',
  'تطوير برمجيات',
  'برمجة',
  'واجهات أمامية',
  'واجهات خلفية',
  'تطبيقات',
  'موبايل',
  'ويب',
  'قواعد بيانات',
  'خوادم',
  'بنية تحتية',
  'ديف أوبس',
  'تشغيل',
  'اختبار',
  'جودة',
  'ابتكار',
  'نماذج أعمال',
  'تحول رقمي',
  'استراتيجية',
  'قيادة',
  'إدارة',
  'استثمار',
  'تمويل',
  'شركات ناشئة',
  'تمويل جماعي',
  'اكتتابات',
  'استحواذ',
  'اندماج',
  'منافسة',
  'سوق',
  'عملاء',
  'منتجات',
  'خدمات',
  'تكنولوجيا مالية',
  'تجارة إلكترونية',
  'تعليم',
  'صحة',
  'نقل',
  'طاقة',
  'تصنيع',
  'زراعة',
  'مدن ذكية',
  'استدامة',
  'بيئة',
  'مناخ',
  'تنظيم',
  'سياسات',
  'أخلاقيات',
  'مجتمع',
  'توظيف',
  'مهارات',
  'تدريب',
  'تعليم',
  'بحث',
  'تطوير',
  'ابتكار',
  'براءات اختراع',
  'ملكية فكرية',
  'معايير',
  'توافقية',
  'جودة',
  'أداء',
  'كفاءة',
  'إنتاجية',
  'تجربة مستخدم',
  'تصميم',
  'واجهة',
  'تفاعل',
  'إمكانية وصول',
  'تعددية',
  'توطين',
  'عولمة',
  'ثقافة',
  'تنوع',
  'شمولية',
  'مسؤولية اجتماعية',
  'حوكمة',
  'شفافية',
  'ثقة',
  'أمان',
  'موثوقية',
  'مرونة',
  'توسع',
  'صيانة',
  'تحديث',
  'ترقية',
  'هجرة',
  'تكامل',
  'توافق',
  'معايير مفتوحة',
  'مصادر مفتوحة',
  'تعاون',
  'مجتمع',
  'نظام بيئي',
  'شراكات',
  'تحالفات',
  'شبكات',
  'اتصالات',
  'تعاون عن بعد',
  'عمل هجين',
  'مرونة',
  'استمرارية',
  'تعافي',
  'تخطيط',
  'إدارة مخاطر',
  'امتثال',
  'مراجعة',
  'رقابة',
  'جودة',
  'تحسين',
  'تحسين مستمر',
  'رشيق',
  'رشاقة',
  'تسليم',
  'قيمة',
  'عملاء',
  'رضا',
  'ولاء',
  'احتفاظ',
  'اكتساب',
  'تسويق',
  'مبيعات',
  'دعم',
  'خدمة',
  'تجربة',
  'رحلة',
  'لمسات',
  'تفاصيل',
  'جودة',
  'تميز',
  'قيادة',
  'رؤية',
  'مهمة',
  'قيم',
  'ثقافة',
  'فرق',
  'تعاون',
  'تواصل',
  'شفافية',
  'مساءلة',
  'تمكين',
  'تطوير',
  'تعلم',
  'نمو',
  'تطور',
  'تحديات',
  'فرص',
  'مخاطر',
  'تهديدات',
  'نقاط قوة',
  'نقاط ضعف',
  'تحليل',
  'تقييم',
  'قرارات',
  'استراتيجيات',
  'خطط',
  'أهداف',
  'مؤشرات',
  'قياس',
  'تحليل',
  'تقارير',
  'رؤى',
  'تنبؤات',
  'توقعات',
  'اتجاهات',
  'مستقبل',
  'تكنولوجيا',
  'ابتكار',
  'تغيير',
  'تحول',
  'ثورة',
  'تطور',
  'نمو',
  'توسع',
  'انتشار',
  'تبني',
  'تقبل',
  'مقاومة',
  'تحديات',
  'فرص',
  'مخاطر',
  'تهديدات',
  'نقاط قوة',
  'نقاط ضعف',
  'تحليل',
  'تقييم',
  'قرارات',
  'استراتيجيات',
  'خطط',
  'أهداف',
  'مؤشرات',
  'قياس',
  'تحليل',
  'تقارير',
  'رؤى',
  'تنبؤات',
  'توقعات',
  'اتجاهات',
  'مستقبل'
]

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
      include: { category: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // Initialize ZAI
    const zai = await ZAI.create()

    // Prepare content for tagging
    const contentToAnalyze = `${article.title}\n\n${article.content.substring(0, 2000)}`

    // Generate tags using AI
    const taggingPrompt = `
    قم بتحليل المقال التالي واستخرج أهم الكلمات المفتاحية والوسوم المناسبة له.
    يجب أن تكون الوسوم باللغة العربية وتصف محتوى المقال بدقة.
    
    العنوان: ${article.title}
    التصنيف: ${article.category?.name || 'غير مصنف'}
    المحتوى: ${contentToAnalyze}
    
    قدم من 3 إلى 8 وسوم فقط، كل وسم في سطر منفصل. يجب أن تكون الوسوم:
    - دقيقة وذات صلة بالمحتوى
    - مكتوبة بالعربية الفصحى
    - تغطي الجوانب التقنية الرئيسية
    - مناسبة للمتخصصين واصحاب القرار
    - قصيرة وواضحة (كلمة واحدة أو كلمتين كحد أقصى)
    
    مثال:
    ذكاء اصطناعي
    تعلم عميق
    تطوير برمجيات
    أمن سيبراني
    `

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'أنت مساعد خبير في تحليل المحتوى التقني واستخراج الكلمات المفتاحية باللغة العربية. متخصص في تحديد المفاهيم التقنية الهامة في المقالات.'
        },
        {
          role: 'user',
          content: taggingPrompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    })

    const tagsContent = completion.choices[0]?.message?.content

    if (!tagsContent) {
      throw new Error('فشل في استخراج الوسوم')
    }

    // Parse the tags
    const suggestedTags = tagsContent
      .split('\n')
      .map(tag => tag.trim().replace(/^[-•\d.\s]+/, ''))
      .filter(tag => tag.length > 0 && tag.length < 50)

    // Combine AI suggestions with predefined tags
    const allTags = [...new Set([...suggestedTags, ...TECH_TAGS])]

    // Find matching tags in database or create new ones
    const processedTags = []
    for (const tagName of allTags.slice(0, 8)) { // Limit to 8 tags
      try {
        // Find existing tag
        let tag = await db.tag.findFirst({
          where: { name: tagName }
        })

        // Create tag if it doesn't exist
        if (!tag && suggestedTags.includes(tagName)) {
          tag = await db.tag.create({
            data: {
              name: tagName,
              description: `وسم تلقائي للمقال: ${article.title}`
            }
          })
        }

        if (tag) {
          processedTags.push(tag)
        }
      } catch (error) {
        console.error(`Error processing tag ${tagName}:`, error)
      }
    }

    // Remove existing tags
    await db.newsTag.deleteMany({
      where: { articleId }
    })

    // Add new tags
    for (const tag of processedTags) {
      await db.newsTag.create({
        data: {
          articleId,
          tagId: tag.id
        }
      })
    }

    // Log the tagging
    await db.processingLog.create({
      data: {
        action: 'tag',
        status: 'success',
        message: `Tagged article: ${article.title}`,
        metadata: JSON.stringify({
          articleId: article.id,
          tags: processedTags.map(t => t.name),
          suggestedTags,
          aiGenerated: true
        })
      }
    })

    return NextResponse.json({
      message: 'تم تصنيف المقال بنجاح',
      tags: processedTags.map(tag => tag.name),
      suggestedTags,
      totalTags: processedTags.length
    })
  } catch (error) {
    console.error('Error in tag article:', error)
    
    // Log the error
    try {
      await db.processingLog.create({
        data: {
          action: 'tag',
          status: 'error',
          message: `Failed to tag article: ${error}`,
          metadata: JSON.stringify({
            articleId: request.body?.articleId
          })
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'فشل في تصنيف المقال' },
      { status: 500 }
    )
  }
}

// Batch tag multiple articles
export async function GET() {
  try {
    // Get articles that need tagging
    const articles = await db.newsArticle.findMany({
      where: {
        isProcessed: true,
        tags: {
          none: {}
        }
      },
      include: { category: true },
      take: 10 // Limit to 10 articles per batch
    })

    if (articles.length === 0) {
      return NextResponse.json({
        message: 'لا توجد مقالات تحتاج إلى تصنيف',
        processed: 0
      })
    }

    const zai = await ZAI.create()
    let processedCount = 0

    for (const article of articles) {
      try {
        // Prepare content for tagging
        const contentToAnalyze = `${article.title}\n\n${article.content.substring(0, 2000)}`

        // Generate tags using AI
        const taggingPrompt = `
        قم بتحليل المقال التالي واستخرج أهم الكلمات المفتاحية والوسوم المناسبة له.
        يجب أن تكون الوسوم باللغة العربية وتصف محتوى المقال بدقة.
        
        العنوان: ${article.title}
        التصنيف: ${article.category?.name || 'غير مصنف'}
        المحتوى: ${contentToAnalyze}
        
        قدم من 3 إلى 8 وسوم فقط، كل وسم في سطر منفصل. يجب أن تكون الوسوم:
        - دقيقة وذات صلة بالمحتوى
        - مكتوبة بالعربية الفصحى
        - تغطي الجوانب التقنية الرئيسية
        - مناسبة للمتخصصين واصحاب القرار
        - قصيرة وواضحة (كلمة واحدة أو كلمتين كحد أقصى)
        `

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد خبير في تحليل المحتوى التقني واستخراج الكلمات المفتاحية باللغة العربية. متخصص في تحديد المفاهيم التقنية الهامة في المقالات.'
            },
            {
              role: 'user',
              content: taggingPrompt
            }
          ],
          temperature: 0.5,
          max_tokens: 200
        })

        const tagsContent = completion.choices[0]?.message?.content

        if (!tagsContent) {
          throw new Error('فشل في استخراج الوسوم')
        }

        // Parse the tags
        const suggestedTags = tagsContent
          .split('\n')
          .map(tag => tag.trim().replace(/^[-•\d.\s]+/, ''))
          .filter(tag => tag.length > 0 && tag.length < 50)

        // Combine AI suggestions with predefined tags
        const allTags = [...new Set([...suggestedTags, ...TECH_TAGS])]

        // Find matching tags in database or create new ones
        const processedTags = []
        for (const tagName of allTags.slice(0, 8)) {
          try {
            let tag = await db.tag.findFirst({
              where: { name: tagName }
            })

            if (!tag && suggestedTags.includes(tagName)) {
              tag = await db.tag.create({
                data: {
                  name: tagName,
                  description: `وسم تلقائي للمقال: ${article.title}`
                }
              })
            }

            if (tag) {
              processedTags.push(tag)
            }
          } catch (error) {
            console.error(`Error processing tag ${tagName}:`, error)
          }
        }

        // Remove existing tags
        await db.newsTag.deleteMany({
          where: { articleId: article.id }
        })

        // Add new tags
        for (const tag of processedTags) {
          await db.newsTag.create({
            data: {
              articleId: article.id,
              tagId: tag.id
            }
          })
        }

        processedCount++

        // Log success
        await db.processingLog.create({
          data: {
            action: 'tag',
            status: 'success',
            message: `Batch tagged article: ${article.title}`,
            metadata: JSON.stringify({
              articleId: article.id,
              tags: processedTags.map(t => t.name)
            })
          }
        })
      } catch (error) {
        console.error(`Error tagging article ${article.id}:`, error)
        
        // Log error
        await db.processingLog.create({
          data: {
            action: 'tag',
            status: 'error',
            message: `Batch tag failed: ${error}`,
            metadata: JSON.stringify({
              articleId: article.id
            })
          }
        })
      }
    }

    return NextResponse.json({
      message: 'تمت معالجة دفعة التصنيف',
      processed: processedCount,
      total: articles.length
    })
  } catch (error) {
    console.error('Error in batch tag:', error)
    return NextResponse.json(
      { error: 'فشل في معالجة دفعة التصنيف' },
      { status: 500 }
    )
  }
}