<template>
  <div class="container">
    <div 
      v-for = "(label, index) in enemyLabels"
      :key = "index"
      :style = "label.style"
      class="label"
    >{{ label.waitingTime > -1 ? label.waitingTime : "" }}</div>
  </div>
</template>

<script lang="ts" setup>
import GameManager from '@/components/game/GameManager';
import EnemyManager from '@/components/enemy/EnemyManager';
import { gameCanvas } from '@/components/game/GameCanvas';
import * as THREE from "three";
import Enemy from '@/components/enemy/Enemy';
import { ref } from 'vue';
import GameConfig from '@/components/utilities/GameConfig';

const enemyLabels = ref([]);

let enemyManager: EnemyManager;
let enemies: Enemy[];

const updateLabelPosAndSize = () => {
  const scale =  gameCanvas.canvas.clientHeight / GameConfig.TILE_SIZE * 0.016;
  enemyManager.getEnemiesInMap().forEach(enemy => {
    const tempV = new THREE.Vector3();
    enemy.spine.getWorldPosition(tempV);
    tempV.project(gameCanvas.camera);
    const x = (tempV.x *  .5 + .5) * gameCanvas.canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * gameCanvas.canvas.clientHeight;

    const label = enemyLabels.value[enemy.id];

    label.style = {
      left: x - 10 + 'px',
      top: y - 20 + 'px',
      transform: `scale(${scale})`,
      display: enemy.visible ? "block" : "none",
    }

  })
}

const updateDatas = () => {
  enemyManager.getEnemiesInMap().forEach(enemy => {
    const label = enemyLabels.value[enemy.id];
    const waitingTime = enemy.waitingTime();

    if(waitingTime > 0){
      label.waitingTime = Math.floor(waitingTime);
    }else{
      label.waitingTime = -1;
    }
    
  })
}


const update = () => {
  updateLabelPosAndSize();
  updateDatas()
}

const initEnemyLabels = () => {
  enemies.forEach(enemy => {
    enemyLabels.value.push({
      name: enemy.name,
      style: {}
    });
    
  })
}

const changeGameManager = (gameManager: GameManager) => {
  // enemyManager = gameManager.enemyManager;
  // enemies = enemyManager.flatEnemies;
  // gameManager.addUpdateCallback(update);
  // initEnemyLabels();
}

// defineExpose 来显式指定在组件中要暴露出去的属性。
defineExpose({
  changeGameManager
})

window.addEventListener('resize', updateLabelPosAndSize);

</script>

<style scoped lang="scss">
.container{
  height: 100%;
  position: relative;
}

.label{
  user-select: none;
  font-size: 12px;
  height: 20px;
  width: 20px;
  position: absolute;
  // background-color: aqua;
  color: white;
  cursor: pointer;
  display: none;
  transform-origin: center center;
  text-align: center;
  left: -10px;
  top: -10px;

}
</style>