'use client';

import React from 'react';

interface SlideRendererProps {
  content: any;
  title?: string | null;
  className?: string;
  isPresentation?: boolean;
}

interface FabricObject {
  type: string;
  text?: string;
  src?: string;
  fontSize?: number;
  fontWeight?: string | number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

// Text formatting utilities
function formatText(text: string | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim();
}

function formatRichText(text: string): string {
  if (!text) return '';
  
  let formattedText = text
    // Clean up any existing HTML tags that might be showing
    .replace(/<[^>]*>/g, '')
    // Remove any class attributes that are showing as text
    .replace(/class="[^"]*"/g, '')
    // Clean up HTML artifacts but preserve structure
    .replace(/mb-\d+/g, '')
    .replace(/text-gray-\d+/g, '')
    .replace(/font-bold/g, '')
    
    // AGGRESSIVE removal of technology implementation content
    .replace(/Discuss Technology Implementation[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Architecture Design:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Performance Optimization:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Security Framework:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Integration Strategy:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Monitoring Solutions:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Best Practices:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    
    // Remove specific tech phrases that are contaminating slides
    .replace(/API-first approach/gi, '')
    .replace(/860% improvement in efficiency/gi, '')
    .replace(/Multi-layer protection strategy/gi, '')
    .replace(/Real-time analytics and alerting/gi, '')
    .replace(/Industry standards and compliance/gi, '')
    .replace(/Scalable and maintainable solutions/gi, '')
    
    // Remove lines that contain tech keywords without cinema context
    .replace(/^.*\b(API|framework|architecture|optimization|monitoring|scalable|performance|security|efficiency|compliance)\b.*$/gmi, function(match) {
      // Keep the line if it also contains cinema-related words
      if (/\b(film|cinema|movie|visual|lighting|camera|angle|composition|shot|frame|scene)\b/i.test(match)) {
        return match;
      }
      return ''; // Remove the line
    })
    
    // Enhanced bullet point detection and creation
    // First, split on explicit bullet points
    .replace(/\s*•\s*/g, '\n• ')
    // Handle different bullet point styles
    .replace(/\s*[·▪▫◦‣⁃]\s*/g, '\n• ')
    
    // Very aggressive sentence splitting - create bullets from any sentence
    .replace(/\.\s+(?=[A-Z])/g, '.\n• ')
    
    // Smart content splitting based on cinematography patterns
    .replace(/^(Low-key\s+lighting)/gmi, '• $1')
    .replace(/^(High-contrast\s+ratios)/gmi, '• $1')
    .replace(/^(Dutch\s+angles)/gmi, '• $1')
    .replace(/^(Framing\s+devices)/gmi, '• $1')
    .replace(/^(A\s+keen\s+use\s+of)/gmi, '• $1')
    .replace(/^(How\s+can\s+you)/gmi, '• $1')
    .replace(/^(Which\s+camera)/gmi, '• $1')
    .replace(/^(By\s+employing)/gmi, '• $1')
    
    // Handle numbered lists
    .replace(/\s*(\d+\.)\s*/g, '\n$1 ')
    
    // Clean up extra whitespace but preserve line breaks
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+|\s+$/g, '')
    // Clean up empty bullet points
    .replace(/\n•\s*\n/g, '\n')
    .replace(/^•\s*$\n/gm, '')
    // Don't remove leading bullet if it's the first point
    .replace(/^•\s*(.+)/, '• $1');

  return formattedText.trim();
}

// Enhanced function to better split content into bullet points
function splitIntoPoints(text: string): string[] {
  // Aggressive filtering of technology/unrelated content
  let cleanedText = text
    // Remove technology implementation content
    .replace(/Discuss Technology Implementation[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Architecture Design:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Performance Optimization:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Security Framework:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Integration Strategy:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Monitoring Solutions:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Best Practices:[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    
    // Remove other tech-related content patterns
    .replace(/API-first approach[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Real-time analytics[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Industry standards[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Multi-layer protection[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/Scalable and maintainable[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    .replace(/860% improvement[\s\S]*?(?=The Sinners|Low-key|High-contrast|Dutch|Framing|A keen|How can|Which camera|By employing|$)/gi, '')
    
    // Clean up any remaining tech artifacts
    .replace(/\b(API|framework|architecture|optimization|monitoring|scalable|maintainable|efficiency|compliance)\b(?!\s+(for|in|of)\s+(film|cinema|movie|visual|lighting|camera))/gi, '')
    .trim();

  // If after cleaning we have nothing cinematography-related, return empty
  if (!cleanedText || cleanedText.length < 20) {
    return [];
  }

  // First, split on explicit bullet points
  let points = cleanedText.split(/\s*•\s*/).filter(point => point.trim());
  
  // Apply aggressive splitting for long content
  if (points.length <= 1 && cleanedText.length > 80) {
    const longText = points[0] || cleanedText;
    
    // Very aggressive splitting - split on any sentence ending followed by capital letter
    const aggressiveSplit = longText.split(/\.\s+(?=[A-Z•])/);
    
    if (aggressiveSplit.length > 1) {
      return aggressiveSplit
        .map(point => {
          let cleanPoint = point.trim();
          // Remove any leading bullet symbols
          cleanPoint = cleanPoint.replace(/^[•·▪▫◦‣⁃\-*]\s*/, '');
          // Filter out tech-related sentences
          if (/\b(API|framework|architecture|optimization|monitoring|scalable|performance|security)\b/i.test(cleanPoint) && 
              !/\b(film|cinema|movie|visual|lighting|camera|angle|composition|shot)\b/i.test(cleanPoint)) {
            return '';
          }
          // Ensure sentences end with periods
          if (cleanPoint && !cleanPoint.endsWith('.') && !cleanPoint.endsWith('?') && !cleanPoint.endsWith(':')) {
            cleanPoint += '.';
          }
          return cleanPoint;
        })
        .filter(p => p.length > 15); // Filter out very short fragments
    }
  }
  
  return points.length > 0 ? points : [cleanedText];
}

export function SlideRenderer({ content, title, className = '', isPresentation = false }: SlideRendererProps) {
  const renderContent = () => {
    if (!content) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No content available</p>
        </div>
      );
    }

    if (content && typeof content === 'object' && content.objects && Array.isArray(content.objects)) {
      const titleObj = content.objects.find((obj: FabricObject) => {
        if (obj.type !== 'textbox' || !obj.text) return false;
        
        const hasLargeFont = obj.fontSize && obj.fontSize > 20;
        const isBold = obj.fontWeight === 'bold' || obj.fontWeight === 700 || (typeof obj.fontWeight === 'number' && obj.fontWeight > 400);
        const isAtTop = obj.top !== undefined && obj.top < 100;
        const isShortText = obj.text.length < 80;
        
        return (hasLargeFont || isBold || isAtTop) && isShortText;
      });
      
      const displayTitle = title || (titleObj ? titleObj.text : 'Slide Content');
      
      const contentObjs = content.objects.filter((obj: FabricObject) => 
        obj.type === 'textbox' && obj.text && obj !== titleObj
      );
      
      const allTextObjs = content.objects.filter((obj: FabricObject) => 
        obj.type === 'textbox' && obj.text
      );
      
      const finalContentObjs = contentObjs.length > 0 ? contentObjs : 
        (allTextObjs.length > 1 ? allTextObjs.slice(1) : allTextObjs);
      
      const imageObjs = content.objects.filter((obj: FabricObject) => 
        obj.type === 'image' && obj.src
      );

      const paddingClass = isPresentation ? 'p-4 md:p-6 lg:p-8' : 'p-6';
      const titleSizeClass = isPresentation ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl';
      const textSizeClass = isPresentation ? 'text-base md:text-lg lg:text-xl' : 'text-sm md:text-base';

      return (
        <div className={`${isPresentation ? 'h-full' : 'min-h-full'} flex flex-col ${paddingClass} ${isPresentation ? 'space-y-2 md:space-y-3' : 'space-y-3 md:space-y-4'} bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative ${isPresentation ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400 to-blue-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className={`relative z-10 text-center ${titleSizeClass} font-black leading-tight ${isPresentation ? 'mb-3 md:mb-4' : 'mb-6'} flex-shrink-0`}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
              {formatText(displayTitle)}
            </span>
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${isPresentation ? 'w-24 md:w-32 h-0.5 md:h-1' : 'w-20 md:w-24 h-0.5'} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}></div>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
            {imageObjs.length > 0 && (
              <div className="lg:w-1/2 flex-shrink-0">
                <div className="relative group">
                  <img
                    src={imageObjs[0].src}
                    alt="Slide visual"
                    className={`w-full ${isPresentation ? 'h-32 md:h-48 lg:h-full' : 'h-48 lg:h-full'} object-cover rounded-xl shadow-xl transition-all duration-300 border-2 border-white/50`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
              </div>
            )}
            
            <div className={`${imageObjs.length > 0 ? 'lg:w-1/2' : 'w-full'} flex flex-col ${isPresentation ? 'overflow-y-auto' : ''} min-h-0`}>
              <div className={`${isPresentation ? 'space-y-2 md:space-y-3' : 'space-y-4'} ${isPresentation ? 'pb-4' : ''}`}>
                {finalContentObjs.map((obj: FabricObject, index: number) => {
                  if (!obj.text) return null;
                  
                  const formattedText = formatRichText(obj.text);
                  
                  // Use the new splitting function for better bullet point detection
                  const points = splitIntoPoints(formattedText);
                  
                  return (
                    <div key={index} className={isPresentation ? 'space-y-1 md:space-y-2' : 'space-y-3'}>
                      {points.map((point: string, pointIndex: number) => {
                        const trimmedPoint = point.trim();
                        if (!trimmedPoint) return null;
                        
                        // Check if this should be a bullet point (most content should be)
                        const shouldBeBullet = !trimmedPoint.match(/^(\d+\.)/); // Not a numbered item
                        const numberMatch = trimmedPoint.match(/^(\d+\.?)\s+(.+)/);
                        
                        if (shouldBeBullet && !numberMatch) {
                          return (
                            <div key={pointIndex} className={`flex items-start ${isPresentation ? 'space-x-3 md:space-x-4 group hover:bg-white/50 p-2 md:p-3' : 'space-x-3 group hover:bg-white/50 p-3'} rounded-lg transition-all`}>
                              <div className={`flex-shrink-0 ${isPresentation ? 'w-2 h-2 md:w-3 md:h-3 mt-2' : 'w-2 h-2 mt-2'} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg`}></div>
                              <div 
                                className={`${textSizeClass} text-gray-700 leading-relaxed font-medium`}
                                dangerouslySetInnerHTML={{
                                  __html: trimmedPoint
                                    .replace(/^[•·▪▫◦‣⁃\-*]\s*/, '') // Remove any existing bullet
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                }}
                              />
                            </div>
                          );
                        } else if (numberMatch) {
                          return (
                            <div key={pointIndex} className={`flex items-start ${isPresentation ? 'space-x-3 md:space-x-4 group hover:bg-white/50 p-2 md:p-3' : 'space-x-3 group hover:bg-white/50 p-3'} rounded-lg transition-all`}>
                              <div className={`flex-shrink-0 ${isPresentation ? 'w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm' : 'w-6 h-6 text-xs'} rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg`}>
                                {numberMatch[1].replace('.', '').trim()}
                              </div>
                              <div 
                                className={`${textSizeClass} text-gray-700 leading-relaxed font-medium`}
                                dangerouslySetInnerHTML={{
                                  __html: numberMatch[2]
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                }}
                              />
                            </div>
                          );
                        } else {
                          // Regular text block
                          const processedText = trimmedPoint
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>');
                          
                          return (
                            <div key={pointIndex} className={`${isPresentation ? 'p-3 md:p-4' : 'p-4'} rounded-xl transition-all hover:shadow-md bg-white/60 backdrop-blur-sm border border-white/30`}>
                              <div 
                                className={`${textSizeClass} text-gray-800 leading-relaxed font-medium`}
                                dangerouslySetInnerHTML={{ __html: processedText }} 
                              />
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (typeof content === 'string') {
      const titleSizeClass = isPresentation ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-xl md:text-2xl';
      const textSizeClass = isPresentation ? 'text-lg md:text-xl lg:text-2xl' : 'text-sm md:text-base';

      return (
        <div className={`h-full flex flex-col justify-center items-center ${isPresentation ? 'p-6 md:p-8 lg:p-12' : 'p-6'} bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400 to-blue-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          {title && (
            <div className={`relative z-10 text-center ${titleSizeClass} font-black leading-tight ${isPresentation ? 'mb-8 md:mb-12' : 'mb-6'}`}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
                {formatText(title)}
              </span>
              <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${isPresentation ? 'w-32 md:w-40 h-1' : 'w-20 md:w-24 h-0.5'} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}></div>
            </div>
          )}
          
          <div className="relative z-10 w-full max-w-6xl">
            <div className={`${isPresentation ? 'p-8 md:p-12' : 'p-6'} rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-xl`}>
              <div className={`${textSizeClass} text-gray-800 leading-relaxed font-medium whitespace-pre-wrap`}>
                {formatRichText(content)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Unsupported content format</p>
      </div>
    );
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {renderContent()}
    </div>
  );
}
