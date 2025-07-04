// AI Provider configurations and implementations

// Groq API (Free tier available)
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

// Anthropic Claude API
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// Hugging Face API (Free tier)
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

// Pexels API for images
const PEXELS_API_KEY = process.env.PEXELS_API_KEY

// Provider selection
export type AIProvider = 'groq' | 'anthropic' | 'huggingface' | 'mock'

const getActiveProvider = (): AIProvider => {
  if (GROQ_API_KEY) return 'groq'
  if (ANTHROPIC_API_KEY) return 'anthropic'
  if (HUGGINGFACE_API_KEY) return 'huggingface'
  return 'mock' // Fallback to mock AI for testing
}

// Enhanced Mock AI for testing without any API keys
const generateMockContent = (prompt: string) => {
  const topics = prompt.toLowerCase()
  
  // Extract key words for dynamic content generation
  const extractKeywords = (text: string) => {
    const words = text.split(/\s+/)
    const keywords = words.filter(word => 
      word.length > 4 && 
      !['about', 'create', 'slide', 'presentation', 'content'].includes(word.toLowerCase())
    )
    return keywords.slice(0, 3) // Get first 3 relevant keywords
  }
  
  const keywords = extractKeywords(prompt)
  const uniqueId = Math.floor(Math.random() * 1000) // For uniqueness
  
  // Web Development (specific to current test)
  if (topics.includes('web development') || topics.includes('responsive') || topics.includes('performance') || topics.includes('security') || topics.includes('accessibility')) {
    const webTopics = [
      {
        title: "Responsive Design Implementation",
        content: "• Mobile-First Approach: Design for smallest screens first\n• Flexible Grid Systems: CSS Grid and Flexbox strategies\n• Breakpoint Strategy: 320px, 768px, 1024px, 1440px\n• Image Optimization: WebP format, lazy loading, responsive images\n• Touch-Friendly UI: 44px minimum touch targets\n• Cross-Browser Compatibility: Progressive enhancement approach",
        focus: "responsive design and mobile optimization"
      },
      {
        title: "Performance Optimization Strategies",
        content: "• Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1\n• Code Splitting: Lazy load non-critical JavaScript\n• Image Optimization: Next-gen formats, compression\n• Caching Strategy: Service workers, CDN, browser caching\n• Bundle Analysis: Tree shaking and dead code elimination\n• Critical Rendering Path: Inline critical CSS",
        focus: "performance metrics and optimization"
      },
      {
        title: "Security Best Practices",
        content: "• Content Security Policy: Prevent XSS attacks\n• HTTPS Everywhere: TLS 1.3 implementation\n• Input Validation: Server and client-side sanitization\n• Authentication: JWT tokens, secure session management\n• CORS Configuration: Proper origin validation\n• Dependency Security: Regular vulnerability scanning",
        focus: "web security and protection"
      },
      {
        title: "Accessibility Standards (WCAG 2.1)",
        content: "• Semantic HTML: Proper heading structure and landmarks\n• Keyboard Navigation: Tab order and focus management\n• Screen Reader Support: ARIA labels and descriptions\n• Color Contrast: 4.5:1 ratio for normal text\n• Alternative Text: Descriptive alt attributes for images\n• Error Handling: Clear, actionable error messages",
        focus: "web accessibility and inclusive design"
      },
      {
        title: "Modern Development Workflow",
        content: "• Version Control: Git branching strategies (GitFlow)\n• CI/CD Pipeline: Automated testing and deployment\n• Code Quality: ESLint, Prettier, type checking\n• Testing Strategy: Unit, integration, and E2E tests\n• Documentation: Component libraries and API docs\n• Monitoring: Performance tracking and error reporting",
        focus: "development processes and tooling"
      }
    ]
    
    const randomTopic = webTopics[Math.floor(Math.random() * webTopics.length)]
    
    return {
      title: randomTopic.title,
      content: randomTopic.content,
      speakerNotes: `When discussing ${randomTopic.focus}, focus on practical implementation strategies and real-world examples. Share specific metrics and case studies to demonstrate impact. Emphasize the business value and user experience improvements that result from following these best practices.`,
      designSuggestions: {
        layout: "title-content",
        visualElements: ["diagram", "code-snippet", "metrics"],
        imagePrompt: `Professional web development illustration showing ${randomTopic.focus} with modern UI elements`,
        colors: ["blue", "green", "purple"],
        typography: "modern"
      },
      aiImageNeeded: true
    }
  }
  
  // Gaming & Technology - Remove inappropriate content
  if (topics.includes('doom eternal') || topics.includes('gaming') || topics.includes('game')) {
    // Return generic content instead of specific game content
    return {
      title: "Digital Entertainment & Technology",
      content: "• Interactive Media: Engaging user experiences\n• Technology Innovation: Modern development approaches\n• User Interface Design: Intuitive navigation systems\n• Performance Optimization: Smooth user interactions\n• Accessibility Features: Inclusive design principles\n• Community Building: Social engagement platforms",
      speakerNotes: "This slide covers general principles of digital entertainment and technology development, focusing on user experience and technical excellence.",
      designSuggestions: {
        layout: "title-content",
        visualElements: ["technology-illustration", "interface-mockup"],
        imagePrompt: "Modern technology and digital innovation illustration",
        colors: ["blue", "purple", "teal"],
        typography: "bold"
      },
      aiImageNeeded: true
    }
  }
  
  // Business & Marketing
  if (topics.includes('business') || topics.includes('marketing') || topics.includes('roi') || topics.includes('strategy')) {
    return {
      title: "Digital Marketing Performance Dashboard",
      content: "• Customer Acquisition Cost (CAC): $45 average across channels\n• Lifetime Value (LTV): $380 per customer\n• LTV:CAC Ratio: 8.4:1 (Excellent performance)\n• Top Performing Channels: Email (35%), Social Media (28%), SEO (22%)\n• Conversion Optimization: A/B testing improved rates by 23%\n• Attribution Analysis: Multi-touch attribution modeling",
      speakerNotes: "Our digital marketing efforts have shown exceptional ROI this quarter. The 8.4:1 LTV to CAC ratio significantly exceeds industry benchmarks of 3:1. Email marketing continues to be our strongest performer, driven by personalization and automation workflows. We're seeing emerging opportunities in social commerce and video content, particularly on TikTok and Instagram Reels. The A/B testing program has been crucial for optimization.",
      designSuggestions: {
        layout: "chart",
        visualElements: ["bar-chart", "pie-chart", "trend-line"],
        imagePrompt: "Professional marketing analytics dashboard with colorful charts, graphs, and KPI metrics",
        colors: ["blue", "green", "purple"],
        typography: "modern"
      },
      aiImageNeeded: true
    }
  }
  
  // Technology & Data Science - Generic fallback but more varied
  const techTopics = [
    {
      title: `${keywords[0] || 'Advanced'} Technology Implementation`,
      content: `• Architecture Design: Scalable and maintainable solutions\n• Performance Optimization: ${uniqueId}% improvement in efficiency\n• Security Framework: Multi-layer protection strategy\n• Integration Strategy: API-first approach\n• Monitoring Solutions: Real-time analytics and alerting\n• Best Practices: Industry standards and compliance`,
      focus: "technical implementation"
    },
    {
      title: `${keywords[0] || 'Modern'} System Architecture`,
      content: `• Microservices Design: Containerized application components\n• Database Strategy: ACID compliance and scalability\n• Caching Layer: Redis implementation for performance\n• Load Balancing: Traffic distribution and failover\n• DevOps Pipeline: Automated CI/CD workflows\n• Monitoring Stack: Comprehensive observability`,
      focus: "system architecture"
    },
    {
      title: `${keywords[0] || 'Enterprise'} Solution Framework`,
      content: `• Requirements Analysis: Stakeholder alignment process\n• Technology Stack: Modern frameworks and libraries\n• Quality Assurance: Automated testing strategies\n• Documentation: Comprehensive technical specifications\n• Training Program: Knowledge transfer protocols\n• Maintenance Plan: Long-term support strategy`,
      focus: "solution framework"
    }
  ]
  
  const randomTech = techTopics[Math.floor(Math.random() * techTopics.length)]
  
  return {
    title: randomTech.title,
    content: randomTech.content,
    speakerNotes: `This presentation focuses on ${randomTech.focus} with emphasis on practical implementation. Key considerations include scalability, maintainability, and performance optimization. Real-world examples and case studies demonstrate the effectiveness of these approaches.`,
    designSuggestions: {
      layout: "two-column",
      visualElements: ["flow-diagram", "performance-chart", "architecture-diagram"],
      imagePrompt: `Professional technical diagram showing ${randomTech.focus} with modern UI elements and data visualizations`,
      colors: ["blue", "teal", "purple"],
      typography: "modern"
    },
    aiImageNeeded: true
  }
  
  // Education & Learning
  if (topics.includes('education') || topics.includes('learning') || topics.includes('training') || topics.includes('development')) {
    return {
      title: "Modern Learning Technologies & Methods",
      content: "• Microlearning: 5-10 minute focused sessions\n• Adaptive Learning: AI-driven personalized paths\n• Gamification: Points, badges, and leaderboards\n• Social Learning: Peer collaboration and discussion\n• Mobile-First: 70% of learners use mobile devices\n• Analytics: Real-time progress tracking and insights",
      speakerNotes: "The learning landscape has evolved dramatically with technology integration. Microlearning addresses modern attention spans and busy schedules. Adaptive learning algorithms personalize content based on individual progress and learning style. Gamification elements increase engagement by 40% according to our studies. Mobile accessibility is crucial as most learning happens outside traditional classroom settings.",
      designSuggestions: {
        layout: "image-focus",
        visualElements: ["infographic", "learning-path", "mobile-mockup"],
        imagePrompt: "Modern e-learning interface with mobile devices, progress tracking, and gamification elements",
        colors: ["orange", "blue", "green"],
        typography: "friendly"
      },
      aiImageNeeded: true
    }
  }
  
  // Health & Wellness
  if (topics.includes('health') || topics.includes('wellness') || topics.includes('fitness') || topics.includes('medical')) {
    return {
      title: "Digital Health Innovation Trends",
      content: "• Telemedicine: 85% patient satisfaction rate\n• Wearable Integration: Real-time health monitoring\n• AI Diagnostics: 20% faster diagnosis accuracy\n• Mental Health Apps: 60% reduction in anxiety levels\n• Personalized Medicine: Genomic-based treatment plans\n• Health Data Security: HIPAA-compliant platforms",
      speakerNotes: "Digital health has transformed patient care delivery and outcomes. Telemedicine adoption accelerated during the pandemic and remains high due to convenience and accessibility. Wearable devices provide continuous monitoring, enabling proactive health management. AI-assisted diagnostics help healthcare providers make faster, more accurate decisions. Mental health support through apps has shown significant impact on patient wellbeing.",
      designSuggestions: {
        layout: "two-column",
        visualElements: ["health-dashboard", "device-mockup", "chart"],
        imagePrompt: "Healthcare technology dashboard with medical devices, patient data, and health monitoring charts",
        colors: ["blue", "green", "white"],
        typography: "clean"
      },
      aiImageNeeded: true
    }
  }

  // Default intelligent content based on prompt analysis
  const promptWords = topics.split(' ')
  const keyTerms = promptWords.filter((word: string) => word.length > 3)
  const primaryTerm = keyTerms[0] || 'topic'
  
  return {
    title: `Strategic Analysis: ${prompt.slice(0, 35)}${prompt.length > 35 ? '...' : ''}`,
    content: `• Current Landscape: Comprehensive overview of ${primaryTerm} trends\n• Key Challenges: Primary obstacles and market barriers\n• Opportunities: Emerging trends and growth potential\n• Best Practices: Industry-proven methodologies\n• Implementation Strategy: Step-by-step execution plan\n• Success Metrics: KPIs and measurement frameworks\n• Future Outlook: Long-term trends and predictions`,
    speakerNotes: `This presentation provides a comprehensive analysis of ${prompt}. Start with the current landscape to establish context, then dive into challenges to highlight pain points your audience likely faces. The opportunities section should energize the audience about potential solutions. Best practices provide actionable insights they can implement immediately. Remember to pause for questions and encourage discussion throughout the presentation.`,
    designSuggestions: {
      layout: "title-content",
      visualElements: ["diagram", "infographic", "process-flow"],
      imagePrompt: `Professional business illustration representing ${prompt} with modern design elements`,
      colors: ["blue", "gray", "accent"],
      typography: "modern"
    },
    aiImageNeeded: true
  }
}

// Groq API implementation (Free tier: 100 requests/hour)
const generateWithGroq = async (prompt: string) => {
  try {
    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Updated model
        messages: [
          {
            role: 'system',
            content: `You are an expert presentation designer. Generate professional slide content in JSON format.
            Return ONLY a valid JSON object with this exact structure:
            {
              "title": "Compelling slide title (max 60 chars)",
              "content": "Well-structured content with bullet points using • symbol",
              "speakerNotes": "Detailed presenter notes with timing and key points",
              "designSuggestions": {
                "layout": "title-content",
                "visualElements": ["chart", "diagram", "photo"],
                "imagePrompt": "Description for image generation",
                "colors": ["blue", "green"],
                "typography": "modern"
              },
              "aiImageNeeded": true
            }
            
            IMPORTANT: 
            - Make each slide completely unique and specific to the topic
            - Include concrete examples, statistics, or case studies when relevant
            - Use different content structures (lists, paragraphs, frameworks)
            - Vary the focus and perspective for each slide
            - Include actionable insights specific to the slide topic`
          },
          {
            role: 'user',
            content: `Create professional slide content about: ${prompt}
            
            Make this slide unique and avoid generic content. Include specific details and examples relevant to this particular aspect of the topic.`
          }
        ],
        temperature: 0.8, // Increased for more variety
        max_tokens: 1200 // Increased for more detailed content
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content generated from Groq')
    }

    // Clean the content first to remove control characters and fix common issues
    const cleanedContent = content
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/\\n/g, '\\n') // Ensure newlines are properly escaped
      .replace(/\\t/g, '\\t') // Ensure tabs are properly escaped
      .replace(/\\"/g, '\\"') // Ensure quotes are properly escaped
      .trim()

    // Extract JSON from the response (in case there's extra text)
    let jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsedContent = JSON.parse(jsonMatch[0])
        
        // Ensure we always have image generation enabled
        parsedContent.aiImageNeeded = true
        
        // Enhance image prompt if it's too generic
        if (!parsedContent.designSuggestions?.imagePrompt || parsedContent.designSuggestions.imagePrompt.length < 20) {
          parsedContent.designSuggestions = parsedContent.designSuggestions || {}
          parsedContent.designSuggestions.imagePrompt = `Professional illustration for ${parsedContent.title} with modern business elements`
        }
        
        return parsedContent
      } catch (parseError: any) {
        console.error('JSON parsing failed even after cleaning:', parseError)
        console.error('Cleaned content:', cleanedContent)
        throw new Error(`Failed to parse JSON: ${parseError.message}`)
      }
    } else {
      // Fallback if no JSON found
      const lines = content.split('\n').filter((line: string) => line.trim()).slice(0, 6)
      return {
        title: `${prompt.slice(0, 40)}${prompt.length > 40 ? '...' : ''}`,
        content: lines.map((line: string) => `• ${line.trim()}`).join('\n'),
        speakerNotes: `This presentation covers ${prompt}. Focus on engaging your audience with concrete examples and encourage questions throughout.`,
        designSuggestions: {
          layout: "title-content",
          visualElements: ["diagram", "chart"],
          imagePrompt: `Professional business illustration about ${prompt}`,
          colors: ["blue", "gray"],
          typography: "modern"
        },
        aiImageNeeded: true
      }
    }
  } catch (error) {
    console.error('Groq API error:', error)
    throw error
  }
}

// Hugging Face API implementation (Free tier available)
const generateWithHuggingFace = async (prompt: string) => {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Create a professional presentation slide about: ${prompt}. Include title, bullet points, and speaker notes.`,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Parse the response and format it properly
    const content = data[0]?.generated_text || prompt
    
    return {
      title: `Professional Insights: ${prompt.slice(0, 40)}...`,
      content: `• Overview: ${content.slice(0, 100)}...\n• Key Points: Strategic analysis and recommendations\n• Implementation: Action steps for success\n• Metrics: Success indicators and KPIs`,
      speakerNotes: `This slide covers important aspects of ${prompt}. Engage your audience with specific examples and encourage questions.`,
      designSuggestions: {
        layout: "title-content",
        visualElements: ["diagram", "chart"],
        imagePrompt: `Professional illustration about ${prompt}`,
        colors: ["blue", "gray"],
        typography: "modern"
      },
      aiImageNeeded: true
    }
  } catch (error) {
    console.error('Hugging Face API error:', error)
    throw error
  }
}

// Main slide content generation function
export async function generateSlideContent(prompt: string, context?: string) {
  const provider = getActiveProvider()
  console.log(`Using AI provider: ${provider}`)

  try {
    switch (provider) {
      case 'groq':
        return await generateWithGroq(prompt)
      
      case 'huggingface':
        return await generateWithHuggingFace(prompt)
      
      case 'mock':
      default:
        console.log('Using mock AI provider for testing')
        return generateMockContent(prompt)
    }
  } catch (error) {
    console.error(`Error with ${provider} provider:`, error)
    
    // Fallback to mock content
    console.log('Falling back to mock AI content')
    return generateMockContent(prompt)
  }
}

// Enhanced presentation outline generation
export async function generatePresentationOutline(topic: string, slideCount: number = 8) {
  const provider = getActiveProvider()
  console.log(`Generating presentation outline with ${provider} provider`)

  const topicLower = topic.toLowerCase()
  let mockOutline

  // Generate topic-specific outlines
  if (topicLower.includes('queen') || topicLower.includes('freddie mercury') || topicLower.includes('bohemian rhapsody')) {
    mockOutline = {
      title: `Welcome to the Fabulous World of Queen: A Musical Journey`,
      description: `An epic exploration of Queen's legendary impact on rock music and culture`,
      theme: "creative",
      targetAudience: "Music enthusiasts and fans",
      keyMessage: `Celebrate the timeless legacy and revolutionary artistry of Queen`,
      slides: [
        {
          order: 1,
          title: "Welcome to the World of Queen",
          type: "intro",
          description: "Introduction to Queen's legendary status",
          contentPrompt: `Introduction to Queen band, their formation in 1970, and why they're considered one of the greatest rock bands of all time`,
          estimatedTime: "3 minutes",
          visualType: "image"
        },
        {
          order: 2,
          title: "The Formation and Early Years (1970-1973)",
          type: "content", 
          description: "How Queen came together and their early musical development",
          contentPrompt: `Queen's formation by Brian May, Roger Taylor, Freddie Mercury, and John Deacon, their early struggles and first albums`,
          estimatedTime: "4 minutes",
          visualType: "timeline"
        },
        {
          order: 3,
          title: "Freddie Mercury: The Legendary Frontman",
          type: "content",
          description: "Exploring Freddie's unique voice and stage presence",
          contentPrompt: `Freddie Mercury's incredible vocal range, flamboyant stage presence, songwriting genius, and his impact on rock music`,
          estimatedTime: "5 minutes",
          visualType: "image"
        },
        {
          order: 4,
          title: "Iconic Songs and Albums",
          type: "content",
          description: "Queen's most influential musical works",
          contentPrompt: `Queen's greatest hits including Bohemian Rhapsody, We Will Rock You, We Are The Champions, Another One Bites the Dust, and their legendary albums`,
          estimatedTime: "5 minutes", 
          visualType: "infographic"
        },
        {
          order: 5,
          title: "Live Aid 1985: The Greatest Performance",
          type: "content",
          description: "Queen's legendary Live Aid performance",
          contentPrompt: `Queen's iconic 20-minute Live Aid performance at Wembley Stadium in 1985, widely considered the greatest live rock performance of all time`,
          estimatedTime: "4 minutes",
          visualType: "image"
        },
        {
          order: 6,
          title: "Musical Innovation and Experimentation",
          type: "content",
          description: "Queen's pioneering approach to rock music",
          contentPrompt: `Queen's musical innovations including operatic rock, multi-layered harmonies, guitar orchestration, and genre-blending experiments`,
          estimatedTime: "4 minutes",
          visualType: "diagram"
        },
        {
          order: 7,
          title: "Cultural Impact and Legacy",
          type: "content",
          description: "Queen's lasting influence on music and culture",
          contentPrompt: `Queen's impact on popular culture, influence on other artists, movie soundtracks, and their continued relevance with new generations`,
          estimatedTime: "4 minutes",
          visualType: "infographic"
        },
        {
          order: 8,
          title: "Queen Today: The Legacy Lives On",
          type: "conclusion",
          description: "Queen's continued influence and Queen + Adam Lambert",
          contentPrompt: `Queen's enduring legacy, Queen + Adam Lambert tours, biographical films like Bohemian Rhapsody, and their place in rock history`,
          estimatedTime: "3 minutes",
          visualType: "image"
        }
      ]
    }
  } else if (topicLower.includes('business') || topicLower.includes('marketing') || topicLower.includes('strategy')) {
    mockOutline = {
      title: `Business Strategy: ${topic}`,
      description: `Strategic analysis and actionable insights for ${topic}`,
      theme: "professional",
      targetAudience: "Business executives and stakeholders",
      keyMessage: `Transform your approach to ${topic} with data-driven strategies`,
      slides: [
        {
          order: 1,
          title: "Executive Summary",
          type: "intro",
          description: "Key findings and strategic recommendations",
          contentPrompt: `Executive summary for ${topic} with key findings and strategic recommendations`,
          estimatedTime: "3 minutes",
          visualType: "text"
        },
        {
          order: 2,
          title: "Market Landscape",
          type: "content",
          description: "Current market analysis and competitive positioning",
          contentPrompt: `Market landscape and competitive analysis for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "chart"
        },
        {
          order: 3,
          title: "Customer Insights",
          type: "content",
          description: "Target audience analysis and behavior patterns",
          contentPrompt: `Customer insights and behavior analysis for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "infographic"
        },
        {
          order: 4,
          title: "Strategic Framework",
          type: "content",
          description: "Core strategy and methodological approach",
          contentPrompt: `Strategic framework and methodology for ${topic}`,
          estimatedTime: "5 minutes",
          visualType: "diagram"
        },
        {
          order: 5,
          title: "Implementation Roadmap",
          type: "content",
          description: "Phase-by-phase execution plan",
          contentPrompt: `Implementation roadmap and execution plan for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "timeline"
        },
        {
          order: 6,
          title: "ROI & Metrics",
          type: "content",
          description: "Expected returns and success measurements",
          contentPrompt: `ROI analysis and success metrics for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "chart"
        },
        {
          order: 7,
          title: "Risk Mitigation",
          type: "content",
          description: "Potential challenges and mitigation strategies",
          contentPrompt: `Risk analysis and mitigation strategies for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "matrix"
        },
        {
          order: 8,
          title: "Next Steps & Q&A",
          type: "conclusion",
          description: "Action items and discussion",
          contentPrompt: `Next steps and action items for ${topic} implementation`,
          estimatedTime: "4 minutes",
          visualType: "text"
        }
      ]
    }
  } else if (topicLower.includes('tech') || topicLower.includes('ai') || topicLower.includes('data') || topicLower.includes('development')) {
    mockOutline = {
      title: `Technology Deep Dive: ${topic}`,
      description: `Technical analysis and implementation guide for ${topic}`,
      theme: "modern",
      targetAudience: "Technical teams and decision makers",
      keyMessage: `Leverage ${topic} for competitive advantage and innovation`,
      slides: [
        {
          order: 1,
          title: "Technical Overview",
          type: "intro",
          description: "Introduction to core concepts and architecture",
          contentPrompt: `Technical overview and architecture introduction for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "diagram"
        },
        {
          order: 2,
          title: "Current State Analysis",
          type: "content",
          description: "Existing systems and technology stack",
          contentPrompt: `Current state analysis and technology assessment for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "architecture"
        },
        {
          order: 3,
          title: "Technical Requirements",
          type: "content",
          description: "Specifications and performance criteria",
          contentPrompt: `Technical requirements and specifications for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "matrix"
        },
        {
          order: 4,
          title: "Solution Architecture",
          type: "content",
          description: "Proposed technical design and components",
          contentPrompt: `Solution architecture and design principles for ${topic}`,
          estimatedTime: "5 minutes",
          visualType: "flowchart"
        },
        {
          order: 5,
          title: "Implementation Strategy",
          type: "content",
          description: "Development phases and deployment plan",
          contentPrompt: `Implementation strategy and development phases for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "timeline"
        },
        {
          order: 6,
          title: "Performance & Scalability",
          type: "content",
          description: "Optimization strategies and growth planning",
          contentPrompt: `Performance optimization and scalability planning for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "chart"
        },
        {
          order: 7,
          title: "Security & Compliance",
          type: "content",
          description: "Security measures and regulatory requirements",
          contentPrompt: `Security framework and compliance requirements for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "checklist"
        },
        {
          order: 8,
          title: "Technical Q&A",
          type: "conclusion",
          description: "Technical discussion and troubleshooting",
          contentPrompt: `Technical Q&A and troubleshooting guide for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "text"
        }
      ]
    }
  } else {
    // Generic professional outline
    mockOutline = {
      title: `Professional Analysis: ${topic}`,
      description: `Comprehensive analysis and strategic insights for ${topic}`,
      theme: "professional",
      targetAudience: "Professionals and stakeholders",
      keyMessage: `Understanding and leveraging ${topic} for success`,
      slides: [
        {
          order: 1,
          title: "Introduction & Agenda",
          type: "intro",
          description: "Welcome and presentation overview",
          contentPrompt: `Introduction and agenda for ${topic} presentation`,
          estimatedTime: "2 minutes",
          visualType: "text"
        },
        {
          order: 2,
          title: "Current Landscape",
          type: "content",
          description: "Industry overview and current trends",
          contentPrompt: `Current landscape and industry trends for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "chart"
        },
        {
          order: 3,
          title: "Key Challenges",
          type: "content",
          description: "Primary obstacles and pain points",
          contentPrompt: `Key challenges and obstacles in ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "diagram"
        },
        {
          order: 4,
          title: "Strategic Opportunities",
          type: "content",
          description: "Growth potential and emerging trends",
          contentPrompt: `Strategic opportunities and growth potential in ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "infographic"
        },
        {
          order: 5,
          title: "Best Practices",
          type: "content",
          description: "Proven methodologies and frameworks",
          contentPrompt: `Best practices and proven methodologies for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "process"
        },
        {
          order: 6,
          title: "Implementation Guide",
          type: "content",
          description: "Step-by-step action plan",
          contentPrompt: `Implementation guide and action plan for ${topic}`,
          estimatedTime: "4 minutes",
          visualType: "timeline"
        },
        {
          order: 7,
          title: "Success Metrics",
          type: "content",
          description: "KPIs and measurement strategies",
          contentPrompt: `Success metrics and KPIs for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "scorecard"
        },
        {
          order: 8,
          title: "Conclusion & Next Steps",
          type: "conclusion",
          description: "Summary and action items",
          contentPrompt: `Conclusion and next steps for ${topic}`,
          estimatedTime: "3 minutes",
          visualType: "text"
        }
      ]
    }
  }

  try {
    if (provider === 'groq' && GROQ_API_KEY) {
      const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are a presentation expert. Create ONLY valid JSON for a presentation outline. 
              Use this exact structure:
              {
                "title": "Presentation Title",
                "description": "Brief description",
                "theme": "professional|creative|technical",
                "targetAudience": "Target audience",
                "keyMessage": "Main message",
                "slides": [
                  {
                    "order": 1,
                    "title": "Slide Title",
                    "type": "intro|content|conclusion",
                    "description": "Slide description",
                    "contentPrompt": "Detailed content prompt",
                    "estimatedTime": "X minutes",
                    "visualType": "image|chart|text|diagram"
                  }
                ]
              }
              
              Return ONLY the JSON object, no additional text or explanation.`
            },
            {
              role: 'user',
              content: `Create a ${slideCount}-slide presentation outline about: ${topic}. Return only valid JSON.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0]?.message?.content || ''
        
        try {
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
          } else {
            throw new Error('No JSON found in response')
          }
        } catch (parseError) {
          console.log('JSON parsing failed, using mock outline')
          return mockOutline
        }
      }
    }

    // Return mock outline for all other cases
    return mockOutline
  } catch (error) {
    console.error('Error generating outline:', error)
    return mockOutline
  }
}

// Enhanced image generation using curated placeholder services
export async function generateImage(prompt: string, style: string = 'professional') {
  try {
    const promptLower = prompt.toLowerCase()
    
    // Add randomization to ensure different images
    const randomSeed = Math.floor(Math.random() * 1000)
    
    // Business & Marketing images
    if (promptLower.includes('business') || promptLower.includes('marketing') || promptLower.includes('analytics') || promptLower.includes('dashboard') || promptLower.includes('strategy')) {
      const businessImages = [
        `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Business analytics
        `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // Charts and graphs
        `https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Marketing team
        `https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Business meeting
        `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // Professional presentation
        `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`  // Stock charts
      ]
      return businessImages[Math.floor(Math.random() * businessImages.length)]
    }
    
    // Gaming & Entertainment images
    if (promptLower.includes('gaming') || promptLower.includes('doom') || promptLower.includes('game') || promptLower.includes('esports') || promptLower.includes('entertainment') || promptLower.includes('fps') || promptLower.includes('shooter') || promptLower.includes('multiplayer')) {
      const gamingImages = [
        `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Gaming setup
        `https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // Gaming controller
        `https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Gaming workspace
        `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Gaming computer
        `https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // Esports arena
        `https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`, // Gaming equipment
        `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 6}`, // Code/development
        `https://images.unsplash.com/photo-1555864326-5cf22ef123cf?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 7}`  // Gaming neon
      ]
      return gamingImages[Math.floor(Math.random() * gamingImages.length)]
    }
    
    // Technology & AI images
    if (promptLower.includes('technology') || promptLower.includes('tech') || promptLower.includes('ai') || promptLower.includes('machine learning') || promptLower.includes('data') || promptLower.includes('software') || promptLower.includes('programming') || promptLower.includes('development') || promptLower.includes('coding')) {
      const techImages = [
        `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Code on screen
        `https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // AI/Circuit board
        `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Data visualization
        `https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Laptop with code
        `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // Server room
        `https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`, // Tech workspace
        `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 6}`, // Code editor
        `https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 7}`  // Tech background
      ]
      return techImages[Math.floor(Math.random() * techImages.length)]
    }
    
    // Finance & Investment images
    if (promptLower.includes('finance') || promptLower.includes('investment') || promptLower.includes('portfolio') || promptLower.includes('market') || promptLower.includes('revenue') || promptLower.includes('roi')) {
      const financeImages = [
        `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Stock charts
        `https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // Financial data
        `https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Calculator and charts
        `https://images.unsplash.com/photo-1641580318281-70d7a014ebf2?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Investment planning
        `https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // Financial charts
        `https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`  // Money and finance
      ]
      return financeImages[Math.floor(Math.random() * financeImages.length)]
    }
    
    // Health & Medical images
    if (promptLower.includes('health') || promptLower.includes('medical') || promptLower.includes('wellness') || promptLower.includes('fitness') || promptLower.includes('healthcare')) {
      const healthImages = [
        `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Medical technology
        `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // Healthcare professional
        `https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Health monitoring
        `https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Wellness concept
        `https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // Medical equipment
        `https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`  // Healthcare team
      ]
      return healthImages[Math.floor(Math.random() * healthImages.length)]
    }
    
    // Education & Learning images
    if (promptLower.includes('education') || promptLower.includes('learning') || promptLower.includes('training') || promptLower.includes('development') || promptLower.includes('academic')) {
      const educationImages = [
        `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Students learning
        `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // Online learning
        `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Study materials
        `https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Digital learning
        `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // University classroom
        `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`  // Library
      ]
      return educationImages[Math.floor(Math.random() * educationImages.length)]
    }
    
    // Professional/Generic images with variety
    const professionalImages = [
      `https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format&seed=${randomSeed}`, // Team meeting
      `https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 1}`, // Strategy planning
      `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 2}`, // Office workspace
      `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 3}`, // Professional presentation
      `https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 4}`, // Collaboration
      `https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 5}`, // Modern office
      `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 6}`, // Teamwork
      `https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop&auto=format&seed=${randomSeed + 7}`  // Business discussion
    ]
    
    return professionalImages[Math.floor(Math.random() * professionalImages.length)]
    
  } catch (error) {
    console.error('Error generating image:', error)
    return `https://via.placeholder.com/800x600/f0f0f0/333333?text=${encodeURIComponent(prompt.slice(0, 30))}&seed=${Math.floor(Math.random() * 1000)}`
  }
}

// Enhanced slide with visuals
export async function enhanceSlideWithVisuals(slideData: any) {
  try {
    console.log('Enhancing slide with visuals:', slideData.title)
    
    // Generate image if needed
    let imageUrl = null
    if (slideData.aiImageNeeded && slideData.designSuggestions?.imagePrompt) {
      imageUrl = await generateImage(slideData.designSuggestions.imagePrompt)
      console.log('Generated image URL:', imageUrl)
    } else if (slideData.aiImageNeeded) {
      // Fallback image generation based on title
      imageUrl = await generateImage(slideData.title)
      console.log('Generated fallback image URL:', imageUrl)
    }
    
    // Create fabric objects for the slide
    const fabricObjects = []
    
    // Title
    fabricObjects.push({
      type: 'textbox',
      text: slideData.title,
      left: 50,
      top: 30,
      fontSize: 28,
      fontWeight: 'bold',
      width: 700,
      fill: '#1a202c'
    })
    
    if (imageUrl) {
      // Two-column layout with image
      fabricObjects.push({
        type: 'image',
        src: imageUrl,
        left: 50,
        top: 100,
        width: 300,
        height: 200,
        scaleX: 1,
        scaleY: 1
      })
      
      fabricObjects.push({
        type: 'textbox',
        text: slideData.content,
        left: 370,
        top: 100,
        fontSize: 16,
        width: 380,
        height: 400,
        fill: '#2d3748'
      })
    } else {
      // Single column text layout
      fabricObjects.push({
        type: 'textbox',
        text: slideData.content,
        left: 50,
        top: 120,
        fontSize: 16,
        width: 700,
        height: 400,
        fill: '#2d3748'
      })
    }
    
    return {
      ...slideData,
      generatedImage: imageUrl,
      content: {
        type: 'fabric',
        objects: fabricObjects
      }
    }
  } catch (error) {
    console.error('Error enhancing slide with visuals:', error)
    
    // Return basic slide structure on error
    return {
      ...slideData,
      content: {
        type: 'fabric',
        objects: [
          {
            type: 'textbox',
            text: slideData.title,
            left: 50,
            top: 50,
            fontSize: 32,
            fontWeight: 'bold',
            width: 700,
            fill: '#1a202c'
          },
          {
            type: 'textbox',
            text: slideData.content,
            left: 50,
            top: 120,
            fontSize: 16,
            width: 700,
            height: 300,
            fill: '#2d3748'
          }
        ]
      }
    }
  }
}

export default { generateSlideContent, generatePresentationOutline, generateImage, enhanceSlideWithVisuals }
