import { NextResponse } from 'next/server'
import { checkEnvironmentVariables, envConfig } from '@/lib/env-check'
import { prisma } from '@/lib/prisma'
import { testNeo4jConnection } from '@/lib/neo4j'

export async function GET() {
  try {
    const envCheck = checkEnvironmentVariables()
    
    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      environment: envCheck.isValid ? 'configured' : 'missing_variables',
      services: {
        database: 'unknown',
        neo4j: 'unknown',
        clerk: envConfig.required.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'configured' : 'missing',
        groq: envConfig.optional.GROQ_API_KEY ? 'configured' : 'missing'
      },
      missing_vars: envCheck.missing,
      warnings: envCheck.warnings
    }

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`
      healthStatus.services.database = 'connected'
    } catch (error) {
      healthStatus.services.database = 'error'
      healthStatus.status = 'degraded'
    }

    // Test Neo4j connection
    try {
      await testNeo4jConnection()
      healthStatus.services.neo4j = 'connected'
    } catch (error) {
      healthStatus.services.neo4j = 'error'
      healthStatus.status = 'degraded'
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed' 
      },
      { status: 500 }
    )
  }
}
