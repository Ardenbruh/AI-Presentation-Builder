import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const slides = await prisma.slide.findMany({
      where: { 
        presentationId: id,
        presentation: {
          user: { 
            clerkId: userId 
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching slides:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { order, title, content, notes, duration } = body
    const { id } = await params

    // Verify user owns the presentation
    const presentation = await prisma.presentation.findFirst({
      where: { 
        id,
        user: { 
          clerkId: userId 
        } 
      }
    })

    if (!presentation) {
      return new NextResponse('Presentation not found', { status: 404 })
    }

    const slide = await prisma.slide.create({
      data: {
        presentationId: id,
        order: order || 1,
        title: title || null,
        content: content || {},
        notes: notes || null,
        duration: duration || null
      }
    })

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error creating slide:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
