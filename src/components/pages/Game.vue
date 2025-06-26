<script lang="ts" setup>
import Game from '@/components/game/GameManager.ts';
import { ref, watch } from 'vue'

const { mapData } = defineProps(['mapData'])
const wrapper = ref();

//我们给 watch 传递的是一个值而不是响应式数据源，所以要用getter包装
watch( () => mapData, () => {
  const game = new Game(wrapper.value, mapData)
})

</script>

<template>
  <el-col 
    :xs="14" 
    :sm="16"
    :md="18"
    :lg="19"
    :xl="20"
    
  >
  <div class="wrapper" ref="wrapper">
    <canvas id="c"></canvas>
  </div>
  </el-col>
</template>

<style scoped>
.wrapper{
  height: 100%;
  width: 100%;
}
canvas{
  display: block;
  position: fixed;
}
</style>
