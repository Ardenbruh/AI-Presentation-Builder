# AI Presentation Builder

A powerful AI-powered presentation builder built with Next.js 15, featuring intelligent content generation, interactive slide editing, and beautiful presentations.

## 🚀 Features

- **AI-Powered Content Generation** - Create presentations with GPT-4
- **Interactive Slide Editor** - Real-time editing with Fabric.js canvas
- **Beautiful Presentations** - Gradient designs and responsive layouts
- **User Authentication** - Secure auth with Clerk
- **Real-time Collaboration** - Multi-user editing capabilities
- **Export & Sharing** - Present in fullscreen mode
- **Responsive Design** - Works on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (primary), Neo4j (relationships)
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4
- **Canvas**: Fabric.js
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- OpenAI API account
- Clerk account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Ardenbruh/ai-presentation-builder.git
cd ai-presentation-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_presentations"

# OpenAI
OPENAI_API_KEY=sk-your_openai_key_here

# Neo4j (Optional)
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password_here

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup

#### PostgreSQL Setup
1. Create a PostgreSQL database (recommend [Supabase](https://supabase.com) or [Neon](https://neon.tech))
2. Update your `DATABASE_URL` in `.env.local`
3. Run database migrations:

```bash
npx prisma generate
npx prisma db push
```

#### Neo4j Setup (Optional)
1. Create a free Neo4j instance on [AuraDB](https://neo4j.com/cloud/aura/)
2. Get your connection credentials
3. Add Neo4j environment variables

### 5. Authentication Setup

#### Clerk Configuration
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable and secret keys
4. Configure sign-in/sign-up methods in Clerk dashboard
5. Add your domain (localhost:3000 for development)

### 6. AI Setup

#### OpenAI Configuration
1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Add credits to your account
3. Set your API key in environment variables

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-presentation-builder/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── editor/[id]/       # Slide editor
│   │   ├── present/[id]/      # Presentation mode
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── slide-renderer.tsx # Main slide component
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   │   ├── prisma.ts         # Database client
│   │   ├── openai.ts         # AI integration
│   │   ├── neo4j.ts          # Graph database
│   │   └── ...
│   └── middleware.ts          # Clerk middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── ...
```

## 🎨 Key Components

### SlideRenderer
The core component that renders slides with:
- Beautiful gradient backgrounds
- Intelligent text formatting
- Bullet point styling
- Responsive design
- Markdown support

### AI Integration
- Smart content generation
- Presentation outline creation
- Content suggestions
- Image integration (planned)

### Authentication Flow
- Secure user registration/login
- Protected routes
- User session management

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: AI Presentation Builder"
git remote add origin https://github.com/Ardenbruh/your-repo-name.git
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Connect your GitHub account
- Import your repository
- Configure environment variables in Vercel dashboard
- Deploy!

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEO4J_URI=neo4j+s://...
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Database Migration for Production

```bash
npx prisma generate
npx prisma db push
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## 🎯 Features in Detail

### AI Content Generation
- Intelligent presentation outlines
- Context-aware slide content
- Bullet point optimization
- Content relevance filtering

### Slide Editor
- Real-time editing
- Drag-and-drop interface
- Text formatting
- Image integration
- Template system

### Presentation Mode
- Fullscreen presentation
- Keyboard navigation
- Speaker notes
- Smooth transitions

## 🔒 Security Features

- Clerk authentication
- Protected API routes
- Input validation
- SQL injection protection
- XSS prevention

## 📈 Performance Optimizations

- Next.js 15 App Router
- Server-side rendering
- Image optimization
- Code splitting
- Caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check database permissions
   - Ensure database is accessible

2. **Clerk Authentication Issues**
   - Verify API keys are correct
   - Check domain configuration
   - Ensure middleware is properly set up

3. **OpenAI API Errors**
   - Check API key validity
   - Verify account has credits
   - Monitor rate limits

4. **Build Errors**
   - Run `npm run type-check`
   - Check for missing dependencies
   - Verify environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- OpenAI for AI capabilities
- Clerk for authentication
- Vercel for hosting
- The open-source community

## 📞 Contact

**Vedant Mishra**
- GitHub: [@Ardenbruh](https://github.com/Ardenbruh)
- Project: [AI Presentation Builder](https://github.com/Ardenbruh/AI-Presentation-Builder)

---

⭐ Star this repository if you found it helpful!
