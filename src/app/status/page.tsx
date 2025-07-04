'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface HealthStatus {
  timestamp: string
  status: string
  environment: string
  services: {
    database: string
    neo4j: string
    clerk: string
    groq: string
  }
  missing_vars: string[]
  warnings: string[]
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const fetchHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Failed to fetch health status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'configured':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error':
      case 'missing':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'configured':
        return 'text-green-600'
      case 'error':
      case 'missing':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
              <Button
                onClick={fetchHealth}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
            {lastChecked && (
              <p className="text-sm text-gray-500 mt-1">
                Last checked: {lastChecked.toLocaleString()}
              </p>
            )}
          </div>

          <div className="p-6">
            {loading && !health ? (
              <div className="flex items-center justify-center py-8">
                <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Checking system health...</span>
              </div>
            ) : health ? (
              <div className="space-y-6">
                {/* Overall Status */}
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    health.status === 'healthy' 
                      ? 'bg-green-100 text-green-800'
                      : health.status === 'degraded'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {health.status.toUpperCase()}
                  </div>
                  <span className="text-gray-600">
                    Environment: {health.environment}
                  </span>
                </div>

                {/* Services Status */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(health.services).map(([service, status]) => (
                      <div key={service} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(status)}
                          <span className="font-medium capitalize">{service}</span>
                        </div>
                        <span className={`text-sm font-medium capitalize ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Variables */}
                {health.missing_vars.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Missing Required Variables</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex">
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Configuration Required
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <ul className="list-disc list-inside space-y-1">
                              {health.missing_vars.map((variable) => (
                                <li key={variable}>{variable}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {health.warnings.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Features</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Optional Configuration
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc list-inside space-y-1">
                              {health.warnings.map((variable) => (
                                <li key={variable}>{variable} - feature will be disabled</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Setup Instructions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Setup Instructions</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-700 space-y-2">
                      <p>1. Copy <code>.env.example</code> to <code>.env.local</code></p>
                      <p>2. Fill in your Clerk keys from the Clerk Dashboard</p>
                      <p>3. Set up your PostgreSQL database URL</p>
                      <p>4. Configure Neo4j connection details</p>
                      <p>5. Add your Groq API key for AI features</p>
                      <p>6. Run <code>npx prisma migrate dev</code> to set up the database</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">Failed to load system status</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
