# AI Presentation Builder

AI-powered presentation builder with Next.js 15, Groq API, and real-time editing.

## Features

- **AI Content Generation** - Create presentations with Groq API
- **Interactive Editor** - Real-time editing with Fabric.js
- **Beautiful Presentations** - Gradient designs and responsive layouts
- **User Authentication** - Secure auth with Clerk
- **Export & Sharing** - Present in fullscreen mode

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL, Neo4j (optional)
- **Authentication**: Clerk
- **AI**: Groq API
- **Canvas**: Fabric.js
- **UI**: shadcn/ui

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Ardenbruh/ai-presentation-builder.git
cd ai-presentation-builder
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_presentations"

# Groq API
GROQ_API_KEY=gsk_your_groq_key_here

# Optional: Neo4j
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password_here

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. API Keys

1. **Clerk**: Create app at [clerk.com](https://clerk.com)
2. **Groq**: Get API key from [console.groq.com](https://console.groq.com)
3. **Database**: Use [Supabase](https://supabase.com) or [Neon](https://neon.tech)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js 15 App Router
│   ├── api/            # API routes
│   ├── dashboard/      # User dashboard
│   ├── editor/[id]/    # Slide editor
│   └── present/[id]/   # Presentation mode
├── components/         # React components
├── lib/               # Utilities
└── middleware.ts      # Clerk middleware
```

## Key Features

### AI Content Generation
- Smart presentation outlines with Groq API
- Context-aware slide content
- Fast response times

### Slide Editor
- Real-time editing
- Drag-and-drop interface
- Text formatting
- Template system

### Presentation Mode
- Fullscreen presentation
- Keyboard navigation
- Smooth transitions

## Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Scripts

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Troubleshooting

- **Database**: Verify `DATABASE_URL` format
- **Clerk**: Check API keys and domain config
- **Groq**: Ensure API key is valid
- **Build**: Run `npm run type-check`

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## License

MIT License
