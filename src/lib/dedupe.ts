import { IOC } from '@/types/ioc'

export function dedupeIOCs(items: IOC[]): IOC[] {
  const seen = new Set<string>()
  const out: IOC[] = []
  for (const it of items) {
    const key = `${it.value}|${it.type}|${it.source}`
    if (!seen.has(key)) { seen.add(key); out.push(it) }
  }
  return out
}
