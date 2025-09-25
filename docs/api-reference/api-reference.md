# API Reference

## 📚 **Overview**

This document provides comprehensive reference information for the Tech News Summarizer API. It includes endpoint documentation, request/response formats, authentication requirements, and usage examples.

---

## 🔑 **Authentication**

### API Key Authentication
All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer YOUR_API_KEY
```

### Getting API Keys
1. Log in to the admin dashboard
2. Navigate to Settings → API Keys
3. Generate new API key
4. Copy and store the key securely

### Security Headers
```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
User-Agent: Your-App-Name/1.0
```

---

## 📊 **Base URL**

**Production**: `https://api.technews-summarizer.com/v1`  
**Development**: `http://localhost:3000/api`

---

## 📋 **API Endpoints**

### 1. News Management

#### GET /news
Fetch news articles with filtering and pagination.

**Endpoint**: `GET /news`  
**Authentication**: Required  
**Rate Limit**: 100 requests per minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 20 | Number of articles per page |
| `category` | string | No | all | Filter by category name |
| `tag` | string | No | all | Filter by tag name |
| `search` | string | No | - | Search in title and content |
| `featured` | boolean | No | false | Filter featured articles only |
| `sort` | string | No | latest | Sort order (latest, popular, relevant) |

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/news?limit=10&category=ذكاء-اصطناعي&search=تعلم-عميق" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article_123",
        "title": "تطورات جديدة في التعلم العميق",
        "summary": "شهدت تقنيات التعلم العميق تطورات كبيرة هذا العام...",
        "fullContent": "المحتوى الكامل للمقال...",
        "source": "TechCrunch",
        "publishedAt": "2025-06-20",
        "tags": ["تعلم-عميق", "ذكاء-اصطناعي", "تطوير"],
        "category": "ذكاء-اصطناعي",
        "originalUrl": "https://techcrunch.com/article",
        "isFeatured": true,
        "confidence": 0.92,
        "wordCount": 150
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `429`: Rate limit exceeded
- `500`: Internal server error

---

#### POST /news/fetch
Fetch news articles from RSS feeds.

**Endpoint**: `POST /news/fetch`  
**Authentication**: Required  
**Rate Limit**: 10 requests per hour

**Request Body**:
```json
{
  "sources": ["techcrunch", "wired", "the-verge"],
  "limit": 50,
  "forceRefresh": false
}
```

**Request Example**:
```bash
curl -X POST "https://api.technews-summarizer.com/v1/news/fetch" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["techcrunch", "wired"],
    "limit": 25,
    "forceRefresh": false
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "fetchedCount": 23,
    "sourcesProcessed": 2,
    "newArticles": 18,
    "updatedArticles": 5,
    "errors": [],
    "processingTime": "2.3s"
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500**: Internal server error

---

#### POST /news/summarize
Generate Arabic summaries for articles.

**Endpoint**: `POST /news/summarize`  
**Authentication**: Required  
**Rate Limit**: 20 requests per hour

**Request Body**:
```json
{
  "articleIds": ["article_123", "article_456"],
  "style": "professional",
  "length": "medium",
  "includeKeyPoints": true
}
```

**Style Options**:
- `professional`: Formal business Arabic
- `technical`: Technical terminology focused
- `executive`: Executive summary style
- `casual`: Casual, easy-to-read style

**Length Options**:
- `short`: 1-2 sentences
- `medium`: 3-4 sentences
- `long`: 5-6 sentences

**Request Example**:
```bash
curl -X POST "https://api.technews-summarizer.com/v1/news/summarize" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "articleIds": ["article_123"],
    "style": "professional",
    "length": "medium",
    "includeKeyPoints": true
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "processed": 1,
    "summaries": [
      {
        "articleId": "article_123",
        "title": "تطورات جديدة في التعلم العميق",
        "summary": "شهدت تقنيات التعلم العميق تطورات كبيرة هذا العام مع إطلاق نماذج جديدة تتفوق في قدراتها على الفهم والاستدلال.",
        "keyPoints": [
          "إطلاق نماذج تعلم عميق جديدة",
          "تحسين قدرات الفهم والاستدلال",
          "تطورات في معالجة اللغات الطبيعية"
        ],
        "confidence": 0.89,
        "wordCount": 45,
        "processingTime": "1.2s"
      }
    ],
    "errors": []
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

#### POST /news/tag
Automatically tag articles with relevant categories and keywords.

**Endpoint**: `POST /news/tag`  
**Authentication**: Required  
**Rate Limit**: 30 requests per hour

**Request Body**:
```json
{
  "articleIds": ["article_123", "article_456"],
  "autoCategorize": true,
  "maxTags": 8,
  "confidenceThreshold": 0.7
}
```

**Request Example**:
```bash
curl -X POST "https://api.technews-summarizer.com/v1/news/tag" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "articleIds": ["article_123"],
    "autoCategorize": true,
    "maxTags": 8,
    "confidenceThreshold": 0.7
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "processed": 1,
    "tags": [
      {
        "articleId": "article_123",
        "category": "ذكاء-اصطناعي",
        "tags": [
          {
            "name": "تعلم-عميق",
            "confidence": 0.92
          },
          {
            "name": "ذكاء-اصطناعي",
            "confidence": 0.88
          },
          {
            "name": "شبكات-عصبية",
            "confidence": 0.76
          }
        ],
        "processingTime": "0.8s"
      }
    ],
    "errors": []
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

### 2. Content Management

#### GET /categories
Get all available categories.

**Endpoint**: `GET /categories`  
**Authentication**: Required  
**Rate Limit**: 200 requests per minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeStats` | boolean | No | false | Include article counts |

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/categories?includeStats=true" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_123",
        "name": "ذكاء-اصطناعي",
        "description": "أخبار وتطورات الذكاء الاصطناعي",
        "color": "#3B82F6",
        "articleCount": 156,
        "createdAt": "2025-06-01T00:00:00Z"
      },
      {
        "id": "cat_456",
        "name": "تطوير-برمجيات",
        "description": "تطوير البرمجيات والأدوات",
        "color": "#10B981",
        "articleCount": 89,
        "createdAt": "2025-06-01T00:00:00Z"
      }
    ]
  }
}
```

**Response Codes**:
- `200`: Success
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

#### GET /tags
Get all available tags.

**Endpoint**: `GET /tags`  
**Authentication**: Required  
**Rate Limit**: 200 requests per minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | string | No | - | Filter by category |
| `minUsage` | number | No | 0 | Minimum usage count |
| `search` | string | No | - | Search in tag names |

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/tags?category=ذكاء-اصطناعي&minUsage=5" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "tag_123",
        "name": "تعلم-عميق",
        "description": "التعلم العميق والشبكات العصبية",
        "articleCount": 45,
        "createdAt": "2025-06-01T00:00:00Z"
      },
      {
        "id": "tag_456",
        "name": "معالجة-لغات-طبيعية",
        "description": "معالجة اللغات الطبيعية وتحليل النصوص",
        "articleCount": 23,
        "createdAt": "2025-06-01T00:00:00Z"
      }
    ]
  }
}
```

**Response Codes**:
- `200`: Success
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

#### GET /sources
Get all news sources.

**Endpoint**: `GET /sources`  
**Authentication**: Required  
**Rate Limit**: 200 requests per minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `activeOnly` | boolean | No | true | Show only active sources |
| `category` | string | No | - | Filter by category |

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/sources?activeOnly=true" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "id": "source_123",
        "name": "TechCrunch",
        "url": "https://techcrunch.com",
        "rssUrl": "https://techcrunch.com/feed/",
        "description": "Latest technology news from TechCrunch",
        "isActive": true,
        "articleCount": 234,
        "lastFetched": "2025-06-20T10:30:00Z",
        "createdAt": "2025-06-01T00:00:00Z"
      },
      {
        "id": "source_456",
        "name": "Wired",
        "url": "https://wired.com",
        "rssUrl": "https://www.wired.com/feed/rss",
        "description": "Technology news and culture from Wired",
        "isActive": true,
        "articleCount": 189,
        "lastFetched": "2025-06-20T10:25:00Z",
        "createdAt": "2025-06-01T00:00:00Z"
      }
    ]
  }
}
```

**Response Codes**:
- `200`: Success
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

### 3. Automation

#### POST /automation
Control automation processes.

**Endpoint**: `POST /automation`  
**Authentication**: Required  
**Rate Limit**: 10 requests per hour

**Request Body**:
```json
{
  "action": "fetch",
  "parameters": {
    "sources": ["techcrunch", "wired"],
    "limit": 50
  }
}
```

**Action Types**:
- `fetch`: Fetch news from RSS feeds
- `summarize`: Generate Arabic summaries
- `tag`: Tag articles automatically
- `full`: Run complete automation pipeline

**Request Example**:
```bash
curl -X POST "https://api.technews-summarizer.com/v1/automation" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "fetch",
    "parameters": {
      "sources": ["techcrunch", "wired"],
      "limit": 50
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "action": "fetch",
    "status": "completed",
    "result": {
      "fetchedCount": 47,
      "sourcesProcessed": 2,
      "newArticles": 35,
      "processingTime": "3.2s"
    },
    "timestamp": "2025-06-20T10:35:00Z"
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request (invalid action)
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

#### GET /automation/status
Get automation system status.

**Endpoint**: `GET /automation/status`  
**Authentication**: Required  
**Rate Limit**: 60 requests per minute

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/automation/status" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "status": "running",
    "lastChecked": "2025-06-20T10:35:00Z",
    "processes": {
      "fetch": {
        "status": "idle",
        "lastRun": "2025-06-20T10:30:00Z",
        "nextRun": "2025-06-20T11:00:00Z",
        "successRate": 0.95
      },
      "summarize": {
        "status": "processing",
        "lastRun": "2025-06-20T10:25:00Z",
        "nextRun": "2025-06-20T11:00:00Z",
        "successRate": 0.89
      },
      "tag": {
        "status": "idle",
        "lastRun": "2025-06-20T10:20:00Z",
        "nextRun": "2025-06-20T11:00:00Z",
        "successRate": 0.92
      }
    },
    "statistics": {
      "totalArticles": 1234,
      "processedToday": 45,
      "averageProcessingTime": "1.8s",
      "errorRate": 0.05
    }
  }
}
```

**Response Codes**:
- `200`: Success
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

#### GET /automation/logs
Get automation processing logs.

**Endpoint**: `GET /automation/logs`  
**Authentication**: Required  
**Rate Limit**: 100 requests per minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `action` | string | No | - | Filter by action type |
| `status` | string | No | - | Filter by status |
| `date` | string | No | - | Filter by date (YYYY-MM-DD) |
| `limit` | number | No | 50 | Number of log entries |
| `page` | number | No | 1 | Page number |

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/automation/logs?action=fetch&status=success&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123",
        "action": "fetch",
        "status": "success",
        "message": "Successfully fetched 47 articles from 2 sources",
        "metadata": {
          "sources": ["techcrunch", "wired"],
          "fetchedCount": 47,
          "processingTime": "3.2s"
        },
        "timestamp": "2025-06-20T10:30:00Z"
      },
      {
        "id": "log_456",
        "action": "summarize",
        "status": "error",
        "message": "Failed to summarize article_789: AI service timeout",
        "metadata": {
          "articleId": "article_789",
          "error": "Request timeout after 30 seconds"
        },
        "timestamp": "2025-06-20T10:25:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

### 4. System

#### GET /health
System health check.

**Endpoint**: `GET /health`  
**Authentication**: Optional  
**Rate Limit**: 300 requests per minute

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/health"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-06-20T10:35:00Z",
    "version": "1.0.0",
    "checks": {
      "database": {
        "status": "healthy",
        "responseTime": "15ms",
        "lastChecked": "2025-06-20T10:34:00Z"
      },
      "aiService": {
        "status": "healthy",
        "responseTime": "120ms",
        "lastChecked": "2025-06-20T10:34:00Z"
      },
      "cache": {
        "status": "healthy",
        "hitRate": 0.85,
        "lastChecked": "2025-06-20T10:34:00Z"
      },
      "storage": {
        "status": "healthy",
        "usage": "45%",
        "lastChecked": "2025-06-20T10:34:00Z"
      }
    }
  }
}
```

**Response Codes**:
- `200`: Success
- `503`: Service unavailable

---

#### GET /stats
System statistics and metrics.

**Endpoint**: `GET /stats`  
**Authentication**: Required  
**Rate Limit**: 60 requests per minute

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | 7d | Time period (1h, 24h, 7d, 30d) |

**Request Example**:
```bash
curl "https://api.technews-summarizer.com/v1/stats?period=7d" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "articles": {
      "total": 1234,
      "processed": 1189,
      "featured": 156,
      "trending": 45
    },
    "sources": {
      "total": 15,
      "active": 14,
      "mostActive": "TechCrunch"
    },
    "users": {
      "total": 2345,
      "active": 1567,
      "new": 234
    },
    "performance": {
      "averageResponseTime": "145ms",
      "uptime": "99.8%",
      "errorRate": "0.5%"
    },
    "ai": {
      "summariesGenerated": 1189,
      "averageConfidence": 0.89,
      "averageProcessingTime": "1.8s"
    }
  }
}
```

**Response Codes**:
- `200`: Success
- `400`: Bad request
- `401`: Unauthorized
- `429`: Rate limit exceeded
- `500`: Internal server error

---

## 🚨 **Error Handling**

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  },
  "timestamp": "2025-06-20T10:35:00Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Error Examples

**Authentication Error**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key",
    "details": {
      "provided": "Bearer invalid_key"
    }
  },
  "timestamp": "2025-06-20T10:35:00Z"
}
```

**Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "limit",
      "issue": "must be between 1 and 100"
    }
  },
  "timestamp": "2025-06-20T10:35:00Z"
}
```

**Rate Limit Error**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": "100 per minute",
      "reset": "2025-06-20T10:36:00Z"
    }
  },
  "timestamp": "2025-06-20T10:35:00Z"
}
```

---

## 🔄 **Webhooks**

### Webhook Events

The API can send real-time notifications to your webhook endpoint for various events:

**Event Types**:
- `article.processed`: New article processed
- `summary.generated`: Summary created
- `system.status`: System status change
- `error.occurred`: Error event

### Setting Up Webhooks

1. **Configure Webhook URL**:
```bash
curl -X POST "https://api.technews-summarizer.com/v1/webhooks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["article.processed", "summary.generated"],
    "secret": "your_webhook_secret"
  }'
```

2. **Webhook Payload Example**:
```json
{
  "event": "article.processed",
  "data": {
    "articleId": "article_123",
    "title": "تطورات جديدة في التعلم العميق",
    "status": "success",
    "processingTime": "2.3s"
  },
  "timestamp": "2025-06-20T10:35:00Z"
}
```

3. **Verify Webhook Signature**:
```javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return signature === `sha256=${digest}`
}
```

---

## 📈 **Rate Limiting**

### Rate Limits by Endpoint

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| `GET /news` | 100 req/min | 1 minute |
| `POST /news/fetch` | 10 req/hour | 1 hour |
| `POST /news/summarize` | 20 req/hour | 1 hour |
| `POST /news/tag` | 30 req/hour | 1 hour |
| `GET /categories` | 200 req/min | 1 minute |
| `GET /tags` | 200 req/min | 1 minute |
| `GET /sources` | 200 req/min | 1 minute |
| `POST /automation` | 10 req/hour | 1 hour |
| `GET /automation/status` | 60 req/min | 1 minute |
| `GET /automation/logs` | 100 req/min | 1 minute |
| `GET /health` | 300 req/min | 1 minute |
| `GET /stats` | 60 req/min | 1 minute |

### Rate Limit Headers

Responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1718894400
```

### Handling Rate Limits

When rate limited, the API returns a `429` status with retry information:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": "100 per minute",
      "reset": "2025-06-20T10:36:00Z",
      "retryAfter": 30
    }
  },
  "timestamp": "2025-06-20T10:35:00Z"
}
```

---

## 🔍 **SDKs and Libraries**

### JavaScript/Node.js

```javascript
class TechNewsAPI {
  constructor(apiKey, baseUrl = 'https://api.technews-summarizer.com/v1') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async getNews(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/news?${queryString}`)
  }

  async fetchNews(sources = [], limit = 50) {
    return this.request('/news/fetch', {
      method: 'POST',
      body: JSON.stringify({ sources, limit })
    })
  }

  async summarizeArticles(articleIds, options = {}) {
    return this.request('/news/summarize', {
      method: 'POST',
      body: JSON.stringify({
        articleIds,
        ...options
      })
    })
  }
}

// Usage
const api = new TechNewsAPI('your_api_key')

api.getNews({ limit: 10, category: 'ذكاء-اصطناعي' })
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

### Python

```python
import requests
import json

class TechNewsAPI:
    def __init__(self, api_key, base_url='https://api.technews-summarizer.com/v1'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def request(self, endpoint, method='GET', data=None):
        url = f"{self.base_url}{endpoint}"
        
        response = requests.request(
            method,
            url,
            headers=self.headers,
            json=data
        )
        
        response.raise_for_status()
        return response.json()

    def get_news(self, params=None):
        endpoint = '/news'
        if params:
            query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
            endpoint = f'/news?{query_string}'
        
        return self.request(endpoint)

    def fetch_news(self, sources=None, limit=50):
        data = {'sources': sources or [], 'limit': limit}
        return self.request('/news/fetch', method='POST', data=data)

    def summarize_articles(self, article_ids, options=None):
        data = {'articleIds': article_ids, **(options or {})}
        return self.request('/news/summarize', method='POST', data=data)

# Usage
api = TechNewsAPI('your_api_key')

try:
    news = api.get_news({'limit': 10, 'category': 'ذكاء-اصطناعي'})
    print(json.dumps(news, indent=2, ensure_ascii=False))
except requests.exceptions.RequestException as e:
    print(f"API Error: {e}")
```

---

## 🧪 **Testing the API**

### Using curl

**Basic Test**:
```bash
# Test health endpoint
curl "https://api.technews-summarizer.com/v1/health"

# Test news endpoint
curl "https://api.technews-summarizer.com/v1/news?limit=5" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Automation Test**:
```bash
# Test fetch automation
curl -X POST "https://api.technews-summarizer.com/v1/automation" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "status"}'
```

### Using Postman

1. **Import Collection**:
   - Download the Postman collection
   - Import into Postman
   - Set environment variables

2. **Environment Variables**:
   ```
   BASE_URL = https://api.technews-summarizer.com/v1
   API_KEY = your_api_key_here
   ```

3. **Test Requests**:
   - Health Check: `GET /health`
   - Get News: `GET /news`
   - Fetch News: `POST /news/fetch`
   - Summarize: `POST /news/summarize`

---

## 📞 **Support**

### Getting Help

- **Documentation**: Complete API reference
- **Status Page**: System status and incidents
- **Support Email**: api-support@technews-summarizer.com
- **Community**: Developer forums and discussions

### Reporting Issues

When reporting issues, please include:
- API endpoint and method
- Request parameters and headers
- Response received (if any)
- Error messages
- Timestamp of the request
- Your API key (first 6 characters only)

### Changelog

**Version 1.0.0** (2025-06-20)
- Initial API release
- Core news management endpoints
- Automation control endpoints
- System health and statistics

---

**Last Updated**: 2025-06-20  
**Version**: 1.0.0  
**Maintainer**: API Development Team