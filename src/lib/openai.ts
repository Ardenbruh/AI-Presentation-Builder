// AI content generation using Groq API
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

export async function generateSlideContent(prompt: string, context?: string) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured')
    }

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
            role: "system",
            content: `You are an expert presentation designer and content strategist. Generate professional, engaging slide content based on the user's request. 

            Return a JSON object with the following structure:
            {
              "title": "Compelling slide title (max 60 chars)",
              "content": "Well-structured main content with bullet points or paragraphs",
              "speakerNotes": "Detailed presenter notes with timing and key points",
              "designSuggestions": {
                "layout": "title-content|two-column|image-focus|chart|quote|timeline",
                "visualElements": ["chart", "diagram", "photo", "icon"],
                "imagePrompt": "Detailed description for relevant image/visual",
                "colors": ["primary", "accent"],
                "typography": "modern|classic|bold|minimal"
              },
              "aiImageNeeded": true|false
            }

            Guidelines:
            - Make content concise but informative
            - Use bullet points for lists
            - Include relevant data points when applicable
            - Suggest appropriate visuals
            - Keep professional tone
            - Include actionable insights when relevant
            
            Return ONLY the JSON object, no additional text.`
          },
          {
            role: "user",
            content: context ? `Context: ${context}\n\nCreate slide about: ${prompt}` : `Create slide about: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) throw new Error('No content generated')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating slide content:', error)
    throw new Error('Failed to generate slide content')
  }
}

export async function generatePresentationOutline(topic: string, slideCount: number = 10) {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured')
    }

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
            role: "system",
            content: `You are an expert presentation strategist and storytelling expert. Create a comprehensive, engaging presentation outline that tells a compelling story.

            Return a JSON object with the following structure:
            {
              "title": "Engaging presentation title",
              "description": "Brief compelling description",
              "theme": "professional|creative|technical|educational|sales",
              "targetAudience": "Description of intended audience",
              "keyMessage": "Main takeaway message",
              "slides": [
                {
                  "order": 1,
                  "title": "Slide title",
                  "type": "intro|content|transition|conclusion|question",
                  "description": "What this slide covers",
                  "contentPrompt": "Detailed prompt for content generation",
                  "estimatedTime": "2-3 minutes",
                  "visualType": "image|chart|diagram|text|quote"
                }
              ]
            }

            Guidelines:
            - Create a logical flow with smooth transitions
            - Include compelling opening and strong conclusion
            - Mix content types for engagement
            - Include visual elements throughout
            - Consider timing and pacing
            - Make each slide serve a purpose in the overall narrative
            
            Return ONLY the JSON object, no additional text.`
          },
          {
            role: "user",
            content: `Create a ${slideCount}-slide presentation outline about: ${topic}

            Please make this presentation engaging, well-structured, and include suggestions for visuals, charts, or images that would enhance each slide.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) throw new Error('No outline generated')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating presentation outline:', error)
    throw new Error('Failed to generate presentation outline')
  }
}

export async function improveSpeakerNotes(content: string, audience?: string) {
  try {
    if (!GROQ_API_KEY) {
      return content // Return original if no API key
    }

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
            role: "system",
            content: `You are an expert public speaking coach. Improve and expand speaker notes to help the presenter deliver effectively.
            ${audience ? `The target audience is: ${audience}` : ''}
            Return improved speaker notes as plain text.`
          },
          {
            role: "user",
            content: `Improve these speaker notes: ${content}`
          }
        ],
        temperature: 0.6,
        max_tokens: 800,
      })
    })

    if (!response.ok) {
      return content
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || content
  } catch (error) {
    console.error('Error improving speaker notes:', error)
    return content
  }
}

export async function generateImage(prompt: string, style: string = 'professional') {
  try {
    console.log(`Searching for images with prompt: "${prompt}"`)
    
    // Use multiple search approaches to find real images from the web
    const searchQueries = createSearchQueries(prompt, style)
    
    for (const query of searchQueries) {
      try {
        // Try different image search sources
        const imageUrl = await searchWebImages(query)
        if (imageUrl) {
          console.log(`Found web image for "${query}": ${imageUrl}`)
          return imageUrl
        }
      } catch (error) {
        console.log(`Failed to find web image for "${query}", trying next...`)
        continue
      }
    }
    
    // If web search fails, use fallback
    console.log('Web image search failed, using fallback')
    return getFallbackImage(prompt)
    
  } catch (error) {
    console.error('Error searching for web images:', error)
    return getFallbackImage(prompt)
  }
}

function createSearchQueries(prompt: string, style: string): string[] {
  const promptLower = prompt.toLowerCase()
  const queries: string[] = []
  
  // Music and bands - PRIORITY HANDLING
  if (promptLower.includes('queen') || promptLower.includes('freddie mercury') || promptLower.includes('bohemian rhapsody')) {
    queries.push(
      'Queen band Freddie Mercury stage',
      'Queen rock band concert vintage',
      'Freddie Mercury microphone live',
      'Queen band logo artwork',
      'Bohemian Rhapsody Queen album'
    )
  } else if (promptLower.includes('music') || promptLower.includes('band') || promptLower.includes('concert') || promptLower.includes('song')) {
    queries.push(
      'rock concert stage performance',
      'music band instruments guitars',
      'live music festival crowd',
      'recording studio microphone',
      'vintage music vinyl records'
    )
  }
  // Technology and gaming
  else if (promptLower.includes('gaming') || promptLower.includes('video game') || promptLower.includes('esports') || promptLower.includes('doom')) {
    queries.push(
      'gaming setup RGB mechanical keyboard',
      'esports tournament arena lights',
      'video game controller console',
      'gaming PC dual monitors',
      'competitive gaming championship'
    )
  } else if (promptLower.includes('ai') || promptLower.includes('artificial intelligence') || promptLower.includes('machine learning')) {
    queries.push(
      'artificial intelligence neural network',
      'AI robot humanoid technology',
      'machine learning data science',
      'AI brain circuit digital',
      'futuristic AI technology concept'
    )
  } else if (promptLower.includes('tech') || promptLower.includes('programming') || promptLower.includes('code') || promptLower.includes('software')) {
    queries.push(
      'programming code syntax colorful',
      'software developer multiple monitors',
      'tech startup modern office',
      'web development responsive design',
      'coding laptop coffee workspace'
    )
  }
  // Science and space
  else if (promptLower.includes('space') || promptLower.includes('astronomy') || promptLower.includes('nasa') || promptLower.includes('rocket')) {
    queries.push(
      'space rocket launch flames',
      'astronaut spacewalk Earth background',
      'galaxy stars nebula colorful',
      'NASA mission control center',
      'telescope observatory night sky'
    )
  } else if (promptLower.includes('science') || promptLower.includes('research') || promptLower.includes('experiment') || promptLower.includes('laboratory')) {
    queries.push(
      'science laboratory beakers colorful',
      'research microscope close up',
      'chemical reaction experiment',
      'DNA double helix structure',
      'scientific data visualization'
    )
  }
  // Business and finance
  else if (promptLower.includes('business') || promptLower.includes('startup') || promptLower.includes('entrepreneur') || promptLower.includes('company')) {
    queries.push(
      'business growth arrow chart',
      'startup team brainstorming whiteboard',
      'entrepreneur presenting investors',
      'handshake business partnership',
      'modern office glass building'
    )
  } else if (promptLower.includes('finance') || promptLower.includes('money') || promptLower.includes('investment') || promptLower.includes('economy')) {
    queries.push(
      'financial growth upward trend',
      'investment portfolio diversified',
      'money coins stack growing',
      'stock market trading floor',
      'calculator financial planning'
    )
  }
  // Travel and adventure
  else if (promptLower.includes('travel') || promptLower.includes('adventure') || promptLower.includes('explore') || promptLower.includes('journey')) {
    queries.push(
      'adventure mountain hiking sunset',
      'world map travel pins',
      'backpack travel gear outdoor',
      'airplane window view clouds',
      'passport stamps travel documents'
    )
  }
  // Health and fitness
  else if (promptLower.includes('health') || promptLower.includes('fitness') || promptLower.includes('wellness') || promptLower.includes('exercise')) {
    queries.push(
      'fitness gym equipment weights',
      'healthy food fruits vegetables',
      'yoga meditation peaceful',
      'running outdoor nature trail',
      'wellness spa stones relaxation'
    )
  }
  // Education and learning
  else if (promptLower.includes('education') || promptLower.includes('learning') || promptLower.includes('school') || promptLower.includes('university')) {
    queries.push(
      'education books stack knowledge',
      'university graduation cap diploma',
      'classroom students engaged learning',
      'online learning laptop student',
      'library books study quiet'
    )
  }
  // Nature and environment
  else if (promptLower.includes('nature') || promptLower.includes('environment') || promptLower.includes('green') || promptLower.includes('eco')) {
    queries.push(
      'nature forest green sunlight',
      'environmental renewable energy solar',
      'wildlife animals natural habitat',
      'eco friendly sustainable living',
      'clean energy wind turbines'
    )
  }
  // Art and creativity
  else if (promptLower.includes('art') || promptLower.includes('creative') || promptLower.includes('design') || promptLower.includes('artistic')) {
    queries.push(
      'creative art painting colorful',
      'design studio workspace tools',
      'artistic hands creating masterpiece',
      'digital art tablet stylus',
      'creative inspiration color palette'
    )
  }
  // Food and cooking
  else if (promptLower.includes('food') || promptLower.includes('cooking') || promptLower.includes('recipe') || promptLower.includes('chef')) {
    queries.push(
      'gourmet food plating elegant',
      'chef cooking kitchen professional',
      'fresh ingredients colorful market',
      'restaurant dining fine experience',
      'homemade cooking family kitchen'
    )
  }
  // Generic fallback - extract keywords from prompt
  else {
    // Extract meaningful keywords from the prompt
    const words = promptLower.split(/\s+/).filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'how', 'what', 'why', 'when', 'where', 'this', 'that', 'will', 'have', 'been'].includes(word)
    )
    
    if (words.length > 0) {
      const mainKeyword = words[0]
      const secondKeyword = words[1] || 'concept'
      
      queries.push(
        `${mainKeyword} professional high quality`,
        `${mainKeyword} ${secondKeyword} modern`,
        `${mainKeyword} innovation creative`,
        `${words.slice(0, 2).join(' ')} stylish`,
        `${mainKeyword} technology advanced`
      )
    } else {
      // Last resort fallback
      queries.push(
        'modern professional concept',
        'innovative technology design',
        'creative business solution',
        'futuristic digital concept',
        'abstract modern art'
      )
    }
  }
  
  return queries
}

async function searchWebImages(query: string): Promise<string | null> {
  try {
    console.log(`Searching for images with query: "${query}"`)
    
    // Direct Unsplash API search with better parameters
    const unsplashResult = await searchUnsplashAPI(query)
    if (unsplashResult) {
      console.log(`Found Unsplash image: ${unsplashResult}`)
      return unsplashResult
    }
    
    // Fallback to Pexels API if available
    const pexelsResult = await searchPexelsAPI(query)
    if (pexelsResult) {
      console.log(`Found Pexels image: ${pexelsResult}`)
      return pexelsResult
    }
    
    return null
    
  } catch (error) {
    console.error('Web search failed:', error)
    return null
  }
}

async function searchUnsplashAPI(query: string): Promise<string | null> {
  try {
    // Use specific search terms for better results
    const cleanQuery = query.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join('+')
    
    if (!cleanQuery) return null
    
    // Try the Unsplash API with search endpoint
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=10&orientation=landscape`
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'demo-key'}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        // Get a random image from results
        const randomIndex = Math.floor(Math.random() * data.results.length)
        const image = data.results[randomIndex]
        return image.urls.regular || image.urls.small
      }
    }
    
    // Fallback to Unsplash Source with better search terms
    const sourceUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(cleanQuery)}&sig=${Math.floor(Math.random() * 10000)}`
    console.log(`Trying Unsplash Source: ${sourceUrl}`)
    
    const sourceResponse = await fetch(sourceUrl, { method: 'HEAD' })
    if (sourceResponse.ok) {
      return sourceUrl
    }
    
    return null
  } catch (error) {
    console.error('Unsplash API search failed:', error)
    return null
  }
}

async function searchPexelsAPI(query: string): Promise<string | null> {
  try {
    if (!process.env.PEXELS_API_KEY) return null
    
    const cleanQuery = query.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join(' ')
    
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=15&orientation=landscape`, {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.photos && data.photos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.photos.length)
        return data.photos[randomIndex].src.large || data.photos[randomIndex].src.medium
      }
    }
    
    return null
  } catch (error) {
    console.error('Pexels API search failed:', error)
    return null
  }
}

function getFallbackImage(prompt: string): string {
  const promptLower = prompt.toLowerCase()
  let fallbackCategory = 'abstract'
  
  // Choose more specific fallback categories based on content
  if (promptLower.includes('queen') || promptLower.includes('freddie mercury') || promptLower.includes('bohemian rhapsody')) {
    fallbackCategory = 'queen,band,music,rock,concert'
  } else if (promptLower.includes('music') || promptLower.includes('band') || promptLower.includes('concert')) {
    fallbackCategory = 'music,concert,instruments,guitar,stage'
  } else if (promptLower.includes('gaming') || promptLower.includes('video game') || promptLower.includes('esports')) {
    fallbackCategory = 'gaming,esports,computer,rgb,setup'
  } else if (promptLower.includes('ai') || promptLower.includes('artificial intelligence')) {
    fallbackCategory = 'ai,technology,robot,futuristic,neural'
  } else if (promptLower.includes('tech') || promptLower.includes('programming') || promptLower.includes('software')) {
    fallbackCategory = 'technology,programming,code,software,development'
  } else if (promptLower.includes('space') || promptLower.includes('astronomy') || promptLower.includes('nasa')) {
    fallbackCategory = 'space,astronomy,galaxy,stars,rocket'
  } else if (promptLower.includes('science') || promptLower.includes('research')) {
    fallbackCategory = 'science,research,laboratory,experiment,discovery'
  } else if (promptLower.includes('business') || promptLower.includes('startup')) {
    fallbackCategory = 'business,startup,growth,success,meeting'
  } else if (promptLower.includes('travel') || promptLower.includes('adventure')) {
    fallbackCategory = 'travel,adventure,explore,mountain,journey'
  } else if (promptLower.includes('health') || promptLower.includes('fitness')) {
    fallbackCategory = 'health,fitness,wellness,exercise,nature'
  } else if (promptLower.includes('education') || promptLower.includes('learning')) {
    fallbackCategory = 'education,learning,books,study,knowledge'
  } else if (promptLower.includes('art') || promptLower.includes('creative')) {
    fallbackCategory = 'art,creative,design,colorful,artistic'
  } else if (promptLower.includes('food') || promptLower.includes('cooking')) {
    fallbackCategory = 'food,cooking,kitchen,chef,ingredients'
  } else {
    // Extract key words from prompt for fallback
    const words = promptLower
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && 
        !['the', 'and', 'for', 'with', 'how', 'what', 'why', 'when', 'where', 'this', 'that'].includes(word))
      .slice(0, 3)
    
    if (words.length > 0) {
      fallbackCategory = words.join(',')
    } else {
      fallbackCategory = 'modern,professional,concept'
    }
  }
  
  const seed = Math.floor(Math.random() * 1000)
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(fallbackCategory)}&sig=${seed}`
}

export async function enhanceSlideWithVisuals(slideData: any) {
  try {
    // If the slide suggests an image is needed, generate one
    if (slideData.aiImageNeeded && slideData.designSuggestions?.imagePrompt) {
      const imageUrl = await generateImage(slideData.designSuggestions.imagePrompt)
      
      return {
        ...slideData,
        generatedImage: imageUrl,
        content: {
          type: 'fabric',
          objects: [
            {
              type: 'textbox',
              text: slideData.title,
              left: 50,
              top: 30,
              fontSize: 28,
              fontWeight: 'bold',
              width: 700
            },
            {
              type: 'image',
              src: imageUrl,
              left: 50,
              top: 100,
              width: 300,
              height: 200
            },
            {
              type: 'textbox',
              text: slideData.content,
              left: 370,
              top: 100,
              fontSize: 16,
              width: 380,
              height: 200
            }
          ]
        }
      }
    } else {
      // Regular text-based slide
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
              width: 700
            },
            {
              type: 'textbox',
              text: slideData.content,
              left: 50,
              top: 120,
              fontSize: 16,
              width: 700,
              height: 300
            }
          ]
        }
      }
    }
  } catch (error) {
    console.error('Error enhancing slide with visuals:', error)
    return slideData
  }
}


