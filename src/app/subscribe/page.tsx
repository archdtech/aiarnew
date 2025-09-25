'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Bell,
  Mail,
  ArrowRight,
  Award,
  Crown,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  Globe,
  Smartphone,
  Database,
  Lightbulb,
  Settings
} from 'lucide-react'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  badge?: string
  color: string
  icon: any
}

interface Topic {
  id: string
  name: string
  description: string
  keywords: string[]
  category: string
}

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'مجاني',
      price: 0,
      period: 'شهرياً',
      description: 'ابدأ رحلتك مع ملخصات الأخبار التقنية',
      features: [
        '5 ملخصات يومية',
        'مصادر أساسية',
        'تحديثات يومية',
        'وصول إلى الأخبار العامة',
        'تطبيق ويب فقط'
      ],
      color: 'from-gray-500 to-gray-600',
      icon: Star
    },
    {
      id: 'premium',
      name: 'بريميوم',
      price: 29,
      period: 'شهرياً',
      description: 'للمحترفين الذين يريدون الأفضل',
      features: [
        'ملخصات غير محدودة',
        'جميع المصادر المتقدمة',
        'تحديثات فورية',
        'رؤى تحليلية متقدمة',
        'تطبيق ويب وموبايل',
        'دعم فني متميز',
        'تقارير أسبوعية',
        'وصول مبكر للمميزات'
      ],
      popular: true,
      badge: 'الأكثر شعبية',
      color: 'from-blue-500 to-purple-600',
      icon: Crown
    },
    {
      id: 'enterprise',
      name: 'مؤسسي',
      price: 99,
      period: 'شهرياً',
      description: 'للفرق والمؤسسات الكبيرة',
      features: [
        'كل مميزات البريميوم',
        'مستخدمين غير محدودين',
        'تخصيص المصادر',
        'تقارير مخصصة',
        'تكامل API',
        'مدير حساب مخصص',
        'تدريب للفريق',
        'SLA مضمون',
        'بيانات تاريخية',
        'تحليلات متقدمة'
      ],
      badge: 'للمؤسسات',
      color: 'from-purple-600 to-pink-600',
      icon: Award
    }
  ]

  const mockTopics: Topic[] = [
    { id: '1', name: 'الذكاء الاصطناعي', description: 'أحدث تطورات الذكاء الاصطناعي والتعلم الآلي', keywords: ['ذكاء اصطناعي', 'تعلم آلي', 'شبكات عصبية'], category: 'تقنية' },
    { id: '2', name: 'الأمن السيبراني', description: 'التهديدات الأمنية وحماية البيانات', keywords: ['أمن سيبراني', 'تهديدات', 'حماية'], category: 'أمن' },
    { id: '3', name: 'الحوسبة السحابية', description: 'خدمات السحابة والبنية التحتية', keywords: ['سحابة', 'خوادم', 'بنية تحتية'], category: 'بنية تحتية' },
    { id: '4', name: 'تطوير البرمجيات', description: 'أدوات وتقنيات التطوير الحديثة', keywords: ['برمجة', 'تطوير', 'أطر'], category: 'تطوير' },
    { id: '5', name: 'البيانات الضخمة', description: 'تحليلات البيانات والذكاء التجاري', keywords: ['بيانات ضخمة', 'تحليلات', 'ذكاء تجاري'], category: 'بيانات' },
    { id: '6', name: 'البلوك تشين', description: 'تقنيات البلوك تشين والعملات الرقمية', keywords: ['بلوك تشين', 'عملات رقمية', 'تمويل لامركزي'], category: 'مالية' },
    { id: '7', name: 'إنترنت الأشياء', description: 'أجهزة IoT والمدن الذكية', keywords: ['إنترنت الأشياء', 'أجهزة ذكية', 'مدن ذكية'], category: 'أجهزة' },
    { id: '8', name: 'الواقع الافتراضي', description: 'VR/AR والميتافيرس', keywords: ['واقع افتراضي', 'واقع معزز', 'ميتافيرس'], category: 'واقع' }
  ]

  useEffect(() => {
    // Simulate fetching topics
    setTopics(mockTopics)
  }, [])

  const toggleTopic = (topicName: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicName) 
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 2000)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'تقنية': 'bg-blue-100 text-blue-800',
      'أمن': 'bg-red-100 text-red-800',
      'بنية تحتية': 'bg-green-100 text-green-800',
      'تطوير': 'bg-purple-100 text-purple-800',
      'بيانات': 'bg-orange-100 text-orange-800',
      'مالية': 'bg-yellow-100 text-yellow-800',
      'أجهزة': 'bg-indigo-100 text-indigo-800',
      'واقع': 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تم الاشتراك بنجاح!</h2>
            <p className="text-gray-600 mb-6">
              شكراً لاشتراكك في {subscriptionPlans.find(p => p.id === selectedPlan)?.name}. 
              ستبدأ في تلقي ملخصات الأخبار قريباً.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ملخص التقنية
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            اختر خطة الاشتراك المناسبة لك
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            انضم إلى آلاف المحترفين الذين يحصلون على ملخصات الأخبار التقنية بدقة واحترافية
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 ml-1" />
              +10,000 مشترك
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="w-4 h-4 ml-1" />
              4.9 تقييم
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="w-4 h-4 ml-1" />
              آمن وموثوق
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Subscription Plans */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">خطط الاشتراك</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اختر الخطة التي تناسب احتياجاتك. يمكنك الترقية أو الإلغاء في أي وقت.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}
                {plan.badge && !plan.popular && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center pb-8 ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                  <div className="w-16 h-16 bg-gradient-to-br mx-auto rounded-2xl flex items-center justify-center mb-4"
                       style={{ background: plan.color }}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'الخطة المحددة' : `اختر ${plan.name}`}
                    {selectedPlan === plan.id && <CheckCircle className="w-5 h-5 mr-2" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Subscription Form */}
        <section className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                أكمل اشتراكك
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                قم بتخصيص اشتراكك ليناسب اهتماماتك وتفضيلاتك
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-right text-base"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    تكرار التلقي
                  </label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يومي - الأفضل للبقاء على اطلاع</SelectItem>
                      <SelectItem value="weekly">أسبوعي - ملخص الأسبوع</SelectItem>
                      <SelectItem value="monthly">شهري - تقرير شامل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Topics */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    المواضيع المفضلة
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {topics.map(topic => (
                      <div 
                        key={topic.id} 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedTopics.includes(topic.name)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleTopic(topic.name)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic.name)}
                            onChange={() => toggleTopic(topic.name)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                              <Badge className={`text-xs ${getCategoryColor(topic.category)}`}>
                                {topic.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {topic.keywords.slice(0, 3).map(keyword => (
                                <span key={keyword} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">ملخص الاشتراك</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">الخطة المختارة:</span>
                      <span className="font-semibold text-gray-900">
                        {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">التكرار:</span>
                      <span className="font-semibold text-gray-900">
                        {frequency === 'daily' ? 'يومي' : frequency === 'weekly' ? 'أسبوعي' : 'شهري'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">المواضيع:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTopics.length} مواضيع مختارة
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">الإجمالي:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${subscriptionPlans.find(p => p.id === selectedPlan)?.price}/{subscriptionPlans.find(p => p.id === selectedPlan)?.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري معالجة الاشتراك...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>أكمل الاشتراك الآن</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">لماذا تختار ملخص التقنية؟</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نقدم لك أفضل تجربة لمتابعة الأخبار التقنية بذكاء وفعالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'سريع ودقيق',
                description: 'ملخصات فورية بدقة عالية باستخدام أحدث تقنيات الذكاء الاصطناعي'
              },
              {
                icon: Shield,
                title: 'مصادر موثوقة',
                description: 'نختار أفضل المصادر التقنية العالمية والموثوقة'
              },
              {
                icon: BarChart3,
                title: 'رؤى تحليلية',
                description: 'تحليلات متقدمة ورؤى تساعدك في اتخاذ القرارات'
              },
              {
                icon: Users,
                title: 'مجتمع محترف',
                description: 'انضم إلى آلاف المحترفين واصحاب القرار'
              },
              {
                icon: Clock,
                title: 'توفير الوقت',
                description: 'وفر وقتك الثمين مع ملخصات شاملة في دقائق'
              },
              {
                icon: Target,
                title: 'مخصص لك',
                description: 'محتوى مخصص حسب اهتماماتك وتخصصك'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white rounded-2xl shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">ماذا يقول عملاؤنا</h3>
            <p className="text-lg text-gray-600">
              آراء عملائنا من مختلف القطاعات والمناصب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'أحمد محمد',
                position: 'مدير تقني',
                company: 'شركة التقنية المتقدمة',
                content: 'ملخص التقنية غير طريقة عملي في متابعة الأخبار التقنية. أوفر وقتاً كبيراً وأحصل على المعلومات المهمة فقط.',
                rating: 5
              },
              {
                name: 'سارة علي',
                position: 'مستشارة تقنية',
                company: 'مؤسسة الاستشارات التقنية',
                content: 'الرؤى التحليلية ممتازة وتساعدني في تقديم نصائح دقيقة لعملائي. أفضل خدمة في مجالها.',
                rating: 5
              },
              {
                name: 'محمد خالد',
                position: 'رئيس قسم التطوير',
                company: 'بنك الأمل',
                content: 'جودة المحتوى ودقة الملخصات تتجاوز التوقعات. أوصي بشدة لكل العاملين في القطاع التقني.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">ملخص التقنية</h3>
            </div>
            <p className="text-gray-400 mb-6">
              مستعد للانضمام إلى آلاف المحترفين الذين يثقون بنا؟
            </p>
            <Button 
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              ابدأ تجربتك المجانية
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}