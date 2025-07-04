import { NextRequest, NextResponse } from 'next/server'

// Check which AI provider is currently active
export async function GET(req: NextRequest) {
  try {
    // Check environment variables to determine active provider
    const providers = {
      groq: !!process.env.GROQ_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
    }

    // Determine active provider (same logic as in ai-providers.ts)
    let activeProvider = 'mock'
    if (providers.groq) activeProvider = 'groq'
    else if (providers.anthropic) activeProvider = 'anthropic'
    else if (providers.huggingface) activeProvider = 'huggingface'

    return NextResponse.json({
      provider: activeProvider,
      availableProviders: Object.entries(providers)
        .filter(([_, available]) => available)
        .map(([name]) => name),
      isUsingMock: activeProvider === 'mock'
    })
  } catch (error) {
    console.error('Error checking AI status:', error)
    return NextResponse.json(
      { error: 'Failed to check AI status' },
      { status: 500 }
    )
  }
}
