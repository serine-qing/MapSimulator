<script lang="ts" setup>
import { ref } from 'vue';
import Menu from '@/pages/Menu.vue';
import Game from "@/pages/Game.vue"

const game = ref();
const handleChangeStage = (map: any) => {
  game.value.newGame(map);
}
</script>

<template>
<div class="home">
  <Menu @changeStage="handleChangeStage"/>
  <div class="main">
    <Game ref="game" />
  </div>
</div>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main {
  flex: 1;
  overflow: auto;
}

/* 窄屏：Game内部已经是「上地图下表格」的整屏分栏，外层不再滚动 */
@media (max-width: 768px) {
  .main {
    overflow: hidden;
  }
}
</style>
