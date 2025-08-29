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
        <span
          v-if="activeTag.points > 0"
        >
          {{ activeTag.points }}
        </span>
        <img 
          v-else-if="activeTag.runeId === 'base'"
          src="@/assets/images/recalrune/icon_rune_essential_fixed.png"
        >
        <img 
          v-else
          src="@/assets/images/recalrune/icon_rune_essential_exclusive.png"
        >
      </div>

      <div class="text">
        <p v-for="text in activeTag.description" v-html="text"></p>
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
  scroll-margin-bottom: 10px;
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
@keyframes flashShadow {
  0% {
      box-shadow: 
          0 -5px 10px -5px rgba(255, 255, 255, 0.1),
          0 5px 10px -5px rgba(255, 255, 255, 0.1);
  }

  50% {
      box-shadow: 
          0 -5px 10px -5px rgba(255, 255, 255, 1),
          0 5px 10px -5px rgba(255, 255, 255, 1);
  }

  100% {
      box-shadow: 
          0 -5px 10px -5px rgba(255, 255, 255, 0.1),
          0 5px 10px -5px rgba(255, 255, 255, 0.1);
  }
}
.tagdesc-white-shadow {
  box-shadow: 
    0 -5px 10px -5px rgba(255, 255, 255, 0.8),
    0 5px 10px -5px rgba(255, 255, 255, 0.8);
    transition: transform 0.3s ease;
    animation: flashShadow 1.6s ease;
    animation-iteration-count: 2;
}


</style>