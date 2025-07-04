'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface CreatePresentationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; description: string; useAI: boolean; useImages: boolean; topic?: string }) => void
}

export function CreatePresentationDialog({ open, onOpenChange, onSubmit }: CreatePresentationDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [useAI, setUseAI] = useState(true)
  const [useImages, setUseImages] = useState(false) // Default to false to disable images
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiProvider, setAiProvider] = useState('mock')

  useEffect(() => {
    if (open) {
      checkAIProvider()
    }
  }, [open])

  const checkAIProvider = async () => {
    try {
      const response = await fetch('/api/ai-status')
      if (response.ok) {
        const data = await response.json()
        setAiProvider(data.provider)
      }
    } catch (error) {
      console.error('Error checking AI provider:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        useAI,
        useImages,
        topic: useAI && topic.trim() ? topic.trim() : undefined,
      })
      
      // Reset form
      setTitle('')
      setDescription('')
      setTopic('')
      setUseAI(true)
      setUseImages(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-blue-600" />
            Create New Presentation
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Presentation Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter presentation title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your presentation"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="use-ai"
              checked={useAI}
              onCheckedChange={setUseAI}
            />
            <Label htmlFor="use-ai" className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-blue-600" />
              Use AI to generate content
            </Label>
          </div>

          {useAI && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-900 font-medium">
                  Using {aiProvider === 'mock' ? 'Enhanced Mock AI' : `${aiProvider.toUpperCase()} AI`} Provider
                </span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-blue-900 font-medium">AI Topic & Instructions</Label>
                <Textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe your presentation topic in detail. Examples:
• Digital Marketing Strategy for E-commerce
• Machine Learning Implementation Best Practices  
• Financial Portfolio Risk Management
• Remote Team Leadership and Communication"
                  rows={4}
                  className="bg-white"
                />
              </div>

              {/* Image Generation Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="use-images"
                  checked={useImages}
                  onCheckedChange={setUseImages}
                />
                <Label htmlFor="use-images" className="flex items-center gap-2 text-blue-900">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Generate AI images for slides
                  <span className="text-xs text-blue-600 font-normal">(experimental)</span>
                </Label>
              </div>
              
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>💡 Tip:</strong> {aiProvider === 'mock' 
                    ? 'Our enhanced mock AI provides professional content for common business topics. Try specific topics like "business strategy", "technology implementation", or "data analytics".'
                    : `${aiProvider.toUpperCase()} will generate professional slides with relevant content and images based on your topic.`
                  }
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Creating...' : 'Create Presentation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
