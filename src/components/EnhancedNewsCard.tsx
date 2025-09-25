'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  Tag, 
  ArrowUpRight,
  Eye,
  Calendar,
  Building2
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  summary: string
  fullContent: string
  source: string
  publishedAt: string
  tags: string[]
  category: string
  originalUrl: string
  isFeatured: boolean
  confidence?: number
  wordCount?: number
  insights?: {
    type: string
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    category: string
  }[]
  imageUrl?: string
  readTime?: number
}

interface EnhancedNewsCardProps {
  article: NewsArticle
  variant?: 'featured' | 'compact'
}

export default function EnhancedNewsCard({ article, variant = 'compact' }: EnhancedNewsCardProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  if (variant === 'featured') {
    return (
      <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden group">
        {article.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 text-black hover:bg-white">
                {article.category}
              </Badge>
            </div>
            {article.isFeatured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  ⭐ مميز
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              {article.source}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {article.publishedAt}
            </div>
          </div>
          <CardTitle className="text-xl leading-tight group-hover:text-blue-600 transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-base leading-relaxed text-right">
            {article.summary}
          </CardDescription>
          
          {/* Insights Section */}
          {article.insights && article.insights.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                النقاط الرئيسية:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {article.insights.slice(0, 4).map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-lg border text-xs ${getImpactColor(insight.impact)}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span>{getImpactIcon(insight.impact)}</span>
                      <span className="font-medium">{insight.title}</span>
                    </div>
                    <p className="text-xs opacity-90">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 6).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 ml-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} دقيقة
                </div>
              )}
              {article.confidence && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {Math.round(article.confidence * 100)}% دقة
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(article.originalUrl, '_blank')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              قراءة المزيد
              <ExternalLink className="w-3 h-3 mr-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 group">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {article.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {article.source}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {article.publishedAt}
              </span>
              {article.isFeatured && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  ⭐ مميز
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold leading-tight group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
            
            {/* Summary */}
            <p className="text-muted-foreground leading-relaxed text-right">
              {article.summary}
            </p>
            
            {/* Quick Insights */}
            {article.insights && article.insights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.insights.slice(0, 3).map((insight, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`text-xs ${getImpactColor(insight.impact)}`}
                  >
                    {getImpactIcon(insight.impact)} {insight.title}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} دقيقة
                </div>
              )}
              {article.confidence && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {Math.round(article.confidence * 100)}% دقة
                </div>
              )}
              {article.wordCount && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.wordCount} كلمة
                </div>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex lg:flex-col lg:items-end gap-2">
            <Button 
              variant="outline"
              onClick={() => window.open(article.originalUrl, '_blank')}
              className="hover:bg-blue-50 hover:border-blue-300 whitespace-nowrap"
            >
              قراءة المزيد
              <ArrowUpRight className="w-4 h-4 mr-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}