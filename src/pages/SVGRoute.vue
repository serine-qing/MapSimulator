<template>
  <div class="svg-container">
    <svg ref="svg" class="svg" id="active-route">
      <path :d="paths.join()" fill="none" stroke="#d42a2a" stroke-opacity="0.7" stroke-width="3" data-ignore="true"/>

      <path
        class="path"
        v-for="path in paths"
        :d="path" fill="none" stroke="#efbcc3" stroke-opacity="1" stroke-width="2" 
      />

      <circle
        v-for="circle in circles"
        :cx="circle.x" :cy="circle.y" r="3" fill="#d42a2a"
      />
    </svg>

    <div
      v-for="countdown in countdowns"
      :style="{left: countdown.x  + 'px', top: countdown.y  + 'px', transform: `scale(${labelScale})`}"
      class="countdown"
      :class="{
        'big': countdown.time >= 1000,
        'middle': countdown.time >= 100 && countdown.time < 1000,
        'small': countdown.time < 100,
      }"
    >{{countdown.time}}</div>
  </div>
</template>

<script lang="ts" setup>
import { gameCanvas } from '@/components/game/GameCanvas';
import eventBus from '@/components/utilities/EventBus';
import GameConfig from '@/components/utilities/GameConfig';
import { ref, shallowRef, watch } from 'vue';
const { gameManager } = defineProps(["gameManager", "showEnemyMenu"]);
const nodes = shallowRef([]);
const paths = ref([]);
const circles = ref([]);
const countdowns = ref([]);
const svg = ref();

//#region 路线动画              
let snakes;
let snake;
let snakeIndex;

const segmentLength = 40; // 可见部分长度 
const speed = 8;

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
  let circleNodes: any[] = [];
  let countdownNodes: any[] = [];

  let currentNode;
  let i = 0;
  let pathIndex = 0;
  let currentPos;
  let x, y;

  while(i < nodes.length){
    currentNode = nodes[i++];
    const { type, position, time } = currentNode;

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
        circleNodes.push({x, y});
        break;
      case "move":
        pathStrs[pathIndex] += `L ${x} ${y} `;
        break;
      case "checkpoint":
        pathStrs[pathIndex] += `L ${x} ${y} `;
        circleNodes.push({x, y});
        break;
      case "appear":
        pathIndex++;
        pathStrs[pathIndex] = `M ${x} ${y} `;
        break;
      case "wait":
        countdownNodes.push({ x, y, time })
        break;
    }

  }

  circles.value = circleNodes;
  paths.value = pathStrs;
  countdowns.value = countdownNodes;
}
//#endregion

watch(nodes, () => {
  createSVGRoute(nodes.value);
  if(nodes.value.length > 0){
    requestAnimationFrame(() => {
      initSnakes();
      nextSnake();
    })
  }

})

watch(() => gameManager, () => {
  nodes.value = [];
})

eventBus.on("changeSVGRoute", (_nodes) => {
  nodes.value =_nodes;
});


const labelScale = ref(0);
eventBus.on("resize", () =>  {
  labelScale.value = gameCanvas.canvas.clientHeight / GameConfig.OBJECT_SCALE;
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

.countdown{
  user-select: none;
  position: absolute;
  text-align: center;
  line-height: 20px;
  height: 20px;
  width: 20px;
  background-color: #d42a2a;
  color: white;
  border-radius: 20px;
  border: 1px solid black;
  margin-left: -11px;
  margin-top: -11px;
  &.big{
    height: 23px;
    width: 23px;
    line-height: 23px;
    font-size: 10px;
  }
  &.middle{
    font-size: 11px;
  }
  &.small{
    font-size: 13px;
  }
}

</style>