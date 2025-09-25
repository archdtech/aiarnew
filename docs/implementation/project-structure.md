# Project Structure Guide

## 🏗️ **Overview**

This document provides a comprehensive overview of the Tech News Summarizer project structure, explaining the purpose and organization of each directory and file.

---

## 📁 **Root Directory Structure**

```
arabic-tech-news-summarizer/
├── docs/                    # Documentation files
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/                    # Source code
├── .env.example           # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .gitignore            # Git ignore rules
├── components.json        # shadcn/ui configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project README
```

---

## 📚 **Documentation (`docs/`)**

### Purpose
Contains all project documentation, organized by category and purpose.

### Structure
```
docs/
├── README.md                    # Main documentation index
├── planning/                    # Planning and strategy documents
│   ├── prd.md                  # Product Requirements Document
│   └── roadmap.md              # Project roadmap
├── implementation/              # Implementation guides
│   └── getting-started.md      # Getting started guide
├── research/                   # Research materials
├── architecture/               # System architecture
├── deployment/                 # Deployment guides
├── user-guides/               # User documentation
├── api-reference/             # API documentation
└── development-notes/         # Development notes
```

### Key Files
- **README.md**: Main documentation index with navigation
- **planning/prd.md**: Product requirements and specifications
- **planning/roadmap.md**: Development timeline and milestones
- **implementation/getting-started.md**: Setup and installation guide

---

## 🗄️ **Database (`prisma/`)**

### Purpose
Contains database schema definitions and migration files using Prisma ORM.

### Structure
```
prisma/
├── schema.prisma              # Database schema definition
├── migrations/               # Database migrations (auto-generated)
└── dev.db                    # SQLite database file (development)
```

### Key Components
- **schema.prisma**: Defines all database models and relationships
  - `NewsSource`: RSS feed sources
  - `Category`: Article categories
  - `Tag`: Article tags
  - `NewsArticle`: Main article model
  - `NewsSummary`: Arabic summaries
  - `NewsTag`: Many-to-many relationship
  - `ProcessingLog`: System logging
  - `UserPreferences`: User settings

### Database Models Overview
```typescript
// Core models
NewsSource -> NewsArticle (one-to-many)
Category -> NewsArticle (one-to-many)
Tag <- NewsTag -> NewsArticle (many-to-many)
NewsArticle -> NewsSummary (one-to-one)

// Support models
ProcessingLog (system events)
UserPreferences (user settings)
```

---

## 🖼️ **Static Assets (`public/`)**

### Purpose
Contains static files that are served directly by the web server.

### Structure
```
public/
├── favicon.ico              # Website favicon
├── logo.svg                # Application logo
├── robots.txt              # Search engine crawler rules
└── manifest.json           # Progressive Web App manifest
```

### Usage
Files in this directory are accessible at the root URL:
- `public/logo.svg` → `http://localhost:3000/logo.svg`
- `public/favicon.ico` → `http://localhost:3000/favicon.ico`

---

## 📦 **Source Code (`src/`)**

### Purpose
Contains all the application source code organized by feature and responsibility.

### Structure Overview
```
src/
├── app/                     # Next.js App Router
├── components/              # React components
├── lib/                     # Utility libraries
└── styles/                  # Global styles
```

---

## 🚀 **App Router (`src/app/`)**

### Purpose
Next.js 13+ App Router implementation with file-based routing.

### Structure
```
src/app/
├── api/                     # API routes
│   ├── news/                # News-related APIs
│   │   ├── route.ts         # Get news articles
│   │   ├── fetch/           # Fetch news from RSS
│   │   │   └── route.ts
│   │   ├── summarize/       # AI summarization
│   │   │   └── route.ts
│   │   └── tag/             # Article tagging
│   │       └── route.ts
│   ├── automation/          # Automation control
│   │   └── route.ts
│   ├── categories/          # Category management
│   │   └── route.ts
│   ├── tags/               # Tag management
│   │   └── route.ts
│   ├── sources/            # Source management
│   │   └── route.ts
│   └── automation/          # Automation logs
│       └── logs/
│           └── route.ts
├── admin/                  # Admin dashboard
│   └── page.tsx            # Admin interface
├── globals.css             # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Homepage
```

### API Routes (`src/app/api/`)

#### News APIs (`src/app/api/news/`)
- **route.ts**: Main news retrieval with filtering
  - Methods: `GET`
  - Features: Pagination, search, category/tag filtering
  - Response: Articles with Arabic summaries

- **fetch/route.ts**: RSS feed processing
  - Methods: `POST`
  - Features: Fetch from multiple sources, parse RSS
  - Sources: TechCrunch, Wired, The Verge, etc.

- **summarize/route.ts**: AI-powered summarization
  - Methods: `POST` (single), `GET` (batch)
  - Features: Arabic translation, summarization, key points
  - Technology: z-ai-web-dev-sdk

- **tag/route.ts**: Smart tagging system
  - Methods: `POST` (single), `GET` (batch)
  - Features: Auto-categorization, 200+ predefined tags
  - AI: Intelligent tag extraction

#### Automation APIs (`src/app/api/automation/`)
- **route.ts**: Process control and monitoring
  - Methods: `POST` (control), `GET` (status)
  - Features: Full automation pipeline, status monitoring

- **logs/route.ts**: Processing logs
  - Methods: `GET`
  - Features: System logs, statistics, filtering

#### Management APIs
- **categories/route.ts**: Category CRUD operations
- **tags/route.ts**: Tag management
- **sources/route.ts**: News source management

### Pages (`src/app/`)

#### Homepage (`src/app/page.tsx`)
- **Purpose**: Main user interface
- **Features**:
  - Featured articles section
  - Latest news feed
  - Search and filtering
  - Category navigation
  - Responsive design (RTL)

#### Admin Dashboard (`src/app/admin/page.tsx`)
- **Purpose**: System administration interface
- **Features**:
  - Automation control panel
  - Real-time processing logs
  - System statistics
  - Manual process triggering
  - Performance monitoring

---

## 🧩 **Components (`src/components/`)**

### Purpose
Reusable React components organized by functionality.

### Structure
```
src/components/
└── ui/                     # shadcn/ui components
    ├── button.tsx         # Button component
    ├── card.tsx           # Card component
    ├── input.tsx          # Input component
    ├── select.tsx         # Select component
    ├── badge.tsx          # Badge component
    ├── tabs.tsx           # Tabs component
    └── ...                # Other UI components
```

### Component Categories

#### shadcn/ui Components (`src/components/ui/`)
Pre-built, accessible components following modern design patterns:
- **Button**: Interactive buttons with variants
- **Card**: Content containers with header/body
- **Input**: Form input fields
- **Select**: Dropdown selection
- **Badge**: Status indicators and tags
- **Tabs**: Content organization
- **Icons**: Lucide React icons

### Component Usage Example
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function ArticleCard({ article }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{article.summary}</p>
        <div className="mt-4">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <Button className="mt-4">Read More</Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🔧 **Utilities (`src/lib/`)**

### Purpose
Utility functions and configurations used throughout the application.

### Structure
```
src/lib/
├── db.ts                  # Database client
├── socket.ts              # Socket.io configuration
└── utils.ts               # Utility functions
```

### Key Files

#### Database Client (`src/lib/db.ts`)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

#### Socket Configuration (`src/lib/socket.ts`)
```typescript
import { Server } from 'socket.io'

export function initializeSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? false 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  })

  // Socket event handlers
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  return io
}
```

---

## 🎨 **Styles (`src/styles/`)**

### Purpose
Global styles and Tailwind CSS configuration.

### Structure
```
src/styles/
└── globals.css            # Global CSS styles
```

### Global Styles (`src/styles/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* RTL Support */
[dir='rtl'] {
  text-align: right;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## ⚙️ **Configuration Files**

### Package.json
```json
{
  "name": "arabic-tech-news-summarizer",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "18.0.0",
    "react-dom": "18.0.0",
    "@prisma/client": "5.0.0",
    "prisma": "5.0.0",
    "z-ai-web-dev-sdk": "1.0.0",
    "tailwindcss": "4.0.0",
    "lucide-react": "0.400.0"
  }
}
```

### Tailwind Config
```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
  plugins: [],
}
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🔄 **Data Flow Architecture**

### 1. News Processing Pipeline
```
RSS Feeds → API Fetch → Database → AI Summarization → Tagging → User Interface
```

### 2. User Interaction Flow
```
User → Homepage → Search/Filter → API → Database → Display
```

### 3. Admin Control Flow
```
Admin → Dashboard → Control API → Automation → Processing → Results
```

---

## 📝 **Best Practices**

### File Organization
- **Keep related files together**: API routes with their logic
- **Use consistent naming**: kebab-case for files, PascalCase for components
- **Separate concerns**: UI components, business logic, data access

### Code Structure
- **TypeScript everywhere**: Strong typing for better maintainability
- **Component composition**: Build complex UIs from simple components
- **API routes as controllers**: Keep business logic in API routes

### Database Design
- **Use relationships effectively**: Leverage Prisma's relational features
- **Indexing**: Add indexes for frequently queried fields
- **Validation**: Use Prisma schema validation

### Performance
- **Caching**: Implement caching for frequently accessed data
- **Pagination**: Use pagination for large datasets
- **Optimistic updates**: Update UI before API confirmation

---

## 🚀 **Development Workflow**

### 1. Adding New Features
```
1. Plan feature (docs/planning/)
2. Update database schema (prisma/schema.prisma)
3. Create API routes (src/app/api/)
4. Build UI components (src/components/)
5. Update pages (src/app/)
6. Test thoroughly
7. Update documentation
```

### 2. Database Changes
```
1. Edit prisma/schema.prisma
2. Run npm run db:push
3. Update TypeScript types
4. Test with Prisma Studio
```

### 3. API Development
```
1. Create API route file
2. Implement request validation
3. Add business logic
4. Handle errors gracefully
5. Add proper responses
6. Test with Postman/curl
```

---

**Last Updated**: 2025-06-20  
**Version**: 1.0.0  
**Maintainer**: Development Team