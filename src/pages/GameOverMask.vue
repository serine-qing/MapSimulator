<template>
  <div class="game-over-mask">
    <div class="message">
      模拟结束
      <el-button 
        class="restart-button" 
        type="primary"
        @click= "emit('restart')"
      >重新开始</el-button>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
const emit = defineEmits(["restart"]);

</script>

<style scoped lang="scss">
.game-over-mask{
  z-index: 2000;
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.message{
  color: white;
  font-size: 60px;
  display: flex;
  flex-direction: column;
}
.restart-button{
  margin-top: 5px;
  height: 50px;
  font-size: 26px;
}

</style>