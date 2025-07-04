<script lang="ts">
import Game from "@/components/game/Game"
import {setupCanvas} from '@/components/game/GameCanvas.ts';


export default{
  data(){
    return{
    }
  },
  props:["mapData"],
  watch:{
    async mapData(){
      if(!this.game){
        this.game = new Game();
      }
      this.game.startGame(this.mapData);
    }
  },
  mounted() {
    setupCanvas(this.$refs.wrapper);
  },
}
</script>

<template>
<div class="game">
  <div class="wrapper" ref="wrapper">
    <canvas id="c"></canvas>
  </div>
</div>
</template>

<style scoped lang="scss">
.game{
  flex: 1;
  height: 100%;
  .wrapper{
    height: 100%;
    width: 100%;
  }
}

canvas{
  display: block;
  position: fixed;
}
</style>
