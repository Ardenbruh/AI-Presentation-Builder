import neo4j, { Driver, Session, Result } from 'neo4j-driver'

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'
const username = process.env.NEO4J_USERNAME || 'neo4j'
const password = process.env.NEO4J_PASSWORD || 'password'
const database = process.env.NEO4J_DATABASE || 'neo4j'

let driver: Driver | null = null

export function getDriver(): Driver {
  if (!driver) {
    // For neo4j+s:// URIs, encryption is already configured in the URI
    // No additional config needed for AuraDB
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  }
  return driver
}

export async function closeDriver() {
  if (driver) {
    await driver.close()
    driver = null
  }
}

export async function runQuery(query: string, params: Record<string, any> = {}): Promise<Result> {
  const driver = getDriver()
  const session: Session = driver.session({ database })
  
  try {
    const result = await session.run(query, params)
    return result
  } finally {
    await session.close()
  }
}

export async function testNeo4jConnection(): Promise<boolean> {
  try {
    const driver = getDriver()
    const session = driver.session({ database })
    
    const result = await session.run('RETURN 1 as test')
    await session.close()
    return result.records.length > 0
  } catch (error) {
    console.error('Neo4j connection test failed:', error)
    return false
  }
}
