# Arabic Tech News Summarizer

![Version](https://img.shields.io/badge/version-v2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue)

An advanced AI-powered Arabic Tech News Summarizer platform designed specifically for technology professionals, decision makers, and AI specialists in the Arabic-speaking world.

## 🌟 Features

### 🤖 AI-Powered Capabilities
- **Automated RSS Feed Processing**: Real-time fetching from top tech sources (TechCrunch, Wired, The Verge, etc.)
- **AI Translation & Summarization**: Advanced NLP models for accurate Arabic translation and intelligent summarization
- **Intelligent Tagging System**: AI-driven content categorization with 200+ predefined tech tags
- **Content Quality Assessment**: AI-powered evaluation of content relevance and accuracy

### 🎯 Executive-Focused Design
- **Professional Dashboard**: Interface designed for technology leaders and decision makers
- **Mobile-First Responsive**: Optimized for all devices with RTL Arabic support
- **Advanced Filtering**: Multi-dimensional filtering by category, tags, and search
- **Real-time Updates**: Automated daily processing with comprehensive logging

### 🔄 Automation System
- **Scheduled Processing**: Daily automated workflows for content processing
- **Error Recovery**: Robust error handling and retry mechanisms
- **Performance Monitoring**: Real-time system health tracking
- **Admin Panel**: Complete dashboard for system management

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ddevaix-commits/arabic-tech-news-summarizer.git
   cd arabic-tech-news-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## 📁 Project Structure

```
arabic-tech-news-summarizer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main homepage
│   │   ├── admin/             # Admin dashboard
│   │   ├── download/          # Download page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   └── lib/                   # Utilities and configurations
├── prisma/                    # Database schema
├── public/                    # Static assets
├── docs/                      # Documentation
└── README.md                  # This file
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **React 18** with modern hooks

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** with SQLite
- **Z-AI Web Dev SDK** for AI integration

### AI Integration
- **Advanced NLP** for content processing
- **Multi-language Translation** models
- **Executive Summarization** algorithms
- **Intelligent Content Categorization**

## 📊 API Endpoints

### Content Management
- `GET /api/news` - Fetch articles with filtering
- `POST /api/news/fetch` - Trigger news fetching
- `POST /api/news/summarize` - Generate summaries
- `POST /api/news/tag` - Apply intelligent tagging

### System Management
- `GET /api/categories` - Get categories
- `GET /api/tags` - Get tags
- `GET /api/sources` - Get news sources
- `POST /api/automation` - Control automation

### Admin Functions
- `GET /admin` - Admin dashboard
- `GET /api/automation/logs` - Processing logs

## 🎨 User Interface

### Main Features
- **RTL Arabic Interface**: Professional Arabic typography
- **Responsive Design**: Mobile-first approach
- **Advanced Search**: Real-time search with Arabic support
- **Content Cards**: Elegant article display with metadata
- **Filter System**: Multi-dimensional content filtering

### Admin Dashboard
- **System Monitoring**: Real-time performance metrics
- **Automation Control**: Manage automated workflows
- **Processing Logs**: Detailed operation history
- **Content Management**: Manage sources and categories

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# Add your AI API keys and configurations
```

### Database Setup
The project uses SQLite with Prisma ORM. Run `npm run db:push` to set up the database schema.

## 📝 Documentation

- **Product Requirements**: [PRD.md](PRD.md)
- **Technical Documentation**: [docs/](docs/)
- **API Reference**: [docs/api-reference/](docs/api-reference/)
- **Installation Guide**: [docs/implementation/getting-started.md](docs/implementation/getting-started.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Z-AI Web Dev SDK** for providing advanced AI capabilities
- **shadcn/ui** for the beautiful component library
- **Next.js** team for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Check the documentation in the `docs/` directory
- Review the processing logs in the admin panel

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Development
```bash
npm run dev
```

### Database Operations
```bash
npm run db:push    # Push schema changes
npm run db:studio  # Open Prisma Studio
```

---

**Built with ❤️ for the Arabic-speaking technology community**

🤖 Generated with [Claude Code](https://claude.ai/code)