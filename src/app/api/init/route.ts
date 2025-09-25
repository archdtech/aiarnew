import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Initial data to seed the database
const INITIAL_SOURCES = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com',
    rssUrl: 'https://techcrunch.com/feed/',
    description: 'أحد أشهر مصادر أخبار التقنية والشركات الناشئة'
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com',
    rssUrl: 'https://www.wired.com/feed/rss',
    description: 'مصدر موثوق لأخبار التقنية والثقافة الرقمية'
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com',
    rssUrl: 'https://www.theverge.com/rss/index.xml',
    description: 'أخبار التقنية والمراجعات والتحليلات'
  },
  {
    name: 'Ars Technica',
    url: 'https://arstechnica.com',
    rssUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    description: 'أخبار التقنية المتعمقة والتحليلات التقنية'
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com',
    rssUrl: 'https://www.technologyreview.com/feed/',
    description: 'مجلة تقنية من معهد ماساتشوستس للتكنولوجيا'
  }
]

const INITIAL_CATEGORIES = [
  { name: 'ذكاء اصطناعي', description: 'أخبار وتطورات الذكاء الاصطناعي والتعلم الآلي', color: '#8B5CF6' },
  { name: 'تقنية', description: 'أحدث الأخبار التقنية والتطورات', color: '#3B82F6' },
  { name: 'تطوير', description: 'أخبار تطوير البرمجيات والتطبيقات', color: '#10B981' },
  { name: 'أمن سيبراني', description: 'أخبار الأمن السيبراني والتهديدات الرقمية', color: '#EF4444' },
  { name: 'إدارة', description: 'أخبار إدارة التقنية والتحول الرقمي', color: '#F59E0B' },
  { name: 'سوق', description: 'أخبار السوق التقني والاستثمارات', color: '#06B6D4' },
  { name: 'ابتكار', description: 'الابتكارات التقنية والأفكار الجديدة', color: '#EC4899' },
  { name: 'شركات', description: 'أخبار الشركات التقنية الكبرى', color: '#6366F1' }
]

const INITIAL_TAGS = [
  { name: 'ذكاء اصطناعي', description: 'الذكاء الاصطناعي وتطبيقاته' },
  { name: 'تعلم آلي', description: 'التعلم الآلي والخوارزميات' },
  { name: 'تعلم عميق', description: 'الشبكات العصبية والتعلم العميق' },
  { name: 'شبكات عصبية', description: 'الشبكات العصبية والمعالجة الذكية' },
  { name: 'معالجة اللغات الطبيعية', description: 'معالجة اللغات الطبيعية وفهم النص' },
  { name: 'رؤية حاسوبية', description: 'الرؤية الحاسوبية وتحليل الصور' },
  { name: 'روبوتات', description: 'الروبوتات والأتمتة' },
  { name: 'أتمتة', description: 'الأتمتة والأنظمة الذكية' },
  { name: 'تحليلات', description: 'تحليلات البيانات والاستدلال' },
  { name: 'بيانات ضخمة', description: 'البيانات الضخمة ومعالجتها' },
  { name: 'سحابة', description: 'الحوسبة السحابية والخدمات' },
  { name: 'حوسبة سحابية', description: 'الحوسبة السحابية والبنية التحتية' },
  { name: 'أمن سيبراني', description: 'الأمن السيبراني والحماية' },
  { name: 'أمن المعلومات', description: 'أمن المعلومات وحماية البيانات' },
  { name: 'تشفير', description: 'التشفير والأمان الرقمي' },
  { name: 'خصوصية', description: 'الخصوصية وحماية البيانات الشخصية' },
  { name: 'بلوك تشين', description: 'تقنية البلوك تشين والعملات الرقمية' },
  { name: 'عملات رقمية', description: 'العملات الرقمية والتشفير' },
  { name: 'ويب 3', description: 'ويب 3 والإنترنت اللامركزي' },
  { name: 'ميتافيرس', description: 'الميتافيرس والعوالم الافتراضية' },
  { name: 'واقع افتراضي', description: 'الواقع الافتراضي وتطبيقاته' },
  { name: 'واقع معزز', description: 'الواقع المعزز والتجارب المختلطة' },
  { name: 'إنترنت الأشياء', description: 'إنترنت الأشياء والأجهزة الذكية' },
  { name: '5G', description: 'شبكات 5G والاتصالات السريعة' },
  { name: 'اتصالات', description: 'الاتصالات وتقنيات الشبكات' },
  { name: 'تطوير برمجيات', description: 'تطوير البرمجيات والهندسة' },
  { name: 'برمجة', description: 'البرمجة ولغات التطوير' },
  { name: 'واجهات أمامية', description: 'تطوير الواجهات الأمامية' },
  { name: 'واجهات خلفية', description: 'تطوير الواجهات الخلفية' },
  { name: 'تطبيقات', description: 'تطبيقات الموبايل والويب' },
  { name: 'موبايل', description: 'تطبيقات الموبايل والأجهزة المحمولة' },
  { name: 'ويب', description: 'تطوير الويب والتطبيقات' },
  { name: 'قواعد بيانات', description: 'قواعد البيانات وإدارتها' },
  { name: 'خوادم', description: 'الخوادم والبنية التحتية' },
  { name: 'بنية تحتية', description: 'البنية التحتية التقنية' },
  { name: 'ديف أوبس', description: 'الديف أوبس والتشغيل الآلي' },
  { name: 'تشغيل', description: 'تشغيل الأنظمة والصيانة' },
  { name: 'اختبار', description: 'اختبار البرمجيات والجودة' },
  { name: 'جودة', description: 'جودة البرمجيات والمعايير' },
  { name: 'ابتكار', description: 'الابتكار والأفكار الجديدة' },
  { name: 'نماذج أعمال', description: 'نماذج الأعمال التجارية' },
  { name: 'تحول رقمي', description: 'التحول الرقمي والتطوير' },
  { name: 'استراتيجية', description: 'الاستراتيجيات والتخطيط' },
  { name: 'قيادة', description: 'القيادة والإدارة' },
  { name: 'إدارة', description: 'إدارة المشاريع والفرق' },
  { name: 'استثمار', description: 'الاستثمار التقني والتمويل' },
  { name: 'تمويل', description: 'التمويل والموارد المالية' },
  { name: 'شركات ناشئة', description: 'الشركات الناشئة والريادة' },
  { name: 'تمويل جماعي', description: 'التمويل الجماعي والمشاريع' },
  { name: 'اكتتابات', description: 'الاكتتابات العامة والأسواق' },
  { name: 'استحواذ', description: 'الاستحواذ والاندماجات' },
  { name: 'اندماج', description: 'الاندماج والتحالفات' },
  { name: 'منافسة', description: 'المنافسة والسوق' },
  { name: 'سوق', description: 'السوق والتطورات' },
  { name: 'عملاء', description: 'العملاء والخدمات' },
  { name: 'منتجات', description: 'المنتجات والخدمات' },
  { name: 'خدمات', description: 'الخدمات والحلول' },
  { name: 'تكنولوجيا مالية', description: 'التكنولوجيا المالية والخدمات' },
  { name: 'تجارة إلكترونية', description: 'التجارة الإلكترونية والتسوق' },
  { name: 'تعليم', description: 'التعليم التقني والتدريب' },
  { name: 'صحة', description: 'التكنولوجيا الصحية والرعاية' },
  { name: 'نقل', description: 'تكنولوجيا النقل والمواصلات' },
  { name: 'طاقة', description: 'تكنولوجيا الطاقة والاستدامة' },
  { name: 'تصنيع', description: 'تكنولوجيا التصنيع والإنتاج' },
  { name: 'زراعة', description: 'التكنولوجيا الزراعية والغذاء' },
  { name: 'مدن ذكية', description: 'المدن الذكية والحلول' },
  { name: 'استدامة', description: 'الاستدامة والبيئة' },
  { name: 'بيئة', description: 'البيئة والتكنولوجيا الخضراء' },
  { name: 'مناخ', description: 'تغير المناخ والحلول التقنية' },
  { name: 'تنظيم', description: 'التنظيم والتشريعات' },
  { name: 'سياسات', description: 'السياسات التقنية والحكومية' },
  { name: 'أخلاقيات', description: 'أخلاقيات التكنولوجيا والمسؤولية' },
  { name: 'مجتمع', description: 'المجتمع والتأثير الاجتماعي' },
  { name: 'توظيف', description: 'توظيف والمواهب التقنية' },
  { name: 'مهارات', description: 'المهارات والتطوير المهني' },
  { name: 'تدريب', description: 'التدريب والتعليم المستمر' },
  { name: 'تعليم', description: 'التعليم والتكنولوجيا' },
  { name: 'بحث', description: 'البحث والتطوير' },
  { name: 'تطوير', description: 'التطوير والابتكار' },
  { name: 'ابتكار', description: 'الابتكار والإبداع' },
  { name: 'براءات اختراع', description: 'براءات الاختراع والملكية' },
  { name: 'ملكية فكرية', description: 'الملكية الفكرية والحقوق' },
  { name: 'معايير', description: 'المعايير والمواصفات' },
  { name: 'توافقية', description: 'التوافقية والمعايير' },
  { name: 'جودة', description: 'الجودة والمعايير' },
  { name: 'أداء', description: 'الأداء والكفاءة' },
  { name: 'كفاءة', description: 'الكفاءة والإنتاجية' },
  { name: 'إنتاجية', description: 'الإنتاجية والأداء' },
  { name: 'تجربة مستخدم', description: 'تجربة المستخدم والتصميم' },
  { name: 'تصميم', description: 'التصميم والواجهات' },
  { name: 'واجهة', description: 'الواجهات والتفاعل' },
  { name: 'تفاعل', description: 'التفاعل وتجربة المستخدم' },
  { name: 'إمكانية وصول', description: 'إمكانية الوصول والشمول' },
  { name: 'تعددية', description: 'التعددية والتنوع' },
  { name: 'توطين', description: 'التوطين والتكيف' },
  { name: 'عولمة', description: 'العولمة والتوسع' },
  { name: 'ثقافة', description: 'الثقافة والقيم' },
  { name: 'تنوع', description: 'التنوع والشمول' },
  { name: 'شمولية', description: 'الشمولية والمساواة' },
  { name: 'مسؤولية اجتماعية', description: 'المسؤولية الاجتماعية والتأثير' },
  { name: 'حوكمة', description: 'الحوكمة والشفافية' },
  { name: 'شفافية', description: 'الشفافية والإفصاح' },
  { name: 'ثقة', description: 'الثقة والموثوقية' },
  { name: 'أمان', description: 'الأمان والحماية' },
  { name: 'موثوقية', description: 'الموثوقية والاستقرار' },
  { name: 'مرونة', description: 'المرونة والتكيف' },
  { name: 'توسع', description: 'التوسع والنمو' },
  { name: 'صيانة', description: 'الصيانة والدعم' },
  { name: 'تحديث', description: 'التحديثات والتطوير' },
  { name: 'ترقية', description: 'الترقيات والتحسينات' },
  { name: 'هجرة', description: 'الهجرة والانتقال' },
  { name: 'تكامل', description: 'التكامل والترابط' },
  { name: 'توافق', description: 'التوافق والتشغيل' },
  { name: 'معايير مفتوحة', description: 'المعايير المفتوحة والمصادر' },
  { name: 'مصادر مفتوحة', description: 'المصادر المفتوحة والمجتمعات' },
  { name: 'تعاون', description: 'التعاون والشراكات' },
  { name: 'مجتمع', description: 'المجتمع والمشاركة' },
  { name: 'نظام بيئي', description: 'النظام البيئي والشبكات' },
  { name: 'شراكات', description: 'الشراكات والتحالفات' },
  { name: 'شبكات', description: 'الشبكات والاتصالات' },
  { name: 'اتصالات', description: 'الاتصالات والتواصل' },
  { name: 'تعاون عن بعد', description: 'التعاون عن بعد والعمل' },
  { name: 'عمل هجين', description: 'العمل الهجين والمرونة' },
  { name: 'مرونة', description: 'المرونة والتكيف' },
  { name: 'استمرارية', description: 'استمرارية الأعمال والتعافي' },
  { name: 'تعافي', description: 'التعافي والاستعادة' },
  { name: 'تخطيط', description: 'التخطيط والاستراتيجية' },
  { name: 'إدارة مخاطر', description: 'إدارة المخاطر والتحليل' },
  { name: 'امتثال', description: 'الامتثال والقوانين' },
  { name: 'مراجعة', description: 'المراجعة والتدقيق' },
  { name: 'رقابة', description: 'الرقابة والإشراف' },
  { name: 'جودة', description: 'الجودة والمعايير' },
  { name: 'تحسين', description: 'التحسين والتطوير' },
  { name: 'تحسين مستمر', description: 'التحسين المستمر والتطوير' },
  { name: 'رشيق', description: 'المنهجيات الرشيقة' },
  { name: 'رشاقة', description: 'الرشاقة والمرونة' },
  { name: 'تسليم', description: 'التسليم والقيمة' },
  { name: 'قيمة', description: 'القيمة والعائد' },
  { name: 'عملاء', description: 'العملاء والرضا' },
  { name: 'رضا', description: 'رضا العملاء والولاء' },
  { name: 'ولاء', description: 'ولاء العملاء والاحتفاظ' },
  { name: 'احتفاظ', description: 'احتفاظ العملاء والنمو' },
  { name: 'اكتساب', description: 'اكتساب العملاء والتسويق' },
  { name: 'تسويق', description: 'التسويق والترويج' },
  { name: 'مبيعات', description: 'المبيعات والإيرادات' },
  { name: 'دعم', description: 'الدعم والخدمات' },
  { name: 'خدمة', description: 'الخدمة والدعم' },
  { name: 'تجربة', description: 'التجربة والرحلة' },
  { name: 'رحلة', description: 'رحلة العميل والتجربة' },
  { name: 'لمسات', description: 'اللمسات النهائية والجودة' },
  { name: 'تفاصيل', description: 'التفاصيل والدقة' },
  { name: 'جودة', description: 'الجودة والإتقان' },
  { name: 'تميز', description: 'التميز والتفوق' },
  { name: 'قيادة', description: 'القيادة والتوجيه' },
  { name: 'رؤية', description: 'الرؤية والتطلعات' },
  { name: 'مهمة', description: 'المهمة والأهداف' },
  { name: 'قيم', description: 'القيم والمبادئ' },
  { name: 'ثقافة', description: 'الثقافة والبيئة' },
  { name: 'فرق', description: 'الفرق والتعاون' },
  { name: 'تعاون', description: 'التعاون والعمل الجماعي' },
  { name: 'تواصل', description: 'التواصل والشفافية' },
  { name: 'شفافية', description: 'الشفافية والوضوح' },
  { name: 'مساءلة', description: 'المساءلة والمسؤولية' },
  { name: 'تمكين', description: 'التمكين والصلاحيات' },
  { name: 'تطوير', description: 'التطوير والنمو' },
  { name: 'تعلم', description: 'التعلم والتدريب' },
  { name: 'نمو', description: 'النمو والتطور' },
  { name: 'تطور', description: 'التطور والتقدم' },
  { name: 'تحديات', description: 'التحديات والمصاعب' },
  { name: 'فرص', description: 'الفرص والإمكانيات' },
  { name: 'مخاطر', description: 'المخاطر والتهديدات' },
  { name: 'تهديدات', description: 'التهديدات والمخاطر' },
  { name: 'نقاط قوة', description: 'نقاط القوة والمزايا' },
  { name: 'نقاط ضعف', description: 'نقاط الضعف والتحديات' },
  { name: 'تحليل', description: 'التحليل والتقييم' },
  { name: 'تقييم', description: 'التقييم والقياس' },
  { name: 'قرارات', description: 'القرارات والاختيارات' },
  { name: 'استراتيجيات', description: 'الاستراتيجيات والخطط' },
  { name: 'خطط', description: 'الخطط والبرامج' },
  { name: 'أهداف', description: 'الأهداف والغايات' },
  { name: 'مؤشرات', description: 'المؤشرات والقياسات' },
  { name: 'قياس', description: 'القياس والتقييم' },
  { name: 'تحليل', description: 'التحليل والاستدلال' },
  { name: 'تقارير', description: 'التقارير والمعلومات' },
  { name: 'رؤى', description: 'الرؤى والاستنتاجات' },
  { name: 'تنبؤات', description: 'التنبؤات والتوقعات' },
  { name: 'توقعات', description: 'التوقعات والتخطيط' },
  { name: 'اتجاهات', description: 'الاتجاهات والتطورات' },
  { name: 'مستقبل', description: 'المستقبل والتطلعات' },
  { name: 'تكنولوجيا', description: 'التكنولوجيا والابتكار' },
  { name: 'ابتكار', description: 'الابتكار والإبداع' },
  { name: 'تغيير', description: 'التغيير والتحول' },
  { name: 'تحول', description: 'التحول والتطوير' },
  { name: 'ثورة', description: 'الثورات التقنية' },
  { name: 'تطور', description: 'التطور والنمو' },
  { name: 'نمو', description: 'النمو والتوسع' },
  { name: 'توسع', description: 'التوسع والانتشار' },
  { name: 'انتشار', description: 'الانتشار والتبني' },
  { name: 'تبني', description: 'التبني والتقبل' },
  { name: 'تقبل', description: 'التقبل والاستجابة' },
  { name: 'مقاومة', description: 'المقاومة والتحديات' },
  { name: 'تحديات', description: 'التحديات والصعوبات' },
  { name: 'فرص', description: 'الفرص والإمكانيات' },
  { name: 'مخاطر', description: 'المخاطر والتهديدات' },
  { name: 'تهديدات', description: 'التهديدات والمخاطر' },
  { name: 'نقاط قوة', description: 'نقاط القوة والمزايا' },
  { name: 'نقاط ضعف', description: 'نقاط الضعف والتحديات' },
  { name: 'تحليل', description: 'التحليل والتقييم' },
  { name: 'تقييم', description: 'التقييم والقياس' },
  { name: 'قرارات', description: 'القرارات والاختيارات' },
  { name: 'استراتيجيات', description: 'الاستراتيجيات والخطط' },
  { name: 'خطط', description: 'الخطط والبرامج' },
  { name: 'أهداف', description: 'الأهداف والغايات' },
  { name: 'مؤشرات', description: 'المؤشرات والقياسات' },
  { name: 'قياس', description: 'القياس والتقييم' },
  { name: 'تحليل', description: 'التحليل والاستدلال' },
  { name: 'تقارير', description: 'التقارير والمعلومات' },
  { name: 'رؤى', description: 'الرؤى والاستنتاجات' },
  { name: 'تنبؤات', description: 'التنبؤات والتوقعات' },
  { name: 'توقعات', description: 'التوقعات والتخطيط' },
  { name: 'اتجاهات', description: 'الاتجاهات والتطورات' },
  { name: 'مستقبل', description: 'المستقبل والتطلعات' }
]

export async function GET() {
  try {
    // Check if system is already initialized
    const sourcesCount = await db.newsSource.count()
    const categoriesCount = await db.category.count()
    const tagsCount = await db.tag.count()
    const articlesCount = await db.newsArticle.count()

    const isInitialized = sourcesCount > 0 && categoriesCount > 0 && tagsCount > 0

    return NextResponse.json({
      isInitialized,
      counts: {
        sources: sourcesCount,
        categories: categoriesCount,
        topics: tagsCount,
        articles: articlesCount
      }
    })
  } catch (error) {
    console.error('Error checking initialization:', error)
    return NextResponse.json(
      { error: 'فشل في فحص حالة التهيئة' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    let createdSources = 0
    let createdCategories = 0
    let createdTags = 0

    // Create initial sources
    for (const sourceData of INITIAL_SOURCES) {
      try {
        const existingSource = await db.newsSource.findFirst({
          where: { name: sourceData.name }
        })

        if (!existingSource) {
          await db.newsSource.create({
            data: sourceData
          })
          createdSources++
        }
      } catch (error) {
        console.error(`Error creating source ${sourceData.name}:`, error)
      }
    }

    // Create initial categories
    for (const categoryData of INITIAL_CATEGORIES) {
      try {
        const existingCategory = await db.category.findFirst({
          where: { name: categoryData.name }
        })

        if (!existingCategory) {
          await db.category.create({
            data: categoryData
          })
          createdCategories++
        }
      } catch (error) {
        console.error(`Error creating category ${categoryData.name}:`, error)
      }
    }

    // Create initial tags
    for (const tagData of INITIAL_TAGS) {
      try {
        const existingTag = await db.tag.findFirst({
          where: { name: tagData.name }
        })

        if (!existingTag) {
          await db.tag.create({
            data: tagData
          })
          createdTags++
        }
      } catch (error) {
        console.error(`Error creating tag ${tagData.name}:`, error)
      }
    }

    // Log the initialization
    await db.processingLog.create({
      data: {
        action: 'init',
        status: 'success',
        message: `System initialized: ${createdSources} sources, ${createdCategories} categories, ${createdTags} tags`,
        metadata: JSON.stringify({
          createdSources,
          createdCategories,
          createdTags
        })
      }
    })

    return NextResponse.json({
      message: 'تم تهيئة النظام بنجاح',
      created: {
        sources: createdSources,
        categories: createdCategories,
        tags: createdTags
      }
    })
  } catch (error) {
    console.error('Error initializing system:', error)
    
    // Log the error
    try {
      await db.processingLog.create({
        data: {
          action: 'init',
          status: 'error',
          message: `Failed to initialize system: ${error}`
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'فشل في تهيئة النظام' },
      { status: 500 }
    )
  }
}