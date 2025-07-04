'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon, FolderIcon, ShareIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { PresentationCard } from '@/components/presentation-card'
import { CreatePresentationDialog } from '@/components/create-presentation-dialog'
import { Notification, useNotification } from '@/components/notification'

interface Presentation {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  _count: {
    slides: number
  }
}

export default function DashboardPage() {
  const { user } = useUser()
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [aiProvider, setAiProvider] = useState<string>('mock')
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    if (user) {
      fetchPresentations()
      checkAIProvider()
    }
  }, [user])

  const checkAIProvider = async () => {
    try {
      const response = await fetch('/api/ai-status')
      if (response.ok) {
        const data = await response.json()
        setAiProvider(data.provider)
      }
    } catch (error) {
      console.error('Error checking AI provider:', error instanceof Error ? error.message : String(error))
    }
  }

  const fetchPresentations = async () => {
    try {
      const response = await fetch('/api/presentations')
      if (response.ok) {
        const data = await response.json()
        setPresentations(data)
      }
    } catch (error: any) {
      console.error('Error fetching presentations:', error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePresentation = async (data: { title: string; description: string; useAI: boolean; useImages: boolean; topic?: string }) => {
    try {
      showNotification('info', 'Creating Presentation', 
        `${data.useAI ? `Using ${aiProvider} AI to generate` : 'Creating manual'} presentation: "${data.title}"`)
      
      const response = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const newPresentation = await response.json()
        setPresentations([newPresentation, ...presentations])
        setCreateDialogOpen(false)
        
        showNotification('success', 'Presentation Created', 
          `"${data.title}" has been created with ${newPresentation._count?.slides || 4} slides!`)
      } else {
        // Get more specific error information
        const errorText = await response.text()
        const errorMessage = response.status === 500 ? 
          'Server error occurred while creating the presentation' : 
          `Failed to create presentation: ${errorText}`
        
        console.error('API Error:', response.status, errorText)
        showNotification('warning', 'Creation Failed', errorMessage)
      }
    } catch (error) {
      console.error('Error creating presentation:', error instanceof Error ? error.message : String(error))
      showNotification('warning', 'Creation Failed', 
        error instanceof Error ? 
          `Network error: ${error.message}` : 
          'There was an issue creating your presentation. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Presentations</h1>
              <p className="text-gray-600 mt-1">Create and manage your AI-powered presentations</p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Presentation
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{presentations.length}</p>
                <p className="text-gray-600">Total Presentations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ShareIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {presentations.filter(p => p.isPublic).length}
                </p>
                <p className="text-gray-600">Shared</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {presentations.reduce((acc, p) => acc + p._count.slides, 0)}
                </p>
                <p className="text-gray-600">Total Slides</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900 capitalize">{aiProvider} AI</p>
                <p className="text-gray-600">Current Provider</p>
              </div>
            </div>
          </div>
        </div>

        {/* Presentations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : presentations.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No presentations yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first AI-powered presentation</p>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Presentation
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <PresentationCard
                key={presentation.id}
                presentation={presentation}
                onUpdate={fetchPresentations}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePresentationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreatePresentation}
      />
      
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        show={notification.show}
        onClose={hideNotification}
      />
    </div>
  )
}
