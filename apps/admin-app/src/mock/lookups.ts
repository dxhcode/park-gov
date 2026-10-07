import { buildings, parks } from './parks'

export function parkOf(id: string) {
  return parks.find((item) => item.id === id)
}

export function buildingOf(id: string) {
  return buildings.find((item) => item.id === id)
}

export function parkLabel(id: string) {
  return parkOf(id)?.shortName ?? '—'
}

export function buildingLabel(id: string) {
  if (!id) return '—'
  return buildingOf(id)?.name ?? '—'
}

export function buildingsInPark(parkId: string) {
  return buildings.filter((item) => item.parkId === parkId)
}

export function formatArea(sqm: number) {
  return `${sqm.toLocaleString('zh-CN')} ㎡`
}

export function formatRent(yuan: number) {
  if (!yuan) return '—'
  return `${yuan.toFixed(1)} 元/㎡·月`
}

export function idleDays(since: string, today = new Date()) {
  if (!since) return 0
  const start = new Date(`${since}T00:00:00`)
  if (Number.isNaN(start.getTime())) return 0
  const diff = today.getTime() - start.getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

export function matchesKeyword(keyword: string, fields: string[]) {
  const needle = keyword.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => field.toLowerCase().includes(needle))
}
