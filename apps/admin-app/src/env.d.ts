/// <reference types="vite/client" />

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    group?: string
    hint?: string
    slots?: string[]
    menuKey?: string
    public?: boolean
    code?: string
  }
}
