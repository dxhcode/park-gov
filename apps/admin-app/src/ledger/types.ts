export const affairBuckets = [
  'tasks',
  'risks',
  'lands',
  'assessments',
  'policies',
  'complaints',
  'submissions',
  'reports',
  'settings',
] as const

export type AffairBucket = (typeof affairBuckets)[number]

export type LedgerKind = 'text' | 'textarea' | 'select' | 'number' | 'park' | 'enterprise'

export interface LedgerRecord {
  id: string
  [key: string]: string | number
}

export interface AffairsState {
  tasks: LedgerRecord[]
  risks: LedgerRecord[]
  lands: LedgerRecord[]
  assessments: LedgerRecord[]
  policies: LedgerRecord[]
  complaints: LedgerRecord[]
  submissions: LedgerRecord[]
  reports: LedgerRecord[]
  settings: LedgerRecord[]
}

export interface LedgerField {
  key: string
  label: string
  kind: LedgerKind
  required?: boolean
  options?: readonly string[]
  placeholder?: string
  table?: boolean
  tableWidth?: number
  span?: 8 | 12 | 24
  status?: boolean
  min?: number
  max?: number
  initial: string | number
  pattern?: RegExp
  patternMessage?: string
  unit?: string
  filter?: boolean
  filterPlaceholder?: string
}

export interface LedgerLink {
  label: string
  to: string
  screen?: boolean
}

export interface LedgerStat {
  label: string
  value: string | number
  hint?: string
}

export interface LedgerModule {
  key: string
  path: string
  bucket: AffairBucket
  idPrefix: string
  group: string
  eyebrow: string
  title: string
  listHint: string
  detailTitle: string
  detailHint: string
  createTitle: string
  editTitle: string
  formHint: string
  createLabel: string
  emptyTitle: string
  searchPlaceholder: string
  searchKeys: string[]
  nameKey: string
  fields: LedgerField[]
  links?: LedgerLink[]
  stats: (rows: LedgerRecord[]) => LedgerStat[]
}
