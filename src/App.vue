<script lang="ts" setup>
import { ref } from 'vue';
import StoryMenu from '@/components/pages/StoryMenu.vue';
import Game from "@/components/pages/Game.vue"

const mapData = ref();
const handleChangeStage = (map: any) => {
  mapData.value = map;
}

</script>

<template>
<el-row>
  <StoryMenu @changeStage = "handleChangeStage"/>
  <Game :mapData = "mapData"/>
</el-row>
  
</template>

<style scoped>
#c{
  display: block;
  position: fixed;
}
</style>
