<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { scenes } from '../config/scenes'
import { useScreenStore } from '../stores/screen'

const screen = useScreenStore()

onMounted(() => screen.start())
onUnmounted(() => screen.stop())
</script>

<template>
  <div class="screen">
    <div class="bg-grid" aria-hidden="true" />
    <div class="glow glow-a" aria-hidden="true" />
    <div class="glow glow-b" aria-hidden="true" />
    <div class="scan" aria-hidden="true" />

    <div class="frame">
      <i class="corner c1" aria-hidden="true" />
      <i class="corner c2" aria-hidden="true" />
      <i class="corner c3" aria-hidden="true" />
      <i class="corner c4" aria-hidden="true" />

      <header class="top">
        <div class="brand">
          <div class="seal" aria-hidden="true">园</div>
          <div>
            <strong>{{ screen.platformName }}</strong>
            <em>PARK GOVERNANCE</em>
          </div>
        </div>
        <div class="plate">
          <span>数字监管</span>
          <h1>园区监管态势大屏</h1>
        </div>
        <div class="clock">
          <span>{{ screen.dateText }}</span>
          <strong>{{ screen.timeText }}</strong>
          <em>本地时间</em>
        </div>
      </header>

      <nav class="nav" aria-label="态势场景">
        <router-link
          v-for="scene in scenes"
          :key="scene.key"
          :to="scene.path"
          custom
          v-slot="{ href, navigate, isExactActive }"
        >
          <a :href="href" :class="{ active: isExactActive }" @click="navigate">
            <i>{{ scene.code }}</i>
            {{ scene.title }}
          </a>
        </router-link>
      </nav>

      <main>
        <router-view />
      </main>

      <footer>
        <span><b />链路待命</span>
        <span>界面骨架 · 未接入业务数据</span>
        <span>图表 / 地图 / 接口待接入</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.screen {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #e7f6ff;
  background: #040a12;
}

.bg-grid,
.glow,
.scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-grid {
  background-image:
    linear-gradient(rgba(90, 190, 220, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 190, 220, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at 50% 40%, #000 30%, transparent 78%);
  animation: grid-pan 28s linear infinite;
}

.glow {
  inset: auto;
  width: 42vw;
  height: 42vw;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.45;
}

.glow-a {
  top: -12vw;
  left: -8vw;
  background: radial-gradient(circle, rgba(40, 150, 210, 0.55), transparent 68%);
  animation: drift 18s ease-in-out infinite;
}

.glow-b {
  right: -10vw;
  bottom: -16vw;
  background: radial-gradient(circle, rgba(210, 164, 70, 0.28), transparent 68%);
  animation: drift 22s ease-in-out infinite reverse;
}

.scan {
  height: 140px;
  background: linear-gradient(180deg, transparent, rgba(94, 231, 255, 0.08), transparent);
  animation: scan 8s linear infinite;
}

.frame {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 14px;
  padding: 16px 18px 12px;
  background: linear-gradient(180deg, rgba(8, 22, 36, 0.72), rgba(5, 12, 20, 0.78));
  border: 1px solid rgba(110, 214, 245, 0.28);
  box-shadow:
    inset 0 0 0 1px rgba(226, 182, 87, 0.16),
    0 0 40px rgba(40, 160, 210, 0.12);
  backdrop-filter: blur(8px);
}

.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border: 2px solid #8eebff;
}

.c1 { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.c2 { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
.c3 { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
.c4 { right: -1px; bottom: -1px; border-top: 0; border-left: 0; }

.top {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
  gap: 16px;
  align-items: center;
}

.brand,
.clock {
  display: flex;
  gap: 12px;
  align-items: center;
}

.clock {
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.seal {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  color: #f3d48a;
  font-weight: 700;
  font-size: 20px;
  background: radial-gradient(circle at 30% 30%, #16486f, #07131f 72%);
  box-shadow:
    0 0 16px rgba(94, 231, 255, 0.28),
    inset 0 0 0 1px rgba(243, 212, 138, 0.95),
    inset 0 0 0 5px rgba(7, 19, 31, 0.9),
    inset 0 0 0 6px rgba(142, 235, 255, 0.7);
}

.brand strong,
.clock strong {
  display: block;
  letter-spacing: 0.06em;
}

.brand em,
.clock em,
.clock span,
.plate span {
  color: rgba(190, 226, 240, 0.72);
  font-style: normal;
  font-size: 12px;
  letter-spacing: 0.18em;
}

.plate {
  position: relative;
  min-width: min(460px, 46vw);
  padding: 10px 54px 12px;
  text-align: center;
  background: linear-gradient(180deg, rgba(16, 62, 96, 0.92), rgba(7, 22, 36, 0.88));
  clip-path: polygon(7% 0, 93% 0, 100% 100%, 0 100%);
  box-shadow: inset 0 -2px 0 #67e4ff;
}

.plate span {
  display: block;
  color: #e2b657;
}

.plate h1 {
  margin: 2px 0 0;
  color: #f4fbff;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-shadow: 0 0 18px rgba(103, 228, 255, 0.45);
}

.clock strong {
  color: #9aefff;
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  text-shadow: 0 0 12px rgba(103, 228, 255, 0.45);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 16px 0 14px;
}

.nav a {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 16px;
  color: rgba(226, 246, 255, 0.84);
  text-decoration: none;
  background: rgba(8, 26, 42, 0.62);
  border: 1px solid rgba(110, 214, 245, 0.28);
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  backdrop-filter: blur(8px);
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.nav a i {
  color: #e2b657;
  font-style: normal;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.nav a:hover {
  border-color: rgba(226, 182, 87, 0.8);
  transform: translateY(-1px);
}

.nav a.active {
  color: #062033;
  font-weight: 700;
  background: linear-gradient(90deg, #f0d48a, #8eefff);
  border-color: transparent;
  box-shadow: 0 0 18px rgba(142, 239, 255, 0.35);
}

.nav a.active i {
  color: #062033;
}

main {
  flex: 1;
  min-height: 0;
}

footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding-top: 8px;
  color: rgba(190, 226, 240, 0.72);
  font-size: 12px;
  letter-spacing: 0.08em;
  border-top: 1px solid rgba(110, 214, 245, 0.18);
}

footer span {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

footer b {
  width: 7px;
  height: 7px;
  background: #e2b657;
  border-radius: 50%;
  box-shadow: 0 0 8px #e2b657;
}

@keyframes grid-pan {
  from { background-position: 0 0, 0 0; }
  to { background-position: 0 56px, 56px 0; }
}

@keyframes drift {
  0%,
  100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(4%, -3%, 0); }
}

@keyframes scan {
  from { transform: translateY(-160px); }
  to { transform: translateY(100vh); }
}

@media (max-width: 980px) {
  .top {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .clock,
  .brand {
    align-items: center;
  }

  .clock {
    align-items: center;
  }

  .plate {
    min-width: 0;
    width: 100%;
  }

  .plate h1 {
    font-size: 22px;
    letter-spacing: 0.12em;
  }

  footer {
    flex-direction: column;
    align-items: center;
  }
}
</style>
