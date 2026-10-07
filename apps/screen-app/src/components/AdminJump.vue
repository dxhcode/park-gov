<script setup lang="ts">
import { computed } from 'vue'
import { appHref } from '../utils/app-href'

const props = defineProps<{
  path: string
}>()

const href = computed(() => appHref('admin', props.path).toString())

function go(event: MouseEvent) {
  event.preventDefault()
  window.location.assign(href.value)
}
</script>

<template>
  <a class="admin-jump" :href="href" @click="go">
    <slot />
  </a>
</template>

<style scoped>
.admin-jump {
  color: inherit;
  text-decoration: none;
}

.admin-jump:hover {
  color: var(--park-gold-bright, #f3d48a);
}
</style>
