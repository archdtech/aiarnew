# API Reference

## 📖 **API Documentation Overview**

This document provides comprehensive documentation for the Tech News Summarizer API. The API follows RESTful conventions and provides endpoints for managing news articles, automation processes, and system administration.

---

## 🔑 **Authentication**

### API Key Authentication
All API requests require authentication using an API key in the Authorization header:

```http
Authorization: Bearer your-api-key-here
```

### Obtaining API Keys
1. Navigate to the Admin Dashboard
2. Go to Settings → API Keys
3. Generate new API key with appropriate permissions
4. Copy and store the key securely

### Permissions
- **read**: Access to read endpoints
- **write**: Access to write endpoints
- **admin**: Full administrative access

---

## 📊 **Base URL**

### Production
```
https://api.your-domain.com/v1
```

### Development
```
http://localhost:3000/api
```

---

## 🔄 **Response Format**

### Standard Response Structure
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2025-06-20T10:30:00Z",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2025-06-20T10:30:00Z"
}
```

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## 📰 **News API**

### Get Articles

**Endpoint**: `GET /news`

**Description**: Retrieve news articles with filtering and pagination

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `category` | string | No | Filter by category |
| `tag` | string | No | Filter by tag |
| `search` | string | No | Search in title and content |
| `featured` | boolean | No | Filter featured articles only |
| `sort` | string | No | Sort by field (default: publishedAt) |
| `order` | string | No | Sort order (asc/desc, default: desc) |

**Example Request**:
```http
GET /api/news?limit=10&category=ذكاء+اصطناعي&featured=true
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-123",
        "title": "تطورات جديدة في الذكاء الاصطناعي",
        "summary": "شهدت تقنيات الذكاء الاصطناعي تطورات كبيرة هذا العام...",
        "fullContent": "المحتوى الكامل للمقال...",
        "source": "TechCrunch",
        "publishedAt": "2025-06-20",
        "tags": ["ذكاء اصطناعي", "تطوير", "ابتكار"],
        "category": "ذكاء اصطناعي",
        "originalUrl": "https://techcrunch.com/article/123",
        "isFeatured": true,
        "confidence": 0.92,
        "wordCount": 150
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Article by ID

**Endpoint**: `GET /news/{id}`

**Description**: Retrieve a specific article by ID

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Article ID |

**Example Request**:
```http
GET /api/news/article-123
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": "article-123",
    "title": "تطورات جديدة في الذكاء الاصطناعي",
    "summary": "شهدت تقنيات الذكاء الاصطناعي تطورات كبيرة هذا العام...",
    "fullContent": "المحتوى الكامل للمقال...",
    "source": "TechCrunch",
    "publishedAt": "2025-06-20T10:30:00Z",
    "tags": ["ذكاء اصطناعي", "تطوير", "ابتكار"],
    "category": "ذكاء اصطناعي",
    "originalUrl": "https://techcrunch.com/article/123",
        "isFeatured": true,
    "confidence": 0.92,
    "wordCount": 150,
    "createdAt": "2025-06-20T10:35:00Z",
    "updatedAt": "2025-06-20T10:35:00Z"
  }
}
```

---

## 🤖 **Automation API**

### Fetch News

**Endpoint**: `POST /news/fetch`

**Description**: Trigger news fetching from RSS feeds

**Request Body**:
```json
{
  "sources": ["techcrunch", "wired"], // Optional: specific sources
  "force": false // Optional: force refetch all articles
}
```

**Example Request**:
```http
POST /api/news/fetch
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "sources": ["techcrunch", "wired"],
  "force": false
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "fetchedCount": 25,
    "sourcesProcessed": 2,
    "newArticles": 18,
    "updatedArticles": 7,
    "errors": [],
    "processingTime": "00:00:15"
  },
  "message": "News fetching completed successfully"
}
```

### Summarize Articles

**Endpoint**: `POST /news/summarize`

**Description**: Generate AI-powered summaries for articles

**Request Body**:
```json
{
  "articleId": "article-123", // Optional: specific article
  "batchSize": 5, // Optional: number of articles to process
  "force": false // Optional: force re-summarization
}
```

**Example Request**:
```http
POST /api/news/summarize
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "batchSize": 5,
  "force": false
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "processedCount": 5,
    "successCount": 5,
    "errorCount": 0,
    "averageConfidence": 0.89,
    "processingTime": "00:01:23",
    "aiUsage": {
      "tokensUsed": 2500,
      "estimatedCost": 0.025
    }
  },
  "message": "Article summarization completed"
}
```

### Tag Articles

**Endpoint**: `POST /news/tag`

**Description**: Automatically tag articles using AI

**Request Body**:
```json
{
  "articleId": "article-123", // Optional: specific article
  "batchSize": 10, // Optional: number of articles to process
  "strategy": "ai" // Optional: "ai" or "rule-based"
}
```

**Example Request**:
```http
POST /api/news/tag
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "batchSize": 10,
  "strategy": "ai"
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "processedCount": 10,
    "tagsGenerated": 45,
    "newTagsCreated": 3,
    "processingTime": "00:00:45"
  },
  "message": "Article tagging completed"
}
```

---

## 📂 **Categories API**

### Get Categories

**Endpoint**: `GET /categories`

**Description**: Retrieve all categories with article counts

**Example Request**:
```http
GET /api/categories
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-1",
        "name": "ذكاء اصطناعي",
        "description": "أخبار وتطورات الذكاء الاصطناعي",
        "color": "#3B82F6",
        "articleCount": 125
      },
      {
        "id": "cat-2",
        "name": "تطوير برمجيات",
        "description": "أخبار تطوير البرمجيات والأدوات",
        "color": "#10B981",
        "articleCount": 89
      }
    ]
  }
}
```

### Create Category

**Endpoint**: `POST /categories`

**Description**: Create a new category (Admin only)

**Request Body**:
```json
{
  "name": "الأمن السيبراني",
  "description": "أخبار الأمن السيبراني والتهديدات",
  "color": "#EF4444"
}
```

**Example Request**:
```http
POST /api/categories
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "name": "الأمن السيبراني",
  "description": "أخبار الأمن السيبراني والتهديدات",
  "color": "#EF4444"
}
```

---

## 🏷️ **Tags API**

### Get Tags

**Endpoint**: `GET /tags`

**Description**: Retrieve all tags with usage counts

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of tags to return (default: 100) |
| `sort` | string | No | Sort by "name" or "usage" (default: "name") |
| `search` | string | No | Search tag names |

**Example Request**:
```http
GET /api/tags?limit=50&sort=usage&search=ذكاء
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "tag-1",
        "name": "ذكاء اصطناعي",
        "description": "تقنيات الذكاء الاصطناعي",
        "articleCount": 156
      },
      {
        "id": "tag-2",
        "name": "تعلم آلي",
        "description": "خوارزميات التعلم الآلي",
        "articleCount": 98
      }
    ]
  }
}
```

### Create Tag

**Endpoint**: `POST /tags`

**Description**: Create a new tag (Admin only)

**Request Body**:
```json
{
  "name": "بلوك تشين",
  "description": "تقنيات البلوك تشين والعملات الرقمية"
}
```

---

## 📡 **Sources API**

### Get Sources

**Endpoint**: `GET /sources`

**Description**: Retrieve all news sources with status

**Example Request**:
```http
GET /api/sources
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "id": "source-1",
        "name": "TechCrunch",
        "url": "https://techcrunch.com",
        "rssUrl": "https://techcrunch.com/feed/",
        "description": "Tech news and analysis",
        "isActive": true,
        "lastFetched": "2025-06-20T10:30:00Z",
        "articleCount": 342,
        "successRate": 98.5
      },
      {
        "id": "source-2",
        "name": "Wired",
        "url": "https://www.wired.com",
        "rssUrl": "https://www.wired.com/feed/rss",
        "description": "Technology culture and innovation",
        "isActive": true,
        "lastFetched": "2025-06-20T10:25:00Z",
        "articleCount": 278,
        "successRate": 96.2
      }
    ]
  }
}
```

### Create Source

**Endpoint**: `POST /sources`

**Description**: Add a new news source (Admin only)

**Request Body**:
```json
{
  "name": "Ars Technica",
  "url": "https://arstechnica.com",
  "rssUrl": "https://feeds.arstechnica.com/arstechnica/index",
  "description": "Technology news and analysis",
  "category": "تقنية"
}
```

---

## ⚙️ **Automation API**

### Get Automation Status

**Endpoint**: `GET /automation`

**Description**: Get current automation status and metrics

**Example Request**:
```http
GET /api/automation
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "status": "running",
    "lastChecked": "2025-06-20T10:30:00Z",
    "todayLogs": 45,
    "totalArticles": 1234,
    "automation": {
      "fetch": 12,
      "summarize": 8,
      "tag": 6
    },
    "systemHealth": {
      "cpu": 45,
      "memory": 67,
      "disk": 72,
      "uptime": "99.9%"
    }
  }
}
```

### Run Automation

**Endpoint**: `POST /automation`

**Description**: Trigger automation processes

**Request Body**:
```json
{
  "action": "full" // "fetch", "summarize", "tag", or "full"
}
```

**Example Request**:
```http
POST /api/automation
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "action": "full"
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "action": "full",
    "results": {
      "fetch": {
        "success": true,
        "fetchedCount": 25,
        "processingTime": "00:00:15"
      },
      "summarize": {
        "success": true,
        "processedCount": 20,
        "processingTime": "00:01:23"
      },
      "tag": {
        "success": true,
        "processedCount": 20,
        "processingTime": "00:00:45"
      }
    },
    "summary": {
      "fetched": 25,
      "summarized": 20,
      "tagged": 20
    }
  },
  "message": "Full automation completed successfully"
}
```

### Get Processing Logs

**Endpoint**: `GET /automation/logs`

**Description**: Retrieve system processing logs

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 50) |
| `date` | string | No | Filter by date (YYYY-MM-DD) |
| `action` | string | No | Filter by action type |
| `status` | string | No | Filter by status |

**Example Request**:
```http
GET /api/automation/logs?limit=20&action=fetch&status=success
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-123",
        "action": "fetch",
        "status": "success",
        "message": "Fetched 25 articles from TechCrunch",
        "metadata": {
          "source": "TechCrunch",
          "fetchedCount": 25
        },
        "createdAt": "2025-06-20T10:30:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

## 📊 **Analytics API**

### Get User Analytics

**Endpoint**: `GET /analytics/users`

**Description**: Get user analytics and statistics

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | No | Start date (YYYY-MM-DD) |
| `endDate` | string | No | End date (YYYY-MM-DD) |
| `granularity` | string | No | "day", "week", or "month" |

**Example Request**:
```http
GET /api/analytics/users?startDate=2025-06-01&endDate=2025-06-20&granularity=day
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1234,
    "activeUsers": 856,
    "newUsers": 45,
    "userGrowth": [
      {
        "date": "2025-06-20",
        "total": 1234,
        "active": 856,
        "new": 45
      }
    ],
    "demographics": {
      "countries": {
        "Saudi Arabia": 35,
        "UAE": 25,
        "Egypt": 20
      },
      "devices": {
        "mobile": 68,
        "desktop": 25,
        "tablet": 7
      }
    }
  }
}
```

### Get Content Analytics

**Endpoint**: `GET /analytics/content`

**Description**: Get content performance analytics

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | No | Start date (YYYY-MM-DD) |
| `endDate` | string | No | End date (YYYY-MM-DD) |
| `category` | string | No | Filter by category |

**Example Request**:
```http
GET /api/analytics/content?startDate=2025-06-01&category=ذكاء+اصطناعي
Authorization: Bearer your-api-key
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "totalArticles": 125,
    "totalViews": 8456,
    "averageReadTime": 245,
    "completionRate": 67,
    "topArticles": [
      {
        "id": "article-123",
        "title": "تطورات جديدة في الذكاء الاصطناعي",
        "views": 456,
        "readTime": 312,
        "completionRate": 78
      }
    ],
    "categoryPerformance": {
      "ذكاء اصطناعي": {
        "articles": 45,
        "views": 3456,
        "engagement": 72
      }
    }
  }
}
```

---

## 🔒 **Authentication API**

### Login

**Endpoint**: `POST /auth/login`

**Description**: User authentication

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Request**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-06-21T10:30:00Z"
  }
}
```

### Logout

**Endpoint**: `POST /auth/logout`

**Description**: User logout

**Example Request**:
```http
POST /api/auth/logout
Authorization: Bearer your-token
```

---

## 🚨 **Error Handling**

### Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Error Response Examples

#### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required and must be valid"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "timestamp": "2025-06-20T10:30:00Z"
}
```

#### Rate Limit Error
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 100,
      "window": "15 minutes",
      "reset": "2025-06-20T10:45:00Z"
    }
  },
  "timestamp": "2025-06-20T10:30:00Z"
}
```

---

## 🔄 **Webhooks**

### Article Processed Webhook

**Description**: Receive notifications when articles are processed

**Setup**: Configure webhook URL in Admin Dashboard

**Payload**:
```json
{
  "event": "article.processed",
  "data": {
    "articleId": "article-123",
    "status": "completed",
    "steps": [
      {
        "step": "fetch",
        "status": "success",
        "timestamp": "2025-06-20T10:30:00Z"
      },
      {
        "step": "summarize",
        "status": "success",
        "timestamp": "2025-06-20T10:31:00Z"
      },
      {
        "step": "tag",
        "status": "success",
        "timestamp": "2025-06-20T10:32:00Z"
      }
    ]
  },
  "timestamp": "2025-06-20T10:32:00Z"
}
```

### System Alert Webhook

**Description**: Receive system alerts and notifications

**Payload**:
```json
{
  "event": "system.alert",
  "data": {
    "type": "error",
    "severity": "high",
    "message": "AI service timeout detected",
    "component": "summarization",
    "timestamp": "2025-06-20T10:30:00Z"
  },
  "timestamp": "2025-06-20T10:30:00Z"
}
```

---

## 📝 **Code Examples**

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

// Get articles
async function getArticles() {
  const response = await fetch('https://api.your-domain.com/v1/news?limit=10', {
    headers: {
      'Authorization': 'Bearer your-api-key',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

// Trigger automation
async function runAutomation() {
  const response = await fetch('https://api.your-domain.com/v1/automation', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer your-api-key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'full' })
  });
  
  const result = await response.json();
  return result;
}
```

### Python

```python
import requests
import json

# Get articles
def get_articles():
    headers = {
        'Authorization': 'Bearer your-api-key',
        'Content-Type': 'application/json'
    }
    
    response = requests.get('https://api.your-domain.com/v1/news?limit=10', headers=headers)
    return response.json()

# Trigger automation
def run_automation():
    headers = {
        'Authorization': 'Bearer your-api-key',
        'Content-Type': 'application/json'
    }
    
    data = {'action': 'full'}
    response = requests.post('https://api.your-domain.com/v1/automation', 
                           headers=headers, json=data)
    return response.json()
```

### cURL

```bash
# Get articles
curl -X GET "https://api.your-domain.com/v1/news?limit=10" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json"

# Trigger automation
curl -X POST "https://api.your-domain.com/v1/automation" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "full"}'
```

---

## 🚀 **Rate Limiting**

### Rate Limits
- **Standard API**: 100 requests per minute
- **Premium API**: 1000 requests per minute
- **Enterprise API**: Custom limits

### Headers
Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-06-20T10:31:00Z
```

---

## 📞 **Support**

### Getting Help
- **API Documentation**: You're reading it!
- **Status Page**: https://status.your-domain.com
- **Support Email**: api-support@your-domain.com
- **Community Forum**: https://community.your-domain.com

### Reporting Issues
When reporting API issues, please include:
- Request URL and method
- Request headers and body
- Response status and body
- Timestamp of the request
- Your API key (first 4 characters only)

---

This API reference provides comprehensive documentation for integrating with the Tech News Summarizer platform. For additional questions or support, please don't hesitate to reach out to our development team.

---

**Document Version**: 1.0  
**Last Updated**: June 20, 2025  
**API Version**: v1