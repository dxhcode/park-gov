<script setup lang="ts">
defineProps<{
  title: string
  extra?: string
}>()
</script>

<template>
  <section class="glass">
    <header>
      <i aria-hidden="true" />
      <h3>{{ title }}</h3>
      <em v-if="extra">{{ extra }}</em>
    </header>
    <div class="body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.glass {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: 12px 14px 14px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(186, 236, 255, 0.14), rgba(6, 18, 32, 0.62));
  border: 1px solid rgba(126, 235, 255, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 0 28px rgba(63, 212, 255, 0.08);
  backdrop-filter: blur(16px);
}

.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 36%, rgba(142, 239, 255, 0.14), transparent 64%);
  transform: translateX(-120%);
  animation: sheen 8.5s ease-in-out infinite;
}

header {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 10px;
}

header i {
  width: 8px;
  height: 8px;
  background: #e2b657;
  box-shadow: 0 0 10px #e2b657;
  transform: rotate(45deg);
}

h3 {
  flex: 1;
  margin: 0;
  color: #f4fbff;
  font-size: 15px;
  letter-spacing: 0.14em;
}

em {
  color: rgba(190, 226, 240, 0.72);
  font-style: normal;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.body {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

@keyframes sheen {
  0%,
  55% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}
</style>
