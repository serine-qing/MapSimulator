<script lang="ts" setup>
import { ref } from 'vue';
import Menu from '@/pages/Menu.vue';
import Game from "@/pages/Game.vue"
import Header from "@/pages/Header.vue"

const game = ref();
const handleChangeStage = (map: any) => {
  game.value.newGame(map);
}

</script>

<template>

<div class="index">
  <Header></Header>
  <div class="content">
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

</div>
  
</template>

<style>
:root {
  --primary: #4361ee;
  --primary-light: #eef2ff;
  --secondary: #3a0ca3;
  --accent: #4cc9f0;
  --text: #2d3748;
  --text-light: #718096;
  --bg: #f7fafc;
  --card-bg: #ffffff;
  --border: #e2e8f0;
  --success: #48bb78;
  --warning: #ed8936;
  --danger: #f56565;
}

</style>

<style scoped>
.index{
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.content{
  flex: 1;
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
