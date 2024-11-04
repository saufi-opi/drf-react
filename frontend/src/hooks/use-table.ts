import api from '@/lib/api'
import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface UseTableOptions {
  url: string
  fixedFilter?: Record<string, string>
  syncToSearchParams?: boolean
}

export const useTable = <D>(options: UseTableOptions) => {
  const { url, syncToSearchParams = true } = options

  const [searchParams, setSearchParams] = useSearchParams()
  const initialPage = syncToSearchParams ? Number(searchParams.get('page') ?? 1) : 1
  const initialSearch = syncToSearchParams ? (searchParams.get('search') ?? '') : ''
  const initialFilter = options.fixedFilter
    ? {
        ...options.fixedFilter,
        ...(syncToSearchParams ? parseFilterParams(searchParams.get('filter') ?? '') : {})
      }
    : syncToSearchParams
      ? parseFilterParams(searchParams.get('filter') ?? '')
      : {}

  const [data, setData] = useState<D[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(initialPage)
  const [filter, setFilter] = useState<Record<string, string>>(initialFilter)
  const [search, setSearch] = useState<string>(initialSearch)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(generateURL(url, page, filter, search))
      setData(response.data.results)
      setCount(response.data.count)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setPage(1)
      }
    } finally {
      setLoading(false)
    }
  }, [url, page, filter, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!syncToSearchParams) return

    setSearchParams((params) => {
      // 1. update page params
      if (page !== 1) {
        params.set('page', page.toString())
      } else {
        params.delete('page')
      }

      // 2. update search params
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }

      // 3. update filter params
      const filterString = Object.entries(filter)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
      if (filterString) {
        params.set('filter', filterString)
      } else {
        params.delete('filter')
      }

      return params
    })
  }, [page, search, filter, setSearchParams, syncToSearchParams])

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm)
    setPage(1) // Reset to first page when searching
  }, [])

  const handleFilter = useCallback((newFilter: Record<string, string>) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter
    }))
    setPage(1) // Reset to first page when filtering
  }, [])

  const clearFilters = useCallback(() => {
    if (Object.keys(filter).length === 0) return
    setFilter(options.fixedFilter ?? {})
    setPage(1)
  }, [filter, options.fixedFilter])

  return {
    data,
    count,
    loading,
    setData,
    page,
    setPage,
    filter,
    setFilter: handleFilter,
    clearFilters,
    search,
    handleSearch,
    refetch: fetchData
  }
}

const generateURL = (base: string, page: number | undefined, filter: Record<string, string>, search?: string) => {
  const params = new URLSearchParams()

  if (page && page !== 1) {
    params.append('page', String(page))
  }

  if (search) {
    params.append('search', search)
  }

  // Add filter params
  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      params.append(key, value)
    }
  })

  return `${base}?${params.toString()}`
}

const parseFilterParams = (filterString: string): Record<string, string> => {
  const filter: Record<string, string> = {}
  if (filterString) {
    filterString.split(',').forEach((pair) => {
      const [key, value] = pair.split(':')
      if (key && value) {
        filter[key] = value
      }
    })
  }
  return filter
}
