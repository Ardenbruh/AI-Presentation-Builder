'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, PlayIcon, ShareIcon } from '@heroicons/react/24/outline'
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

export default function EditorPage() {
  const params = useParams()
  const { user } = useUser()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingContent, setEditingContent] = useState(false)
  const [titleText, setTitleText] = useState('')
  const [contentText, setContentText] = useState('')

  useEffect(() => {
    if (user && params.id) {
      fetchPresentation()
    }
  }, [user, params.id])

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

  const addNewSlide = async () => {
    if (!presentation) return

    try {
      const response = await fetch(`/api/presentations/${presentation.id}/slides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: presentation.slides.length + 1,
          title: 'New Slide',
          content: {
            type: 'fabric',
            objects: [
              {
                type: 'textbox',
                text: 'Click to edit title',
                left: 50,
                top: 50,
                fontSize: 32,
                fontWeight: 'bold'
              }
            ]
          }
        }),
      })

      if (response.ok) {
        const newSlide = await response.json()
        setPresentation({
          ...presentation,
          slides: [...presentation.slides, newSlide]
        })
        setCurrentSlide(presentation.slides.length)
      }
    } catch (error) {
      console.error('Error adding slide:', error)
    }
  }

  // Helper function to extract text content from slide
  const getSlideTextContent = (content: any) => {
    if (!content || !content.objects) return ''
    const textObjects = content.objects.filter((obj: any) => obj.type === 'textbox' && obj.text)
    return textObjects.map((obj: any) => obj.text).join('\n\n')
  }

  // Update slide title
  const updateSlideTitle = async (newTitle: string) => {
    if (!presentation || !currentSlideData) return

    try {
      const response = await fetch(`/api/presentations/${presentation.id}/slides/${currentSlideData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })

      if (response.ok) {
        const updatedSlide = await response.json()
        setPresentation({
          ...presentation,
          slides: presentation.slides.map(slide => 
            slide.id === updatedSlide.id ? updatedSlide : slide
          )
        })
      }
    } catch (error) {
      console.error('Error updating slide title:', error)
    }
  }

  // Update slide content
  const updateSlideContent = async (newContent: string) => {
    if (!presentation || !currentSlideData) return

    try {
      const updatedContent = {
        type: 'fabric',
        objects: [
          {
            type: 'textbox',
            text: currentSlideData.title || 'Slide Title',
            left: 50,
            top: 50,
            fontSize: 32,
            fontWeight: 'bold'
          },
          {
            type: 'textbox',
            text: newContent,
            left: 50,
            top: 120,
            fontSize: 16,
            width: 500
          }
        ]
      }

      const response = await fetch(`/api/presentations/${presentation.id}/slides/${currentSlideData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent }),
      })

      if (response.ok) {
        const updatedSlide = await response.json()
        setPresentation({
          ...presentation,
          slides: presentation.slides.map(slide => 
            slide.id === updatedSlide.id ? updatedSlide : slide
          )
        })
      }
    } catch (error) {
      console.error('Error updating slide content:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access the editor</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (!presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Presentation not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentSlideData = presentation.slides[currentSlide]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{presentation.title}</h1>
              <p className="text-sm text-gray-600">{presentation.slides.length} slides</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href={`/present/${presentation.id}`}>
              <Button size="sm">
                <PlayIcon className="h-4 w-4 mr-2" />
                Present
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Slide Thumbnails */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="space-y-3">
            {presentation.slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide-thumbnail p-3 ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className="aspect-video bg-gray-100 rounded mb-2 relative overflow-hidden">
                  {slide.content ? (
                    <SlideRenderer 
                      content={slide.content}
                      className="w-full h-full scale-[0.3] origin-top-left transform"
                      isPresentation={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">
                  {slide.title || `Slide ${index + 1}`}
                </p>
              </div>
            ))}
            
            <Button
              onClick={addNewSlide}
              variant="outline"
              className="w-full h-20 border-dashed"
            >
              + Add Slide
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Area */}
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="presentation-canvas w-full max-w-4xl aspect-video bg-white rounded-lg shadow-lg overflow-hidden relative">
              {currentSlideData ? (
                <div className="w-full h-full">
                  {/* Use SlideRenderer for display, but overlay with editing controls */}
                  <SlideRenderer 
                    content={currentSlideData.content}
                    title={currentSlideData.title}
                    className="w-full h-full"
                    isPresentation={false}
                  />
                  
                  
                  {/* Enhanced Editing Overlay with real-time editing hints */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10 transition-all group">
                    {/* Title Edit Button - More prominent */}
                    <button
                      onClick={() => {
                        setTitleText(currentSlideData.title || '')
                        setEditingTitle(true)
                      }}
                      className="absolute top-4 left-4 right-4 text-left opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                      title="Click to edit title"
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
                        ✏️ Edit Title - Click for Real-time Editing
                      </div>
                    </button>
                    
                    {/* Content Edit Button - More prominent */}
                    <button
                      onClick={() => {
                        setContentText(getSlideTextContent(currentSlideData.content))
                        setEditingContent(true)
                      }}
                      className="absolute top-20 left-4 right-4 bottom-16 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-[1.01]"
                      title="Click to edit content"
                    >
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
                        📝 Edit Content - Real-time Preview Available
                      </div>
                    </button>

                    {/* Quick Actions - New feature */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Quick bullet point addition
                            const currentContent = getSlideTextContent(currentSlideData.content)
                            setContentText(currentContent + '\n• New bullet point')
                            setEditingContent(true)
                          }}
                          className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md hover:bg-orange-600 transition-colors"
                        >
                          + Bullet
                        </button>
                        <button
                          onClick={() => {
                            // Quick numbered list addition
                            const currentContent = getSlideTextContent(currentSlideData.content)
                            const lines = currentContent.split('\n').filter((l: string) => l.trim())
                            const nextNum = lines.filter((l: string) => /^\d+\./.test(l.trim())).length + 1
                            setContentText(currentContent + `\n${nextNum}. New numbered item`)
                            setEditingContent(true)
                          }}
                          className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md hover:bg-purple-600 transition-colors"
                        >
                          + Number
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <p>No slides yet. Add your first slide to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="h-48 bg-white border-t p-4">
            <div className="h-full">
              <h3 className="font-semibold mb-3">Speaker Notes</h3>
              <textarea
                className="w-full h-32 p-3 border rounded-md resize-none"
                placeholder="Add speaker notes for this slide..."
                value={currentSlideData?.notes || ''}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Title Editing Modal with Preview */}
      {editingTitle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-2/3 max-w-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✏️ Edit Slide Title
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title Text</label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter slide title"
                  autoFocus
                />
              </div>
              {/* Live Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-[60px] flex items-center">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {titleText || 'Enter title to see preview...'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingTitle(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateSlideTitle(titleText)
                  setEditingTitle(false)
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
              >
                Save Title
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Content Editing Modal with Live Preview */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl h-5/6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              📝 Edit Slide Content - Real-time Preview
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-5/6">
              {/* Editor Panel */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Editor</label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="flex-1 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter slide content... 

Tips:
• Start lines with '• ' for bullet points
• Use '1. ' for numbered lists  
• Use **bold** for emphasis
• Use *italic* for subtle emphasis"
                  autoFocus
                />
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Formatting tips:</strong> Use • for bullets, 1. 2. 3. for numbers, **bold**, *italic*
                </div>
              </div>
              
              {/* Live Preview Panel */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
                <div className="flex-1 border border-gray-200 rounded-lg overflow-auto bg-gradient-to-br from-white via-blue-50 to-purple-50">
                  <div className="p-6">
                    <div className="space-y-4">
                      {contentText.split('\n').map((line, i) => {
                        const trimmedLine = line.trim()
                        if (!trimmedLine) return <br key={i} />
                        
                        // Preview bullet points
                        if (trimmedLine.startsWith('• ')) {
                          return (
                            <div key={i} className="flex items-start group hover:bg-white/50 p-2 rounded-lg transition-all">
                              <div className="flex-shrink-0 mr-4 mt-1">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                              </div>
                              <span className="font-semibold text-gray-800">
                                {trimmedLine.substring(2)}
                              </span>
                            </div>
                          )
                        }
                        
                        // Preview numbered points
                        const numberMatch = trimmedLine.match(/^(\d+\.\s*)(.*)/)
                        if (numberMatch) {
                          return (
                            <div key={i} className="flex items-start group hover:bg-white/50 p-2 rounded-lg transition-all">
                              <div className="flex-shrink-0 mr-4">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm rounded-full shadow-md">
                                  {numberMatch[1].replace('.', '').trim()}
                                </span>
                              </div>
                              <span className="font-semibold text-gray-800 pt-1">
                                {numberMatch[2]}
                              </span>
                            </div>
                          )
                        }
                        
                        // Preview regular text with formatting
                        const textWithBold = trimmedLine
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-900 bg-blue-100 px-1 rounded">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em class="italic text-purple-700 font-medium">$1</em>')
                        
                        return (
                          <p key={i} className="font-medium text-gray-800 leading-relaxed p-2 rounded-lg hover:bg-white/30 transition-colors" 
                             dangerouslySetInnerHTML={{ __html: textWithBold }} />
                        )
                      })}
                      {!contentText.trim() && (
                        <p className="text-gray-400 italic">Start typing to see your content preview...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingContent(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateSlideContent(contentText)
                  setEditingContent(false)
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-md"
              >
                Save Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
