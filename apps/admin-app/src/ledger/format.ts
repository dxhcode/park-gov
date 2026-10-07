import { parkLabel } from '../mock/lookups'
import type { LedgerField, LedgerRecord } from './types'

export function formatLedgerValue(field: LedgerField | undefined, record: LedgerRecord, enterpriseName?: string) {
  if (!field) return '—'
  const raw = record[field.key]
  if (raw === undefined || raw === '') return '—'
  if (field.kind === 'park') return parkLabel(String(raw))
  if (field.kind === 'enterprise') return enterpriseName || '未关联企业'
  if (field.unit) return `${raw} ${field.unit}`
  return String(raw)
}
