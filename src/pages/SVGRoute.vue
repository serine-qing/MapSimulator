<template>
  <div class="svg-container">
    <svg ref="svg" class="svg" id="active-route">
      <path :d="paths.join()" fill="none" stroke="#d42a2a" stroke-opacity="0.7" stroke-width="3" data-ignore="true"/>

      <path
        class="path"
        v-for="path in paths"
        :d="path" fill="none" stroke="#efbcc3" stroke-opacity="1" stroke-width="2" 
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { gameCanvas } from '@/components/game/GameCanvas';
import eventBus from '@/components/utilities/EventBus';
import { onMounted, ref, shallowRef, watch } from 'vue';
const { gameManager } = defineProps(["gameManager"]);
const nodes = shallowRef([]);
const paths = ref([]);
const svg = ref();

//#region 路线动画              
let snakes;
let snake;
let snakeIndex;

const segmentLength = 40; // 可见部分长度 
const speed = 6;

let pathLength;
let offset;
let count = 0;
let maxCount = 0;

const initSnakes = () => {
  snakes = document.querySelectorAll<SVGPathElement>('.path');
  snakes.forEach(snake => {
    snake.style.strokeDasharray = `${segmentLength} ${snake.getTotalLength()}`;
    snake.style.strokeDashoffset = segmentLength.toString();
  })

  offset = segmentLength;
  snakeIndex = -1;
}

const nextSnake = () => {
  count = 0;
  snakeIndex = (snakeIndex + 1) % snakes.length;
  snake = snakes[snakeIndex];
  pathLength = snake.getTotalLength();
  maxCount = Math.floor((pathLength + segmentLength) / speed);
  snake.style.strokeDasharray = `${segmentLength} ${pathLength}`;
  snake.style.strokeDashoffset = segmentLength.toString();
}


const animate = () => {
  if(snakes && snakes.length > 0){
    offset = (offset - speed) % (pathLength + segmentLength);
    if(++count >= maxCount){
      offset = segmentLength;
      snake.style.strokeDashoffset = offset.toString();
      nextSnake();
    }
    snake.style.strokeDashoffset = offset.toString();
  }
  requestAnimationFrame(animate);
}

animate();
    
const createSVGRoute = (nodes) => {
  let pathStrs: string[] = [];
  let currentNode;
  let i = 0;
  let pathIndex = 0;
  while(i < nodes.length){
    currentNode = nodes[i++];
    const { type, position } = currentNode;
    let currentPos;
    let x, y;
    if(position){
      currentPos = gameManager.gameView.localToWorld(
        gameManager.getCoordinate(position)
      );
      x = currentPos.x;
      y = currentPos.y;
    }

    switch (type) {
      case "start":
        pathStrs[pathIndex] = `M ${x} ${y} `;
        break;
      case "move":
        pathStrs[pathIndex] += `L ${x} ${y} `;
        break;
      case "appear":
        pathIndex++;
        pathStrs[pathIndex] = `M ${x} ${y} `;
        break;
    }

  }

  paths.value = pathStrs;
  
}
//#endregion

let SVGWidth;
let SVGHeight;

watch(nodes, () => {
  createSVGRoute(nodes.value);
  SVGWidth = gameCanvas.wrapper.offsetWidth;
  SVGHeight = gameCanvas.wrapper.offsetHeight;
  requestAnimationFrame(() => {
    initSnakes();
    nextSnake();
  })
})

eventBus.on("changeSVGRoute", (_nodes) => {
  nodes.value =_nodes;
});

eventBus.on("resize", () =>  {
  console.log(333);
  createSVGRoute(nodes.value)
});

</script>

<style lang="scss" scoped>
.svg-container{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.svg{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}


</style>