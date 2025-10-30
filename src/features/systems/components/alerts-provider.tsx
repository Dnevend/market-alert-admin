'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AlertHistory, AlertsQueryParams } from '../types'
import { alertsApi } from '../api'

interface AlertsContextType {
  alerts: AlertHistory[]
  loading: boolean
  error: string | null
  fetchAlerts: (params?: AlertsQueryParams) => Promise<void>
  refreshAlerts: () => Promise<void>
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined)

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = async (params?: AlertsQueryParams) => {
    try {
      setLoading(true)
      setError(null)
      const fetchedAlerts = await alertsApi.getAll(params)
      setAlerts(fetchedAlerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      console.error('Failed to fetch alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshAlerts = async () => {
    await fetchAlerts()
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const value = {
    alerts,
    loading,
    error,
    fetchAlerts,
    refreshAlerts,
  }

  return (
    <AlertsContext.Provider value={value}>
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts() {
  const context = useContext(AlertsContext)
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider')
  }
  return context
}