# Deployment Guide

## Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Presentation Builder"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Configure environment variables in Vercel dashboard
   - Deploy!

## Environment Variables for Production

Set these in your Vercel dashboard or deployment platform:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

## Database Setup

### PostgreSQL (Required)
1. Create a PostgreSQL database (recommend [Supabase](https://supabase.com) or [Neon](https://neon.tech))
2. Update your `DATABASE_URL` in environment variables
3. Run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Neo4j (Optional)
1. Create a Neo4j instance on [AuraDB](https://neo4j.com/cloud/aura/)
2. Add Neo4j credentials to environment variables

## Authentication Setup

### Clerk
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your production keys
4. Configure sign-in/sign-up methods
5. Set your production domain

## AI Setup

### OpenAI
1. Get API key from [OpenAI](https://platform.openai.com)
2. Add credits to your account
3. Set usage limits if needed

## Performance Tips

- Enable Vercel Analytics
- Configure caching headers
- Optimize images with Next.js Image component
- Monitor API usage and costs

## Monitoring

- Set up error tracking (Sentry recommended)
- Monitor database performance
- Track AI API usage
- Set up uptime monitoring

## Security

- Use strong environment variables
- Enable CORS properly
- Set up rate limiting
- Regular security updates

## Scaling

- Database connection pooling
- CDN for static assets
- Consider Redis for session storage
- Monitor and optimize bundle size
