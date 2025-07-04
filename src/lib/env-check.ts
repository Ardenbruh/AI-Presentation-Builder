// Environment configuration checker
export const envConfig = {
  // Required environment variables
  required: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEO4J_URI: process.env.NEO4J_URI,
    NEO4J_USERNAME: process.env.NEO4J_USERNAME,
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
  },
  // Optional environment variables
  optional: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  }
}

export function checkEnvironmentVariables() {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  Object.entries(envConfig.required).forEach(([key, value]) => {
    if (!value) {
      missing.push(key)
    }
  })

  // Check optional variables
  Object.entries(envConfig.optional).forEach(([key, value]) => {
    if (!value) {
      warnings.push(key)
    }
  })

  return {
    missing,
    warnings,
    isValid: missing.length === 0,
    hasWarnings: warnings.length > 0
  }
}

export function getSetupInstructions() {
  const check = checkEnvironmentVariables()
  
  let instructions = []
  
  if (check.missing.length > 0) {
    instructions.push(`⚠️  Missing required environment variables: ${check.missing.join(', ')}`)
    instructions.push('Please add these to your .env.local file')
  }
  
  if (check.hasWarnings) {
    instructions.push(`ℹ️  Optional environment variables not set: ${check.warnings.join(', ')}`)
    instructions.push('These features will be disabled until configured')
  }
  
  if (check.isValid && !check.hasWarnings) {
    instructions.push('✅ All environment variables configured correctly!')
  }
  
  return instructions
}
