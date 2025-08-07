<template>
  <div class="svg-route">
    <svg id="svg"></svg>
  </div>
</template>

<script lang="ts" setup>
import eventBus from '@/components/utilities/EventBus';
const { gameManager } = defineProps(["gameManager"])

const createSVGRoute = (nodes) => {
  console.log(nodes)
  let prevNode;
  let currentNode;
  let i = 0;
  while(currentNode = nodes[i++]){
    if(prevNode){
      
      
    }
    console.log(gameManager.gameView.localToWorld(
      gameManager.getCoordinate(currentNode.position)
    ))
    prevNode = currentNode;
  }
}

eventBus.on("changeSVGRoute", (nodes) => {
  createSVGRoute(nodes);
});


</script>

<style lang="scss" scoped>
.svg-route{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

#svg{
  height: 100%;
  width: 100%;
}

</style>