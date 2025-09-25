# Getting Started Guide

## 🚀 **Quick Start**

This guide will help you set up the Tech News Summarizer project locally and get it running in minutes.

---

## 📋 **Prerequisites**

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: For version control
- **VS Code**: Recommended IDE (with extensions)

### Optional but Recommended
- **Docker**: For containerized development
- **Postman**: For API testing
- **GitHub CLI**: For repository management

---

## 🔧 **Installation Steps**

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/arabic-tech-news-summarizer.git

# Navigate to the project directory
cd arabic-tech-news-summarizer
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies if needed
cd src/app && npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# AI Configuration (z-ai-web-dev-sdk)
ZAI_API_KEY="your-zai-api-key"
ZAI_API_URL="https://api.z-ai.com"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional: Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npm run db:push

# (Optional) View database
npx prisma studio
```

### 5. Run the Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Main Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Base**: http://localhost:3000/api

---

## 🏗️ **Project Structure**

```
arabic-tech-news-summarizer/
├── docs/                    # Documentation
│   ├── README.md            # Main documentation index
│   ├── planning/            # Planning documents
│   ├── implementation/      # Implementation guides
│   ├── research/           # Research materials
│   └── architecture/        # Architecture documents
├── prisma/                 # Database schema
│   └── schema.prisma       # Database definitions
├── public/                 # Static assets
│   └── logo.svg           # Application logo
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/           # API routes
│   │   │   ├── news/      # News-related APIs
│   │   │   ├── automation/ # Automation APIs
│   │   │   ├── categories/ # Category APIs
│   │   │   ├── tags/      # Tag APIs
│   │   │   └── sources/   # Source APIs
│   │   ├── admin/         # Admin dashboard
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   └── lib/              # Utility libraries
│       ├── db.ts         # Database client
│       └── socket.ts     # Socket.io configuration
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project README
```

---

## 🔑 **Key Components**

### 1. News Aggregation System
- **Location**: `src/app/api/news/fetch/route.ts`
- **Purpose**: Fetches news from RSS feeds
- **Sources**: TechCrunch, Wired, The Verge, etc.

### 2. AI Summarization Engine
- **Location**: `src/app/api/news/summarize/route.ts`
- **Purpose**: Translates and summarizes content in Arabic
- **Technology**: z-ai-web-dev-sdk

### 3. Smart Tagging System
- **Location**: `src/app/api/news/tag/route.ts`
- **Purpose**: Automatically categorizes and tags articles
- **Features**: 200+ predefined Arabic tech tags

### 4. Admin Dashboard
- **Location**: `src/app/admin/page.tsx`
- **Purpose**: Control automation and monitor system
- **Features**: Real-time logs, statistics, controls

---

## 🧪 **Testing the Application**

### 1. Test the Main Interface

Open http://localhost:3000 in your browser:
- Verify Arabic RTL layout
- Check responsive design on mobile
- Test search and filtering
- Browse featured articles

### 2. Test the Admin Dashboard

Open http://localhost:3000/admin:
- Verify automation controls
- Check processing logs
- Test manual triggering
- Review system statistics

### 3. Test API Endpoints

Use Postman or curl to test APIs:

```bash
# Get news articles
curl "http://localhost:3000/api/news?limit=10"

# Fetch news from sources
curl -X POST "http://localhost:3000/api/news/fetch"

# Get categories
curl "http://localhost:3000/api/categories"

# Get tags
curl "http://localhost:3000/api/tags"
```

### 4. Test Automation Flow

1. **Fetch News**:
   ```bash
   curl -X POST "http://localhost:3000/api/automation" \
   -H "Content-Type: application/json" \
   -d '{"action": "fetch"}'
   ```

2. **Summarize News**:
   ```bash
   curl -X POST "http://localhost:3000/api/automation" \
   -H "Content-Type: application/json" \
   -d '{"action": "summarize"}'
   ```

3. **Tag News**:
   ```bash
   curl -X POST "http://localhost:3000/api/automation" \
   -H "Content-Type: application/json" \
   -d '{"action": "tag"}'
   ```

4. **Run Full Automation**:
   ```bash
   curl -X POST "http://localhost:3000/api/automation" \
   -H "Content-Type: application/json" \
   -d '{"action": "full"}'
   ```

---

## 🔧 **Development Workflow**

### 1. Making Changes

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# Edit files as needed

# Test your changes
npm run dev

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### 2. Database Changes

```bash
# Edit schema.prisma
# Make your changes to the schema

# Push changes to database
npm run db:push

# Generate Prisma client
npx prisma generate
```

### 3. Adding New Components

```bash
# Create new component in src/components/
# Follow existing naming conventions

# Import and use in your pages
import YourComponent from '@/components/YourComponent'
```

---

## 🐛 **Common Issues & Solutions**

### 1. Database Connection Issues

**Problem**: `Error: Database connection failed`

**Solution**:
```bash
# Check if database file exists
ls -la prisma/dev.db

# Reset database
rm prisma/dev.db
npm run db:push
```

### 2. Prisma Client Generation Issues

**Problem**: `Error: Prisma Client is not generated`

**Solution**:
```bash
# Generate Prisma client
npx prisma generate

# If still not working, clean install
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### 3. AI API Issues

**Problem**: `Error: AI service unavailable`

**Solution**:
```bash
# Check your API key in .env.local
echo $ZAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $ZAI_API_KEY" \
     https://api.z-ai.com/v1/models
```

### 4. Build Issues

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Check TypeScript errors
npm run build

# Fix TypeScript issues
# Look for red squiggles in VS Code

# Clean build
rm -rf .next
npm run build
```

---

## 📚 **Next Steps**

### 1. Explore the Codebase
- Read through the API routes in `src/app/api/`
- Examine the components in `src/components/`
- Review the database schema in `prisma/schema.prisma`

### 2. Customize the Application
- Add your own RSS sources in `src/app/api/news/fetch/route.ts`
- Modify the AI prompts for different summarization styles
- Customize the UI components in `src/components/`

### 3. Deploy to Production
- Set up your production environment variables
- Configure your database for production
- Deploy to your preferred platform (Vercel, Netlify, etc.)

### 4. Contribute to the Project
- Fork the repository
- Create a feature branch
- Make your improvements
- Submit a pull request

---

## 📞 **Getting Help**

### Documentation
- **Main Documentation**: [docs/README.md](../README.md)
- **API Reference**: [docs/api-reference/](../api-reference/)
- **Architecture Guide**: [docs/architecture/](../architecture/)

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/arabic-tech-news-summarizer/issues)
- **Discussions**: [Join community discussions](https://github.com/your-org/arabic-tech-news-summarizer/discussions)
- **Slack**: [#tech-news-summarizer](https://your-workspace.slack.com)

### Team Support
- **Technical Issues**: [tech-lead@your-domain.com](mailto:tech-lead@your-domain.com)
- **Product Questions**: [pm@your-domain.com](mailto:pm@your-domain.com)
- **General Support**: [support@your-domain.com](mailto:support@your-domain.com)

---

## 🎯 **Learning Resources**

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Tutorials
- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [Prisma Crash Course](https://www.prisma.io/blog/getting-started-with-prisma)
- [Tailwind CSS Tutorial](https://tailwindcss.com/course)

### Videos
- [Next.js 15 Features](https://youtube.com/nextjs)
- [Prisma Database Setup](https://youtube.com/prisma)
- [Building with shadcn/ui](https://youtube.com/shadcn)

---

Happy coding! 🎉

**Last Updated**: 2025-06-20  
**Version**: 1.0.0  
**Maintainer**: Development Team