<script setup>
import StoryMenu from '@/components/pages/plugin/StoryMenu.vue';
import Game from "@/components/pages/game/Game.vue"

</script>

<template>
<el-row>
  <StoryMenu/>
  <Game/>
</el-row>
  
</template>

<style scoped>
#c{
  display: block;
  position: fixed;
}
</style>
