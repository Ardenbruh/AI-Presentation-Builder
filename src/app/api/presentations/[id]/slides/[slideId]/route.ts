import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string; slideId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id, slideId } = await params
    const { title, content, notes } = await request.json()

    // Verify the presentation belongs to the user
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

    // Update the slide
    const updatedSlide = await prisma.slide.update({
      where: {
        id: slideId,
        presentationId: id
      },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(notes !== undefined && { notes })
      }
    })

    return NextResponse.json(updatedSlide)
  } catch (error) {
    console.error('Error updating slide:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id, slideId } = await params

    // Verify the presentation belongs to the user
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

    // Delete the slide
    await prisma.slide.delete({
      where: {
        id: slideId,
        presentationId: id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
