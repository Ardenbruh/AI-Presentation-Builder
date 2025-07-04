import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generatePresentationOutline, generateSlideContent, enhanceSlideWithVisuals } from '@/lib/ai-providers'

export async function GET() {
  try {
    let userId: string | null = null
    
    // Try to get user ID from auth, but handle auth errors gracefully
    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch (authError) {
      console.log('Auth error in development mode:', authError)
      // Continue with null userId for development mode
    }
    
    // Development mode: allow access without authentication if using test keys
    const isDevelopment = process.env.NODE_ENV === 'development' && 
      (process.env.CLERK_SECRET_KEY?.includes('test') || process.env.CLERK_SECRET_KEY?.includes('development'))
    
    if (!userId && !isDevelopment) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // In development mode without auth, return empty array instead of mock data
    if (!userId && isDevelopment) {
      console.log('🔧 Development mode: No authenticated user, returning empty presentations')
      return NextResponse.json([])
    }

    const presentations = await prisma.presentation.findMany({
      where: { 
        user: { 
          clerkId: userId! 
        } 
      },
      include: {
        _count: {
          select: { slides: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(presentations)
  } catch (error) {
    console.error('Error fetching presentations:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let userId: string | null = null
    
    // Try to get user ID from auth, but handle auth errors gracefully
    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch (authError) {
      console.log('Auth error in development mode:', authError)
      // Continue with null userId for development mode
    }
    
    // Development mode: allow access without authentication if using test keys
    const isDevelopment = process.env.NODE_ENV === 'development' && 
      (process.env.CLERK_SECRET_KEY?.includes('test') || process.env.CLERK_SECRET_KEY?.includes('development'))
    
    if (!userId && !isDevelopment) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { title, description, useAI, useImages = false, topic } = body

    if (!title?.trim()) {
      return new NextResponse('Title is required', { status: 400 })
    }

    // In development mode without auth, require proper authentication
    if (!userId && isDevelopment) {
      console.log('🔧 Development mode: Authentication required for presentation creation')
      return new NextResponse('Authentication required', { status: 401 })
    }

    // Find or create user with better error handling
    let user = null
    if (userId) {
      user = await prisma.user.findUnique({
        where: { clerkId: userId }
      })

      if (!user) {
        try {
          // Try to create user with fallback email to avoid unique constraint issues
          const fallbackEmail = `user-${userId}-${Date.now()}@temp.com`
          user = await prisma.user.create({
            data: {
              clerkId: userId,
              email: fallbackEmail,
              firstName: '',
              lastName: '',
              imageUrl: ''
            }
          })
        } catch (userCreateError) {
          console.error('Error creating user:', userCreateError)
          // Try to find the user again in case it was created by another request
          user = await prisma.user.findUnique({
            where: { clerkId: userId }
          })
          if (!user) {
            throw new Error('Failed to create or find user')
          }
        }
      }
    }

    // Create presentation
    let presentation
    if (user) {
      // Normal authenticated user flow
      presentation = await prisma.presentation.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          userId: user.id
        },
        include: {
          _count: {
            select: { slides: true }
          }
        }
      })
    } else {
      // Development mode without authentication - return mock presentation
      const mockPresentation = {
        id: `dev-presentation-${Date.now()}`,
        title: title.trim(),
        description: description?.trim() || null,
        thumbnail: null,
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { slides: 0 }
      }        // If AI is requested, generate content and return enhanced mock
        if (useAI && topic?.trim()) {
          console.log('🔧 Development mode: Generating AI content without database')
          try {
            const outline = await generatePresentationOutline(topic.trim(), 5)
            const slides = []
            
            for (let i = 0; i < outline.slides.length; i++) {
              const slideOutline = outline.slides[i]
              const slideContent = await generateSlideContent(slideOutline.description, slideOutline.type)
              
              // Only enhance with visuals if useImages is true
              const enhancedSlide = useImages ? 
                await enhanceSlideWithVisuals(slideContent) : 
                slideContent

              slides.push({
                ...enhancedSlide,
                id: `dev-slide-${i + 1}`,
                order: i,
                presentationId: mockPresentation.id
              })
            }

          return NextResponse.json({
            ...mockPresentation,
            slides,
            _count: { slides: slides.length }
          })
        } catch (aiError) {
          console.error('AI generation failed in dev mode:', aiError)
          // Return basic mock presentation
          return NextResponse.json({
            ...mockPresentation,
            _count: { slides: 4 }
          })
        }
      }
      
      return NextResponse.json(mockPresentation)
    }

    // If AI is enabled and topic is provided, generate initial content (only for authenticated users)
    if (useAI && topic?.trim() && user && presentation) {
      try {
        console.log('Starting AI presentation generation for topic:', topic.trim())
        const outline = await generatePresentationOutline(topic.trim())
        console.log('Generated outline:', outline)
        
        // Create slides based on AI outline
        for (let i = 0; i < Math.min(outline.slides.length, 10); i++) {
          const slideData = outline.slides[i]
          console.log(`Generating content for slide ${i + 1}: ${slideData.title}`)
          
          // Create more specific prompts for each slide
          const specificPrompt = `${slideData.contentPrompt}. Focus on ${slideData.description}. This is slide ${i + 1} of ${outline.slides.length} in a presentation about ${topic.trim()}. Make this content unique and specific to the "${slideData.title}" topic. Include relevant details, examples, and actionable insights.`
          
          const slideContent = await generateSlideContent(specificPrompt, `Presentation: ${title}. Slide type: ${slideData.type}. Visual type: ${slideData.visualType}`)
          
          // Only enhance with visuals if useImages is true
          const enhancedSlide = useImages ? 
            await enhanceSlideWithVisuals(slideContent) : 
            slideContent
          
          // Ensure we have proper content structure
          const slideContentData = enhancedSlide.content || {
            type: 'fabric',
            objects: [
              {
                type: 'textbox',
                text: enhancedSlide.title,
                left: 50,
                top: 50,
                fontSize: 32,
                fontWeight: 'bold',
                width: 700
              },
              {
                type: 'textbox',
                text: enhancedSlide.content || `Content for ${enhancedSlide.title}`,
                left: 50,
                top: 120,
                fontSize: 16,
                width: 700,
                height: 300
              }
            ]
          }
          
          // Add image if generated and useImages is enabled
          if (useImages && enhancedSlide.generatedImage) {
            slideContentData.objects.push({
              type: 'image',
              src: enhancedSlide.generatedImage,
              left: 50,
              top: 350,
              width: 400,
              height: 250
            })
          }
          
          await prisma.slide.create({
            data: {
              presentationId: presentation.id,
              order: slideData.order,
              title: enhancedSlide.title,
              content: slideContentData,
              notes: enhancedSlide.speakerNotes || `Speaker notes for ${enhancedSlide.title}`
            }
          })
          
          console.log(`Created slide ${i + 1}: "${enhancedSlide.title}" with ${useImages && enhancedSlide.generatedImage ? 'image' : 'text-only'} content`)
        }

        // Record AI generation
        await prisma.aiGeneration.create({
          data: {
            type: 'PRESENTATION_OUTLINE',
            prompt: topic.trim(),
            result: outline,
            status: 'COMPLETED',
            userId: user?.id || 'dev-user',
            presentationId: presentation.id
          }
        })

        console.log('AI generation completed successfully')
      } catch (aiError) {
        console.error('AI generation failed:', aiError)
        
        // Record AI generation failure
        try {
          await prisma.aiGeneration.create({
            data: {
              type: 'PRESENTATION_OUTLINE',
              prompt: topic.trim(),
              result: { error: aiError instanceof Error ? aiError.message : String(aiError) },
              status: 'FAILED',
              userId: user?.id || 'dev-user',
              presentationId: presentation.id
            }
          })
        } catch (logError) {
          console.error('Failed to log AI generation error:', logError)
        }

        // Create fallback slides when AI fails
        console.log('Creating fallback slides due to AI failure')
        const fallbackSlides = [
          {
            title: 'Introduction',
            content: `Welcome to your presentation about ${topic.trim()}. This slide was created as a fallback when AI generation failed.`,
            order: 1
          },
          {
            title: 'Overview',
            content: `This presentation covers key aspects of ${topic.trim()}. You can edit these slides to add your own content.`,
            order: 2
          },
          {
            title: 'Main Content',
            content: `Add your main content about ${topic.trim()} here. Use the editor to customize this slide.`,
            order: 3
          },
          {
            title: 'Conclusion',
            content: `Thank you for your attention. This concludes the presentation on ${topic.trim()}.`,
            order: 4
          }
        ]

        for (const slideData of fallbackSlides) {
          await prisma.slide.create({
            data: {
              presentationId: presentation.id,
              order: slideData.order,
              title: slideData.title,
              content: {
                type: 'fabric',
                objects: [
                  {
                    type: 'textbox',
                    text: slideData.title,
                    left: 50,
                    top: 50,
                    fontSize: 32,
                    fontWeight: 'bold'
                  },
                  {
                    type: 'textbox',
                    text: slideData.content,
                    left: 50,
                    top: 120,
                    fontSize: 16,
                    width: 500
                  }
                ]
              },
              notes: `Speaker notes for ${slideData.title.toLowerCase()}.`
            }
          })
        }
        console.log('Fallback slides created successfully')
      }
    }

    // Return the created presentation (only reaches here for authenticated users)
    return NextResponse.json(presentation!)
  } catch (error) {
    console.error('Error creating presentation:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
