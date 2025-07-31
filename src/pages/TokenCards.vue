<template>
  <div class="tokens">
    <div 
      v-for="card in cards"
      class="token"
      @click="handleSelect(card)"
      :class="{active: card.selected}"
    >
      <el-image :src="card.url" fit="contain" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import GameManager from '@/components/game/GameManager';
import TokenCard from '@/components/game/TokenCard';
import { ref, watch } from 'vue';

const { tokenCards } = defineProps(["tokenCards"])

let gameManager: GameManager;

const cards = ref([]);
watch(() => tokenCards, () => {

  cards.value = tokenCards.map(tc => {
    const obj = {
      characterKey: tc.characterKey,
      url: tc.url,
      selected: tc.selected
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

const changeGameManager = (_gameManager: GameManager) => {
  gameManager = _gameManager;
}

defineExpose({
  changeGameManager
})
</script>

<style lang="scss" scoped>
.tokens{
  padding-bottom: 40px;
  .token{
    user-select: none;
    height: 80px;
    width: 80px;
    background-color: black;
    cursor: pointer;
    &.active{
      background-color: white;
    }
  }
}
</style>