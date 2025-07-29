<template>
  <div class="tokens">
    <div 
      v-for="card in tokenCards"
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

const { tokenCards } = defineProps(["tokenCards"])

let gameManager: GameManager;

const handleSelect = (card: TokenCard) => {
  gameManager.handleSelectTokenCard(card);
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