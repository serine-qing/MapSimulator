<template>
  <template
    v-for="activeTag in activeTags"
  >
    <div 
      v-if="activeTag.essential === essential"
      :id="activeTag.runeId"
      class="content"
    >
      <div 
        class="icon"
      >
        <img 
          v-if="activeTag.runeId === 'base'"
          src="@/assets/images/recalrune/icon_rune_essential_fixed.png"
        >
        <img 
          v-else
          src="@/assets/images/recalrune/icon_rune_essential_exclusive.png"
        >
      </div>

      <div class="text">
        <p v-for="text in activeTag.description">{{ text }}</p>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
const { activeTags, essential } = defineProps(["activeTags", "essential"])


</script>

<style lang="scss" scoped>
.content{
  margin-top: 20px;
  display: flex;
  .icon{
    margin-top: 3px;
    height: 24px;
    line-height: 24px;
    width: 50px;
    background-color: #eaecec;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 18px;
    }
  }
  .text{
    flex: 1;
    color: #ffffff;
    p{
      margin: 0 6px;
    }
  }
  }
</style>