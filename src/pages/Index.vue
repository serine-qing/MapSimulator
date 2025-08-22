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
<div class="index">
  <Menu  @changeStage = "handleChangeStage"/>
  <div class="main">
    <Game 
      ref="game"
    />

    <div class="beian">
      <img src="/beian.png" alt="">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=51011402000931" rel="noreferrer" target="_blank">川公网安备51011402000931号</a>
    </div>
  </div>
  
  
  
</div>
  
</template>

<style scoped>
.index{
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  .main{
    flex: 1;
    overflow: auto;
  }
}
#c{
  display: block;
  position: fixed;
}

.beian{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
  img{
    margin-right: 2px ;
    height: 18px;
  }
}
</style>
