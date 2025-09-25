# arabic-tech-news-summarizer v1.0.0

## 🚀 Arabic Tech News Summarizer

A sophisticated Arabic news summarization platform for technology news, developers, and decision makers. This platform automatically fetches, translates, summarizes, and categorizes tech news from top sources using advanced AI capabilities.

### 🌟 Features

#### 🚀 Core Features
- **Automated News Fetching**: RSS feed integration with top tech news sources
- **AI-Powered Summarization**: Advanced Arabic summarization using z-ai-web-dev-sdk
- **Smart Tagging**: Intelligent categorization with predefined and AI-generated tags
- **Responsive Design**: Mobile-first experience with beautiful UI
- **Real-time Processing**: Automated daily news processing pipeline
- **Source Code Download**: Complete project download with multiple options

#### 🎯 Target Audience
- Technology executives and decision makers
- Developers and tech professionals
- AI and machine learning enthusiasts
- Business strategists in the tech sector

#### 📊 Advanced Features
- **Search & Filtering**: Advanced search by category, tags, and content
- **Analytics Dashboard**: Admin panel with processing statistics
- **Confidence Scoring**: AI confidence metrics for summaries
- **Insight Extraction**: Key points and impact analysis
- **Trending Topics**: Automated trending tag identification
- **Download Management**: Flexible source code download options

### 🛠️ Technology Stack

#### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **RTL Support** for Arabic typography

#### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** with SQLite database
- **z-ai-web-dev-sdk** for AI processing
- **RSS parsing** for news feed integration
- **Archiver** for ZIP file generation

#### Database Schema
- **News Articles**: Main content storage
- **Categories**: Article categorization
- **Tags**: Flexible tagging system
- **News Sources**: RSS feed management
- **Processing Logs**: System monitoring
- **User Preferences**: Personalization (future)

### 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- SQLite (included with Prisma)

### 🚀 Installation

1. **Extract the ZIP file**
   ```bash
   unzip arabic-tech-news-summarizer-v1.0.0.zip
   cd arabic-tech-news-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### 🌐 Access Points

- **Live Demo**: http://localhost:3000
- **Download Page**: http://localhost:3000/download
- **Admin Panel**: http://localhost:3000/admin
- **API Documentation**: Check the `/api` directory

### 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── news/          # News management APIs
│   │   ├── automation/    # Automation APIs
│   │   ├── categories/    # Category APIs
│   │   ├── tags/          # Tag APIs
│   │   ├── sources/       # Source APIs
│   │   └── download/      # Download APIs
│   ├── download/          # Download page
│   ├── admin/             # Admin dashboard
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── download/         # Download components
│   ├── EnhancedNewsCard.tsx
│   └── NewsClientFeatures.tsx
├── lib/                  # Utility libraries
│   └── db.ts             # Database connection
└── prisma/               # Database schema
    └── schema.prisma
```

### 🎮 Usage

#### For Users
1. **Browse News**: View the latest summarized tech news in Arabic
2. **Search & Filter**: Use the search bar and filters to find specific content
3. **Explore Categories**: Navigate through different tech categories
4. **View Insights**: Check AI-generated insights and key points
5. **Download Source**: Get the complete project source code

#### For Administrators
1. **Access Admin Panel**: Visit `/admin` for system management
2. **Run Automation**: Manually trigger news fetching, summarization, and tagging
3. **Monitor Logs**: View processing logs and system statistics
4. **Manage Sources**: Add or remove RSS feed sources
5. **Download Management**: Monitor and manage source code downloads

### 🔧 API Endpoints

#### News Management
- `GET /api/news` - Fetch articles with filtering and pagination
- `POST /api/news/fetch` - Fetch news from RSS feeds
- `POST /api/news/summarize` - Summarize articles (single/batch)
- `POST /api/news/tag` - Tag articles (single/batch)

#### Data Management
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags
- `GET /api/sources` - Get all news sources

#### Automation
- `POST /api/automation` - Run automation tasks
- `GET /api/automation` - Get system status
- `GET /api/automation/logs` - Get processing logs

#### Download Management
- `GET /api/download` - Download source code (ZIP)
- `POST /api/download` - Custom download options

### 🔄 Automation Pipeline

The system includes a comprehensive automation pipeline:

1. **News Fetching** (`/api/news/fetch`)
   - Fetches from multiple RSS feeds
   - Stores articles in database
   - Handles duplicates and errors

2. **Summarization** (`/api/news/summarize`)
   - Uses AI to generate Arabic summaries
   - Extracts key points and insights
   - Provides confidence scoring

3. **Tagging** (`/api/news/tag`)
   - AI-powered tag generation
   - Combines with predefined tech tags
   - Categorizes content automatically

4. **Full Automation** (`/api/automation`)
   - Runs complete pipeline
   - Handles errors gracefully
   - Provides detailed logging

### 📥 Download Features

#### Download Options
- **Standard Download**: Clean source code without dependencies
- **Full Download**: Including node_modules for offline development
- **Custom Download**: Select specific components and files
- **Progress Tracking**: Real-time download progress with status updates

#### File Exclusions
The download system automatically excludes:
- `node_modules` (unless explicitly included)
- `.git` directory
- `.next` build files
- Environment files (`.env*`)
- Log files (`*.log`)
- System files (`.DS_Store`, `Thumbs.db`)
- Temporary files (`*.tmp`, `*.temp`)
- IDE files (`.vscode`, `.idea`)
- Coverage reports

#### Security Features
- File integrity verification with SHA256 hashing
- Secure file serving with proper headers
- Automatic exclusion of sensitive files
- Download logging and monitoring

### 🎨 Customization

#### Adding News Sources
Edit the `RSS_FEEDS` array in `/src/app/api/news/fetch/route.ts`:

```typescript
const RSS_FEEDS = [
  {
    name: 'Source Name',
    url: 'https://example.com/feed.xml',
    category: 'Category Name'
  }
  // Add more sources...
]
```

#### Customizing Tags
Edit the `TECH_TAGS` array in `/src/app/api/news/tag/route.ts` to add predefined Arabic tech tags.

#### Styling
- Modify Tailwind classes in components
- Customize colors in the CSS variables
- Update shadcn/ui themes if needed

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### 📄 License

This project is licensed under the MIT License.

### 🆘 Support

For support and questions, please open an issue in the repository.

---

**ملخص التقنية** - Transforming tech news into actionable insights for Arabic-speaking professionals.
**Download the complete source code** and start building your own news summarization platform today!

---

### 📦 Package Information

- **Generated on**: 2025-09-14T12:48:14.535Z
- **Version**: 1.0.0
- **Node.js Version**: v22.19.0
- **Platform**: linux
- **Architecture**: x64

---

**Built with ❤️ for the Arabic tech community**
