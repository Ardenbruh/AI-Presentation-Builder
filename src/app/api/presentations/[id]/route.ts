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
    const presentation = await prisma.presentation.findFirst({
      where: { 
        id,
        user: { 
          clerkId: userId 
        } 
      },
      include: {
        slides: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { slides: true }
        }
      }
    })

    if (!presentation) {
      return new NextResponse('Presentation not found', { status: 404 })
    }

    return NextResponse.json(presentation)
  } catch (error) {
    console.error('Error fetching presentation:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { title, description, isPublic } = body
    const { id } = await params

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

    const updatedPresentation = await prisma.presentation.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isPublic !== undefined && { isPublic }),
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { slides: true }
        }
      }
    })

    return NextResponse.json(updatedPresentation)
  } catch (error) {
    console.error('Error updating presentation:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
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

    await prisma.presentation.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting presentation:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
