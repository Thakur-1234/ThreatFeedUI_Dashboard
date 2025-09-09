"use client"
import { useEffect, useState, useCallback } from "react"
import { fetchIOCs } from "@/lib/api"
import { useIOCStore } from "@/store/iocStore"
import { DEFAULT_REFRESH_MS } from "@/lib/constants"

export function useAutoRefresh(interval = DEFAULT_REFRESH_MS) {
  const setIOCs = useIOCStore((s) => s.setIOCs)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    const data = await fetchIOCs()
    setIOCs(data)
    setLastRefreshed(new Date())
  }, [setIOCs])

  useEffect(() => {
    if (interval <= 0) return // manual mode only
    refresh()
    const id = setInterval(refresh, interval)
    return () => clearInterval(id)
  }, [interval, refresh])

  return { lastRefreshed, refresh }
}
