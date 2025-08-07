<template>
  <div class="tokens">
    <div 
      v-for="card in cards"
      class="token"
      @click="handleSelect(card)"
      :class="{active: card.selected}"
    >
      <div 
        class="mask"
        v-show="card.respawnTime > -1"
      ></div>
      <el-image :src="card.url" fit="contain" />
      
      <div 
        class="respawnTime"
        v-show="card.respawnTime > -1"
      >{{ card.respawnTime.toFixed(1) }}</div>

      <div 
        class="cnt"
        style="font-size: 14px;"
      >{{ "X" + card.cnt }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const { gameManager, tokenCards } = defineProps(["gameManager", "tokenCards"])

const cards = ref([]);
watch(() => tokenCards, () => {

  cards.value = tokenCards.map(tc => {
    const obj = {
      characterKey: tc.characterKey,
      url: tc.url,
      selected: tc.selected,
      cnt: tc.cnt,
      respawnTime: -1
    }

    return obj;
  })

  tokenCards.forEach((tc, index) => {
    tc.cardVue = cards.value[index];
  })
})

const handleSelect = (card) => {
  gameManager.handleSelectTokenCard(card.characterKey);
}


const update = () => {
  tokenCards.forEach(tc => {
    const respawnTime = tc.countdown.getCountdownTime("respawn")
    tc.cardVue.respawnTime = respawnTime;
    tc.cardVue.cnt = tc.cnt;
  })
}

const animate = () => {
  requestAnimationFrame(()=>{
    if(tokenCards){
      update();
    }
    animate();
  });
}

animate();

</script>

<style lang="scss" scoped>
.tokens{
  padding-bottom: 40px;
  .token{
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    height: 80px;
    width: 80px;
    background-color: black;
    position: relative;
    cursor: pointer;
    &.active{
      background-color: white;
      .cnt{
        color: black;
      }
    }

    .mask{
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: 10;
      background-color: #520e02;
      opacity: 0.7;
    }

    .respawnTime{
      z-index: 100;
      position: absolute;
      font-size: 20px;
      color: white;
      font-weight: bolder;
    }

    .cnt{
      z-index: 100;
      position: absolute;
      right: 1px;
      bottom: -1px;
      color: white;
    }
  }
}
</style>