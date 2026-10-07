import { defineStore } from 'pinia'
import { ref } from 'vue'
import { enterprises as seedEnterprises } from '../mock/parks'
import { idles as seedIdles, rooms as seedRooms } from '../mock/space'
import type { Enterprise, EnterpriseInput, IdleAsset, IdleAssetInput, SpaceRoom, SpaceRoomInput } from '../mock/types'

const REGISTRY_KEY = 'park-gov.registry.v1'

interface RegistryState {
  enterprises: Enterprise[]
  rooms: SpaceRoom[]
  idles: IdleAsset[]
}

function cloneSeed(): RegistryState {
  return {
    enterprises: structuredClone(seedEnterprises),
    rooms: structuredClone(seedRooms),
    idles: structuredClone(seedIdles),
  }
}

function isRegistryState(value: unknown): value is RegistryState {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<RegistryState>
  return Array.isArray(record.enterprises) && Array.isArray(record.rooms) && Array.isArray(record.idles)
}

function readState(): RegistryState {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY)
    if (!raw) return cloneSeed()
    const parsed: unknown = JSON.parse(raw)
    if (!isRegistryState(parsed)) return cloneSeed()
    return parsed
  } catch {
    return cloneSeed()
  }
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
}

export const useRegistryStore = defineStore('registry', () => {
  const state = ref<RegistryState>(readState())

  function persist() {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(state.value))
  }

  function reset() {
    state.value = cloneSeed()
    localStorage.removeItem(REGISTRY_KEY)
  }

  function enterpriseById(id: string) {
    return state.value.enterprises.find((item) => item.id === id)
  }

  function roomById(id: string) {
    return state.value.rooms.find((item) => item.id === id)
  }

  function idleById(id: string) {
    return state.value.idles.find((item) => item.id === id)
  }

  function roomsOfEnterprise(enterpriseId: string) {
    return state.value.rooms.filter((item) => item.enterpriseId === enterpriseId)
  }

  function saveEnterprise(input: EnterpriseInput, id?: string) {
    if (id) {
      const index = state.value.enterprises.findIndex((item) => item.id === id)
      if (index < 0) return undefined
      const next: Enterprise = { ...input, id }
      state.value.enterprises.splice(index, 1, next)
      persist()
      return next
    }
    const created: Enterprise = { ...input, id: nextId('ent') }
    state.value.enterprises.unshift(created)
    persist()
    return created
  }

  function saveRoom(input: SpaceRoomInput, id?: string) {
    if (id) {
      const index = state.value.rooms.findIndex((item) => item.id === id)
      if (index < 0) return undefined
      const next: SpaceRoom = { ...input, id }
      state.value.rooms.splice(index, 1, next)
      persist()
      return next
    }
    const created: SpaceRoom = { ...input, id: nextId('room') }
    state.value.rooms.unshift(created)
    persist()
    return created
  }

  function saveIdle(input: IdleAssetInput, id?: string) {
    if (id) {
      const index = state.value.idles.findIndex((item) => item.id === id)
      if (index < 0) return undefined
      const next: IdleAsset = { ...input, id }
      state.value.idles.splice(index, 1, next)
      persist()
      return next
    }
    const created: IdleAsset = { ...input, id: nextId('idle') }
    state.value.idles.unshift(created)
    persist()
    return created
  }

  return {
    state,
    reset,
    enterpriseById,
    roomById,
    idleById,
    roomsOfEnterprise,
    saveEnterprise,
    saveRoom,
    saveIdle,
  }
})
