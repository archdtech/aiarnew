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
  Brain,
  Filter,
  Download,
  Share2,
  Bookmark,
  Bell,
  Search,
  Tag,
  FileText,
  TrendingUpIcon
} from 'lucide-react'

export default function EnglishLandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('features')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    { label: 'Active Subscribers', value: '10,000+', icon: Users },
    { label: 'Daily Summaries', value: '500+', icon: BarChart3 },
    { label: 'Trusted Sources', value: '50+', icon: Shield },
    { label: 'Summary Accuracy', value: '95%', icon: Target }
  ]

  const features = [
    {
      title: 'AI-Powered Intelligent Summarization',
      description: 'We use cutting-edge AI algorithms to analyze long technical articles and deliver accurate, clear summaries in seconds',
      icon: Brain,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Diverse & Reliable Sources',
      description: 'We curate content from the world\'s best technology sources like TechCrunch, Wired, The Verge, and more',
      icon: Globe,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Real-time Updates',
      description: 'Get the latest technology news as it happens, with continuous updates 24/7',
      icon: Zap,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Advanced Analytical Insights',
      description: 'Receive deep analysis and strategic insights to help you make informed technology decisions',
      icon: Lightbulb,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Personalized Experience',
      description: 'Customize your experience by selecting topics that interest you and get tailored content',
      icon: Settings,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Access Anywhere',
      description: 'Read your summaries on any device - computer, phone, or tablet - with a responsive and easy-to-use interface',
      icon: Smartphone,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const testimonials = [
    {
      name: 'Ahmed Mohammed',
      position: 'Technical Director at Advanced Tech Corp',
      content: 'TechSummarizer has transformed how I follow technology news. I save hours daily while getting all the essential information. Excellent service!',
      rating: 5,
      avatar: 'AM'
    },
    {
      name: 'Sarah Ali',
      position: 'Technology Consultant at Digital Insights',
      content: 'The analytical insights are exceptional and help me provide accurate advice to my clients. The best technology news service available.',
      rating: 5,
      avatar: 'SA'
    },
    {
      name: 'Mohammed Khalid',
      position: 'Head of Development at Hope Bank',
      content: 'The content quality and summary accuracy exceed expectations. Highly recommended for anyone working in the tech sector.',
      rating: 5,
      avatar: 'MK'
    }
  ]

  const pricing = [
    {
      name: 'Free',
      price: '0',
      period: 'per month',
      description: 'Start for free with no commitments',
      features: [
        '5 daily summaries',
        'Basic sources',
        'Daily updates',
        'Access to general news'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Premium',
      price: '29',
      period: 'per month',
      description: 'For professionals who want the best',
      features: [
        'Unlimited summaries',
        'All advanced sources',
        'Real-time updates',
        'Advanced analytical insights',
        'Web and mobile apps',
        'Priority support',
        'Weekly reports'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'per month',
      description: 'For large teams and organizations',
      features: [
        'All Premium features',
        'Unlimited users',
        'Custom sources',
        'Custom reports',
        'API integration',
        'Dedicated account manager',
        'Team training',
        'Guaranteed SLA'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'How does TechSummarizer work?',
      answer: 'We use advanced AI algorithms to analyze long technical articles and extract key points. Our system understands content, identifies important information, and creates clear, concise summaries in Arabic.'
    },
    {
      question: 'What sources do you use?',
      answer: 'We work with the best global technology sources including TechCrunch, Wired, The Verge, Ars Technica, MIT Technology Review, and more. We carefully select sources to ensure quality and reliability.'
    },
    {
      question: 'Can I customize the topics I follow?',
      answer: 'Yes! You can choose topics that interest you like Artificial Intelligence, Cybersecurity, Cloud Computing, Software Development, and more. Our system will customize content based on your interests.'
    },
    {
      question: 'How often is content updated?',
      answer: 'Content is updated continuously 24/7. We provide daily summaries of the latest news, with the ability to receive instant updates for breaking and important news.'
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Yes, we offer a responsive web app that works excellently on all devices including smartphones. We are also planning to launch native apps soon.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Thank you for your interest! We\'ll contact you soon.')
      setEmail('')
    }, 2000)
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechSummarizer
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Testimonials
              </button>
              <Button onClick={() => window.location.href = '/subscribe'} className="bg-blue-600 hover:bg-blue-700">
                Start Free
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
            >
              <span className="sr-only">Menu</span>
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
              <Rocket className="w-4 h-4 mr-2" />
              Next-Generation Technology News Summarization
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Get Technology News Summaries
              <span className="block text-blue-600">with Precision & Professionalism</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              We transform complex technical articles into clear, insightful summaries for professionals and decision-makers. Save time and focus on what truly matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold h-14 shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.location.href = '/subscribe'}
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold h-14 border-2 hover:border-blue-300"
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 ml-2" />
                Watch Demo
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">See TechSummarizer in Action</h2>
            <p className="text-xl text-gray-600 mb-12">
              Discover how our platform can transform the way you follow technology news in just 2 minutes
            </p>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-lg">TechSummarizer Platform Demo</p>
                  <p className="text-gray-400 mt-2">Click to play</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Exceptional Features for Your Needs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We designed our platform to be the best in technology news summarization. Discover the features that make us the top choice for professionals
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How TechSummarizer Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple and efficient process that ensures you get the best technology news summaries
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Collect News',
                  description: 'We gather the latest news from the world\'s most trusted technology sources',
                  icon: Globe
                },
                {
                  step: '2',
                  title: 'AI Analysis',
                  description: 'Our advanced AI analyzes content and extracts key information',
                  icon: Brain
                },
                {
                  step: '3',
                  title: 'Deliver Summaries',
                  description: 'We deliver clear, concise summaries in Arabic at the right time',
                  icon: Eye
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-2">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reviews from our customers across different sectors and positions who have experienced our service
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Choose the Right Plan for You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible plans that suit all needs, from individuals to large organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 text-sm font-semibold">
                    Most Popular
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
                    onClick={() => plan.name === 'Enterprise' ? window.location.href = '/contact' : window.location.href = '/subscribe'}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Answers to the most common questions about our service
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
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust us and start your journey with technology news summaries today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold h-14 shadow-lg"
              onClick={() => window.location.href = '/subscribe'}
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold h-14"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Plans & Pricing
            </Button>
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
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
                {isSubmitting ? 'Sending...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-sm text-blue-200 mt-2">
              Subscribe to our newsletter and get exclusive tips
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
                <h3 className="text-xl font-bold">TechSummarizer</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Technology news summarization service for professionals and decision-makers using cutting-edge artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 TechSummarizer. All rights reserved. | 
              Made with ❤️ in the Arab World
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}