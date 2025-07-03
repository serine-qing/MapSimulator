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
