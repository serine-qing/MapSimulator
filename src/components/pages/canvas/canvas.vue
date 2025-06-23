<script>
import Game from '@/components/game/GameManager.ts';

export default {
  mounted() {
    new Game(this.$refs.c)
  }
}

</script>

<template>
<div> 
  <canvas ref="c"></canvas>
</div>
</template>

<style scoped>
canvas{
  display: block;
  position: fixed;
}
</style>
