'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap,
  BarChart3,
  Target,
  Globe,
  Award,
  Crown,
  Sparkles,
  Mail,
  Play,
  ChevronDown,
  Lightbulb,
  Database,
  Smartphone,
  Settings,
  Eye,
  ThumbsUp,
  Heart,
  Rocket,
  Brain
} from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('features')

  const stats = [
    { label: 'مشترك نشط', value: '10,000+', icon: Users },
    { label: 'ملخص يومي', value: '500+', icon: BarChart3 },
    { label: 'مصدر موثوق', value: '50+', icon: Shield },
    { label: 'دقة الملخصات', value: '95%', icon: Target }
  ]

  const features = [
    {
      title: 'ملخصات ذكية بالذكاء الاصطناعي',
      description: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل المقالات الطويلة وتقديم ملخصات دقيقة وواضحة في ثوانٍ',
      icon: Brain,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'مصادر متنوعة وموثوقة',
      description: 'نختار أفضل المصادر التقنية العالمية مثل TechCrunch, Wired, The Verge وغيرها لضمان جودة المحتوى',
      icon: Globe,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'تحديثات فورية',
      description: 'احصل على أحدث الأخبار التقنية فور صدورها، مع تحديثات مستمرة على مدار الساعة',
      icon: Zap,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'رؤى تحليلية متقدمة',
      description: 'نقدم تحليلات عميقة ورؤى استراتيجية تساعدك في اتخاذ قرارات تقنية مدروسة',
      icon: Lightbulb,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'تخصيص حسب الاهتمامات',
      description: 'خصص تجربتك باختيار المواضيع التي تهمك واحصل على محتوى مخصص يناسب احتياجاتك',
      icon: Settings,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'وصول من أي جهاز',
      description: 'اقرأ ملخصاتك من أي جهاز - كمبيوتر، هاتف، أو تابلت - مع واجهة متجاوبة وسهلة الاستخدام',
      icon: Smartphone,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const testimonials = [
    {
      name: 'أحمد محمد',
      position: 'مدير تقني في شركة التقنية المتقدمة',
      content: 'ملخص التقنية غير طريقة عملي في متابعة الأخبار التقنية. أوفر وقتاً كبيراً وأحصل على المعلومات المهمة فقط. خدمة ممتازة!',
      rating: 5,
      avatar: 'أحمد'
    },
    {
      name: 'سارة علي',
      position: 'مستشارة تقنية في مؤسسة الاستشارات التقنية',
      content: 'الرؤى التحليلية ممتازة وتساعدني في تقديم نصائح دقيقة لعملائي. أفضل خدمة في مجال الأخبار التقنية.',
      rating: 5,
      avatar: 'سارة'
    },
    {
      name: 'محمد خالد',
      position: 'رئيس قسم التطوير في بنك الأمل',
      content: 'جودة المحتوى ودقة الملخصات تتجاوز التوقعات. أوصي بشدة لكل العاملين في القطاع التقني.',
      rating: 5,
      avatar: 'محمد'
    }
  ]

  const pricing = [
    {
      name: 'مجاني',
      price: '0',
      period: 'شهرياً',
      description: 'ابدأ مجاناً بدون أي التزامات',
      features: [
        '5 ملخصات يومية',
        'مصادر أساسية',
        'تحديثات يومية',
        'وصول إلى الأخبار العامة'
      ],
      cta: 'ابدأ مجاناً',
      popular: false
    },
    {
      name: 'بريميوم',
      price: '29',
      period: 'شهرياً',
      description: 'للمحترفين الذين يريدون الأفضل',
      features: [
        'ملخصات غير محدودة',
        'جميع المصادر المتقدمة',
        'تحديثات فورية',
        'رؤى تحليلية متقدمة',
        'تطبيق ويب وموبايل',
        'دعم فني متميز',
        'تقارير أسبوعية'
      ],
      cta: 'ابدأ التجربة المجانية',
      popular: true
    },
    {
      name: 'مؤسسي',
      price: '99',
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
        'SLA مضمون'
      ],
      cta: 'تواصل مع المبيعات',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'كيف يعمل ملخص التقنية؟',
      answer: 'نستخدم خوارزميات الذكاء الاصطناعي المتقدمة لتحليل المقالات التقنية الطويلة واستخلاص النقاط الرئيسية. يقوم نظامنا بفهم المحتوى، تحديد المعلومات الهامة، وإنشاء ملخصات واضحة وموجزة باللغة العربية.'
    },
    {
      question: 'ما هي المصادر التي تستخدمونها؟',
      answer: 'نحن نتعامل مع أفضل المصادر التقنية العالمية مثل TechCrunch, Wired, The Verge, Ars Technica, MIT Technology Review وغيرها. نختار المصادر بعناية لضمان جودة وموثوقية المحتوى.'
    },
    {
      question: 'هل يمكنني تخصيص المواضيع التي أتابعها؟',
      answer: 'نعم! يمكنك اختيار المواضيع التي تهمك مثل الذكاء الاصطناعي، الأمن السيبراني، الحوسبة السحابية، تطوير البرمجيات، وغيرها. سيقوم نظامنا بتخصيص المحتوى حسب اهتماماتك.'
    },
    {
      question: 'كم مرة يتم تحديث المحتوى؟',
      answer: 'يتم تحديث المحتوى بشكل مستمر على مدار الساعة. نقدم ملخصات يومية لأحدث الأخبار، مع إمكانية الحصول على تحديثات فورية للأخبار العاجلة والمهمة.'
    },
    {
      question: 'هل هناك تطبيق موبايل متاح؟',
      answer: 'نعم، نقدم تطبيق ويب متجاوب يعمل بشكل ممتاز على جميع الأجهزة بما فيها الهواتف الذكية. كما أننا نخطط لإطلاق تطبيقات أصلية قريباً.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('شكراً لاهتمامك! سنتواصل معك قريباً.')
      setEmail('')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b">
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
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">المميزات</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">الأسعار</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">آراء العملاء</a>
              <Button onClick={() => window.location.href = '/subscribe'} className="bg-blue-600 hover:bg-blue-700">
                ابدأ مجاناً
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
            >
              <span className="sr-only">القائمة</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
              <Rocket className="w-4 h-4 ml-2" />
              الجيل القادم من ملخصات الأخبار التقنية
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              احصل على ملخصات الأخبار التقنية
              <span className="block text-blue-600">بدقة واحترافية</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              نحوّل الأخبار التقنية المعقدة إلى ملخصات واضحة ومفيدة للمتخصصين واصحاب القرار. وفر وقتك وركز على ما يهم حقاً.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold h-14"
                onClick={() => window.location.href = '/subscribe'}
              >
                ابدأ تجربتك المجانية
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold h-14"
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 mr-2" />
                شاهد الفيديو التوضيحي
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">شاهد كيف يعمل ملخص التقنية</h2>
            <p className="text-xl text-gray-600 mb-12">
              في دقيقتين فقط، اكتشف كيف يمكن لمنصتنا أن تغير طريقة متابعتك للأخبار التقنية
            </p>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-lg">فيديو توضيحي لمنصة ملخص التقنية</p>
                  <p className="text-gray-400 mt-2">اضغط للتشغيل</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">مميزات استثنائية تناسب احتياجاتك</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              صممنا منصتنا لتكون الأفضل في مجال تلخيص الأخبار التقنية. اكتشف المميزات التي تجعلنا الخيار الأول للمحترفين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">كيف يعمل ملخص التقنية؟</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              عملية بسيطة وفعالة تضمن لك الحصول على أفضل ملخصات الأخبار التقنية
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'جمع الأخبار',
                  description: 'نجمع أحدث الأخبار من أفضل المصادر التقنية العالمية الموثوقة',
                  icon: Globe
                },
                {
                  step: '2',
                  title: 'تحليل بالذكاء الاصطناعي',
                  description: 'نستخدم خوارزميات متقدمة لتحليل المحتوى واستخلاص النقاط الرئيسية',
                  icon: Brain
                },
                {
                  step: '3',
                  title: 'تقديم الملخصات',
                  description: 'نقدم لك ملخصات واضحة وموجزة باللغة العربية في الوقت المناسب',
                  icon: Eye
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <Badge className="bg-blue-600 text-white border-0 text-lg px-3 py-1">
                        {step.step}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300 transform translate-x-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">ماذا يقول عملاؤنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              آراء عملائنا من مختلف القطاعات والمناصب الذين اختبروا خدمتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic text-lg">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 text-lg">{testimonial.name}</h5>
                      <p className="text-gray-600">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">اختر الخطة المناسبة لك</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              خطط مرنة تناسب جميع الاحتياجات، من الأفراد إلى المؤسسات الكبيرة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 text-sm font-semibold">
                    الأكثر شعبية
                  </div>
                )}
                
                <CardHeader className={`text-center pb-8 ${plan.popular ? 'pt-12' : 'pt-8'}`}>
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
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => window.location.href = '/subscribe'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">أسئلة شائعة</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              إجابات للأسئلة الأكثر شيوعاً حول خدمتنا
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">هل أنت مستعد للبدء؟</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المحترفين الذين يثقون بنا وابدأ رحلتك مع ملخصات الأخبار التقنية اليوم
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold h-14"
              onClick={() => window.location.href = '/subscribe'}
            >
              ابدأ تجربتك المجانية
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold h-14"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              عرض الخطط والأسعار
            </Button>
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70"
                required
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'اشترك'}
              </Button>
            </form>
            <p className="text-sm text-blue-200 mt-2">
              اشترك في نشرتنا البريدية واحصل على نصائح حصرية
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">ملخص التقنية</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                خدمة تلخيص الأخبار التقنية للمتخصصين واصحاب القرار باستخدام أحدث تقنيات الذكاء الاصطناعي
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">المنتج</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">المميزات</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">الأسعار</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الشهادات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">الشركة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors">المدونة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الوظائف</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">قانوني</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">شروط الخدمة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سياسة ملفات تعريف الارتباط</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 ملخص التقنية. جميع الحقوق محفوظة. | 
              صنع بـ ❤️ في العالم العربي
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}