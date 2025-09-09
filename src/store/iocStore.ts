import { create } from 'zustand'
import { IOC, Filters } from '@/types/ioc'
import { dedupeIOCs } from '@/lib/dedupe'

interface IOCState {
  iocs: IOC[]
  filters: Filters
  setIOCs: (items: IOC[]) => void
  setFilters: (f: Partial<Filters>) => void
}

export const useIOCStore = create<IOCState>((set) => ({
  iocs: [],
  filters: { search: '', types: [], sources: [], sort: 'latest' },
  setIOCs: (items) => set({ iocs: dedupeIOCs(items) }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } }))
}))
