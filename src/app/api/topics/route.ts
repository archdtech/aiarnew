import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// Predefined tech topics in Arabic
const DEFAULT_TOPICS = [
  {
    name: 'الذكاء الاصطناعي',
    description: 'آخر تطورات الذكاء الاصطناعي والتعلم الآلي',
    keywords: ['ذكاء اصطناعي', 'تعلم آلي', 'شبكات عصبية', 'معالجة اللغات الطبيعية', 'رؤية حاسوبية']
  },
  {
    name: 'الأمن السيبراني',
    description: 'أخبار الأمن السيبراني والتهديدات الرقمية',
    keywords: ['أمن سيبراني', 'تهديدات', 'هجمات', 'حماية', 'تشفير', 'خصوصية']
  },
  {
    name: 'الحوسبة السحابية',
    description: 'تطورات الحوسبة السحابية والبنية التحتية',
    keywords: ['سحابة', 'حوسبة سحابية', 'خوادم', 'بنية تحتية', 'أزور', 'AWS', 'جوجل سحابة']
  },
  {
    name: 'تطوير البرمجيات',
    description: 'أدوات وأطر وتقنيات تطوير البرمجيات',
    keywords: ['برمجة', 'تطوير', 'أطر', 'لغات برمجة', 'ديف أوبس', 'جودة']
  },
  {
    name: 'البيانات الضخمة',
    description: 'تحليلات البيانات الضخمة والذكاء التجاري',
    keywords: ['بيانات ضخمة', 'تحليلات', 'ذكاء تجاري', 'استخبارات', 'إحصائيات']
  },
  {
    name: 'إنترنت الأشياء',
    description: 'تطورات إنترنت الأشياء والأجهزة الذكية',
    keywords: ['إنترنت الأشياء', 'أجهزة ذكية', 'استشعارات', 'اتصالات', 'مدن ذكية']
  },
  {
    name: 'البلوك تشين',
    description: 'تقنيات البلوك تشين والعملات الرقمية',
    keywords: ['بلوك تشين', 'عملات رقمية', 'إيثريوم', 'بيتكوين', 'عقود ذكية']
  },
  {
    name: 'الواقع الافتراضي والمعزز',
    description: 'تقنيات الواقع الافتراضي والمعزز والميتافيرس',
    keywords: ['واقع افتراضي', 'واقع معزز', 'ميتافيرس', 'تجربة غامرة', 'سيميوليشن']
  },
  {
    name: 'التقنيات الناشئة',
    description: 'أحدث التقنيات الناشئة والابتكارات',
    keywords: ['تقنيات ناشئة', 'ابتكار', 'بحث', 'تطوير', 'مستقبل']
  },
  {
    name: 'التحول الرقمي',
    description: 'استراتيجيات التحول الرقمي للشركات والمؤسسات',
    keywords: ['تحول رقمي', 'استراتيجية', 'تغيير', 'تطوير', 'إدارة']
  }
]

export async function GET() {
  try {
    // Get all topics
    const topics = await db.topic.findMany({
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // If no topics exist, create default ones
    if (topics.length === 0) {
      for (const topicData of DEFAULT_TOPICS) {
        await db.topic.create({
          data: {
            name: topicData.name,
            description: topicData.description,
            keywords: JSON.stringify(topicData.keywords)
          }
        })
      }
      
      // Fetch again after creating
      const newTopics = await db.topic.findMany({
        include: {
          _count: {
            select: {
              subscriptions: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      return NextResponse.json({
        topics: newTopics.map(topic => ({
          id: topic.id,
          name: topic.name,
          description: topic.description,
          keywords: topic.keywords ? JSON.parse(topic.keywords) : [],
          isActive: topic.isActive,
          subscriberCount: topic._count.subscriptions
        }))
      })
    }

    return NextResponse.json({
      topics: topics.map(topic => ({
        id: topic.id,
        name: topic.name,
        description: topic.description,
        keywords: topic.keywords ? JSON.parse(topic.keywords) : [],
        isActive: topic.isActive,
        subscriberCount: topic._count.subscriptions
      }))
    })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'فشل في جلب المواضيع' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, keywords, autoGenerate } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'اسم الموضوع مطلوب' },
        { status: 400 }
      )
    }

    // Check if topic already exists
    const existingTopic = await db.topic.findFirst({
      where: { name }
    })

    if (existingTopic) {
      return NextResponse.json(
        { error: 'الموضوع موجود بالفعل' },
        { status: 400 }
      )
    }

    let processedKeywords = keywords || []
    
    // If autoGenerate is true, use AI to generate keywords
    if (autoGenerate) {
      const zai = await ZAI.create()
      
      const keywordPrompt = `
      قم بإنشاء قائمة من 5-10 كلمات مفتاحية مناسبة للموضوع التقني التالي:
      
      اسم الموضوع: ${name}
      الوصف: ${description || 'موضوع تقني متخصص'}
      
      يجب أن تكون الكلمات المفتاحية:
      - ذات صلة مباشرة بالموضوع
      - شائعة في مجال التقنية
      - مناسبة للبحث والتصنيف
      - مكتوبة بالعربية الفصحى
      
      قدم الكلمات المفتاحية كقائمة JSON:
      ["كلمة1", "كلمة2", "كلمة3", ...]
      `

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في تحليل المحتوى التقني واستخراج الكلمات المفتاحية باللغة العربية.'
          },
          {
            role: 'user',
            content: keywordPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      })

      const keywordsContent = completion.choices[0]?.message?.content
      
      if (keywordsContent) {
        try {
          const jsonMatch = keywordsContent.match(/\[.*\]/)
          if (jsonMatch) {
            processedKeywords = JSON.parse(jsonMatch[0])
          }
        } catch (error) {
          console.error('Error parsing AI keywords:', error)
        }
      }
    }

    // Create the topic
    const topic = await db.topic.create({
      data: {
        name,
        description: description || `موضوع تقني: ${name}`,
        keywords: JSON.stringify(processedKeywords)
      }
    })

    return NextResponse.json({
      message: 'تم إنشاء الموضوع بنجاح',
      topic: {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        keywords: processedKeywords,
        isActive: topic.isActive
      }
    })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء الموضوع' },
      { status: 500 }
    )
  }
}