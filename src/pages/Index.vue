<script lang="ts" setup>
import { ref } from 'vue';
import Menu from '@/pages/Menu.vue';
import Game from "@/pages/Game.vue"

const mapData = ref();
const handleChangeStage = (map: any) => {
  mapData.value = map;
}

</script>

<template>
<div class="index">
  <Menu @changeStage = "handleChangeStage"/>
  <Game :mapData = "mapData"/>
</div>
  
</template>

<style scoped>
.index{
  height: 100vh;
  width: 100vw;
  display: flex;
}
#c{
  display: block;
  position: fixed;
}
</style>
