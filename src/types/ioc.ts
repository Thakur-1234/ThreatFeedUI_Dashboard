export type IOCType = 'ip' | 'subnet' | 'url'
export type IOCSource = 'blocklist.de' | 'spamhaus' | 'digitalside'

export interface IOC {
  value: string
  type: IOCType
  source: IOCSource
  timestamp: string // ISO
}

export interface Filters {
  search: string
  types: IOCType[]
  sources: IOCSource[]
  sort: 'latest' | 'alpha'
}
