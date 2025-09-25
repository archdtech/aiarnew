import { db } from '@/lib/db'

async function main() {
  console.log('Seeding database...')

  // Create categories
  const categories = [
    { name: 'ذكاء اصطناعي', description: 'أخبار وتطورات الذكاء الاصطناعي' },
    { name: 'تقنية', description: 'أخبار التقنية العامة' },
    { name: 'تطوير', description: 'تطوير البرمجيات والأدوات' },
    { name: 'إدارة', description: 'إدارة المشاريع والتقنية' },
    { name: 'أمن سيبراني', description: 'الأمن السيبراني والخصوصية' },
    { name: 'سحابة', description: 'الحوسبة السحابية والبنية التحتية' }
  ]

  for (const category of categories) {
    await db.category.upsert({
      where: { name: category.name },
      update: category,
      create: category
    })
  }

  // Create news sources
  const sources = [
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      rssUrl: 'https://techcrunch.com/feed/',
      description: 'أخبار التقنية والشركات الناشئة'
    },
    {
      name: 'Wired',
      url: 'https://www.wired.com',
      rssUrl: 'https://www.wired.com/feed/rss',
      description: 'التقنية والثقافة والسياسة'
    },
    {
      name: 'The Verge',
      url: 'https://www.theverge.com',
      rssUrl: 'https://www.theverge.com/rss/index.xml',
      description: 'التقنية والعلوم والفن والثقافة'
    },
    {
      name: 'Ars Technica',
      url: 'https://arstechnica.com',
      rssUrl: 'https://feeds.arstechnica.com/arstechnica/index',
      description: 'أخبار التقنية المتعمقة'
    },
    {
      name: 'MIT Technology Review',
      url: 'https://www.technologyreview.com',
      rssUrl: 'https://www.technologyreview.com/feed/',
      description: 'تقنيات المستقبل من معهد ماساتشوستس'
    }
  ]

  for (const source of sources) {
    await db.newsSource.upsert({
      where: { url: source.url },
      update: source,
      create: source
    })
  }

  // Create some initial tags
  const tags = [
    { name: 'ذكاء اصطناعي', description: 'الذكاء الاصطناعي وتطبيقاته' },
    { name: 'تعلم آلي', description: 'التعلم الآلي والخوارزميات' },
    { name: 'تعلم عميق', description: 'التعلم العميق والشبكات العصبية' },
    { name: 'تطوير برمجيات', description: 'تطوير البرمجيات والأدوات' },
    { name: 'أمن سيبراني', description: 'الأمن السيبراني والتهديدات' },
    { name: 'حوسبة سحابية', description: 'الحوسبة السحابية والخدمات' },
    { name: 'بيانات ضخمة', description: 'البيانات الضخمة والتحليلات' },
    { name: 'إنترنت الأشياء', description: 'إنترنت الأشياء والأجهزة الذكية' },
    { name: 'بلوك تشين', description: 'تقنية البلوك تشين والعملات الرقمية' },
    { name: 'واقع افتراضي', description: 'الواقع الافتراضي والمعزز' }
  ]

  for (const tag of tags) {
    await db.tag.upsert({
      where: { name: tag.name },
      update: tag,
      create: tag
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })