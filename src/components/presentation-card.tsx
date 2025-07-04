'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShareIcon, TrashIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

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

interface PresentationCardProps {
  presentation: Presentation
  onUpdate: () => void
}

export function PresentationCard({ presentation, onUpdate }: PresentationCardProps) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this presentation?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/presentations/${presentation.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error deleting presentation:', error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  const togglePublic = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/presentations/${presentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !presentation.isPublic }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating presentation:', error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  const copyPresentationLink = async () => {
    try {
      const presentationUrl = `${window.location.origin}/present/${presentation.id}`
      await navigator.clipboard.writeText(presentationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (error) {
      console.error('Error copying link:', error instanceof Error ? error.message : String(error))
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = `${window.location.origin}/present/${presentation.id}`
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
        {presentation.thumbnail ? (
          <img
            src={presentation.thumbnail}
            alt={presentation.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm text-gray-600">{presentation._count.slides} slides</p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {presentation.title}
          </h3>
          {presentation.isPublic && (
            <ShareIcon className="h-4 w-4 text-green-600 ml-2 flex-shrink-0" />
          )}
        </div>

        {presentation.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {presentation.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>
            Updated {formatDistanceToNow(new Date(presentation.updatedAt), { addSuffix: true })}
          </span>
          <span>{presentation._count.slides} slides</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/editor/${presentation.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          
          <Link href={`/present/${presentation.id}`}>
            <Button variant="outline" size="sm">
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={copyPresentationLink}
            disabled={loading}
            title={copied ? 'Link copied!' : 'Copy presentation link'}
            className={copied ? 'text-green-600 border-green-600' : ''}
          >
            {copied ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ShareIcon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={togglePublic}
            disabled={loading}
            title={presentation.isPublic ? 'Make private' : 'Make public'}
            className={presentation.isPublic ? 'text-green-600 border-green-600' : 'text-gray-600'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {presentation.isPublic ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 11.293m7.071-7.071l2.122 2.122m-2.122-2.122L11.293 8.464m4.243 4.243l2.121 2.121" />
              )}
            </svg>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
