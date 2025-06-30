<script lang="ts">
import Game from '@/components/game/GameManager.ts';
import {setupCanvas} from '@/components/game/GameCanvas.ts';

export default{
  data(){
    return{
    }
  },
  props:["mapData"],
  watch:{
    mapData(){
      if(this.game){
        this.game.destroy();
      }

      this.game = new Game(this.mapData)
    }
  },
  mounted() {
    setupCanvas(this.$refs.wrapper);
  },
}
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
