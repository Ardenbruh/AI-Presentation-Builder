'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SlideRenderer } from '@/components/slide-renderer'
import Link from 'next/link'

interface Slide {
  id: string
  order: number
  title: string | null
  content: any
  notes: string | null
  duration: number | null
}

interface Presentation {
  id: string
  title: string
  description: string | null
  slides: Slide[]
}

export default function PresentPage() {
  const params = useParams()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPresentation()
    }
  }, [params.id])

  const fetchPresentation = async () => {
    try {
      const response = await fetch(`/api/presentations/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPresentation(data)
      }
    } catch (error) {
      console.error('Error fetching presentation:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }, [currentSlide, presentation])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (error) {
        console.error('Error entering fullscreen:', error instanceof Error ? error.message : String(error))
      }
    } else {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (error) {
        console.error('Error exiting fullscreen:', error instanceof Error ? error.message : String(error))
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide, isFullscreen])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4 border-white"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (!presentation || presentation.slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Presentation not found or empty</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentSlideData = presentation.slides[currentSlide]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Controls */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href={`/editor/${presentation.id}`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <span className="text-sm opacity-75">
              {currentSlide + 1} / {presentation.slides.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Slide Content - Fixed fullscreen layout */}
      <div className={`flex items-center justify-center ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'min-h-screen'} ${isFullscreen ? 'p-0' : 'p-8'}`}>
        <div className={`w-full ${isFullscreen ? 'h-screen' : 'max-w-6xl aspect-video'} ${isFullscreen ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-white text-black rounded-lg shadow-2xl'} overflow-hidden`}>
          {currentSlideData ? (
            <SlideRenderer 
              content={currentSlideData.content}
              title={currentSlideData.title}
              className="w-full h-full"
              isPresentation={isFullscreen}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Slide content not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Fixed positioning for fullscreen */}
      <div className={`${isFullscreen ? 'fixed' : 'absolute'} bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-50`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/20 disabled:opacity-30 bg-black/50 backdrop-blur-sm"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        
        <div className="flex space-x-2">
          {presentation.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className="text-white hover:bg-white/20 disabled:opacity-30 bg-black/50 backdrop-blur-sm"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Exit Fullscreen Button */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 bg-black/50 backdrop-blur-sm"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      )}

      {/* Speaker Notes (only visible when not in fullscreen) */}
      {!isFullscreen && currentSlideData?.notes && (
        <div className="absolute bottom-4 right-4 max-w-sm bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 opacity-75">Speaker Notes:</h4>
          <p className="text-sm opacity-90">{currentSlideData.notes}</p>
        </div>
      )}
    </div>
  )
}
