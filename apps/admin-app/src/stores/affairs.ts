import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ledgerModules } from '../ledger/modules'
import { affairSeed } from '../ledger/seed'
import { affairBuckets, type AffairBucket, type AffairsState, type LedgerRecord } from '../ledger/types'

const AFFAIRS_KEY = 'park-gov.affairs.v1'

function cloneSeed(): AffairsState {
  return structuredClone(affairSeed)
}

function isRecord(value: unknown): value is LedgerRecord {
  if (!value || typeof value !== 'object') return false
  return typeof (value as LedgerRecord).id === 'string'
}

function isBucket(value: unknown): value is LedgerRecord[] {
  return Array.isArray(value) && value.every(isRecord)
}

function readState(): AffairsState {
  const seed = cloneSeed()
  try {
    const raw = localStorage.getItem(AFFAIRS_KEY)
    if (!raw) return seed
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return seed
    const record = parsed as Partial<AffairsState>
    const next = { ...seed }
    for (const bucket of affairBuckets) {
      if (isBucket(record[bucket])) next[bucket] = record[bucket]
    }
    return next
  } catch {
    return cloneSeed()
  }
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
}

function assertSeed() {
  for (const mod of ledgerModules) {
    const rows = affairSeed[mod.bucket]
    if (rows.length < 4) throw new Error(`${mod.key} 样例不足`)
    for (const record of rows) {
      for (const field of mod.fields) {
        if (record[field.key] === undefined) {
          throw new Error(`${mod.key}/${record.id} 缺少 ${field.key}`)
        }
      }
    }
  }
}

assertSeed()

export const useAffairsStore = defineStore('affairs', () => {
  const state = ref<AffairsState>(readState())

  function persist() {
    localStorage.setItem(AFFAIRS_KEY, JSON.stringify(state.value))
  }

  function reset() {
    state.value = cloneSeed()
    localStorage.removeItem(AFFAIRS_KEY)
  }

  function byId(bucket: AffairBucket, id: string) {
    return state.value[bucket].find((item) => item.id === id)
  }

  function save(bucket: AffairBucket, input: Record<string, string | number>, idPrefix: string, id?: string) {
    const list = state.value[bucket]
    if (id) {
      const index = list.findIndex((item) => item.id === id)
      if (index < 0) return undefined
      const next: LedgerRecord = { ...input, id }
      list.splice(index, 1, next)
      persist()
      return next
    }
    const created: LedgerRecord = { ...input, id: nextId(idPrefix) }
    list.unshift(created)
    persist()
    return created
  }

  return {
    state,
    reset,
    byId,
    save,
  }
})
