'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { TradingSymbol, SymbolsQueryParams } from '../types'
import { symbolsApi } from '../api'

interface SymbolsContextType {
  symbols: TradingSymbol[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  fetchSymbols: (params?: SymbolsQueryParams) => Promise<void>
  createSymbol: (data: any) => Promise<void>
  updateSymbol: (symbol: string, data: any) => Promise<void>
  deleteSymbol: (symbol: string) => Promise<void>
  refreshSymbols: () => Promise<void>
}

const SymbolsContext = createContext<SymbolsContextType | undefined>(undefined)

export function SymbolsProvider({ children }: { children: React.ReactNode }) {
  const [symbols, setSymbols] = useState<TradingSymbol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  })

  const fetchSymbols = async (params?: SymbolsQueryParams) => {
    try {
      setLoading(true)
      setError(null)
      const response = await symbolsApi.getAll(params)
      setSymbols(response.items)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch symbols')
      console.error('Failed to fetch symbols:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSymbol = async (data: any) => {
    try {
      const newSymbol = await symbolsApi.create(data)
      setSymbols(prev => [...prev, newSymbol])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create symbol')
      throw err
    }
  }

  const updateSymbol = async (symbol: string, data: any) => {
    try {
      const updatedSymbol = await symbolsApi.update(symbol, data)
      setSymbols(prev =>
        prev.map(s => s.symbol === symbol ? updatedSymbol : s)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update symbol')
      throw err
    }
  }

  const deleteSymbol = async (symbol: string) => {
    try {
      const disabledSymbol = await symbolsApi.disable(symbol)
      setSymbols(prev =>
        prev.map(s => s.symbol === symbol ? disabledSymbol : s)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable symbol')
      throw err
    }
  }

  const refreshSymbols = async () => {
    await fetchSymbols()
  }

  useEffect(() => {
    fetchSymbols()
  }, [])

  const value = {
    symbols,
    loading,
    error,
    pagination,
    fetchSymbols,
    createSymbol,
    updateSymbol,
    deleteSymbol,
    refreshSymbols,
  }

  return (
    <SymbolsContext.Provider value={value}>
      {children}
    </SymbolsContext.Provider>
  )
}

export function useSymbols() {
  const context = useContext(SymbolsContext)
  if (context === undefined) {
    throw new Error('useSymbols must be used within a SymbolsProvider')
  }
  return context
}