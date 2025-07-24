<template>
  <div class="container">
    <el-popover
      v-for = "(label, index) in enemyLabels"
      :key = "index"
      placement="top"
      :title="enemies[index].name"
      :width="200"
      trigger="click"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <div 
          :style = "label.style"
          v-show="label.visible"
          class="label"
          @click="handleLabelClick(index)"
        >
          <div  
            class="countdown"
            v-if="!label.unMoveable"
            v-show="label.options.countDownVisible && label.countDown > -1"
            :style="{
              fontSize: label.countDown >= 100? '10px' : '14px'
            }"
            
          >{{ label.countDown > -1 ? label.countDown : "" }}
          </div>

          <div  
            class="countdown end-countdown"
            v-show="label.options.countDownVisible && label.endCountDown > -1"
            :style="{
              fontSize: label.endCountDown >= 100? '10px' : '14px'
            }"
            
          >{{ label.endCountDown > -1 ? label.endCountDown : "" }}
          </div>

        </div>
      </template>

      <div>
        <span class="enemy-key">{{ label.key }}</span>
        <el-checkbox 
          :disabled="!enemies[index].isRanged()" 
          v-model="label.options.attackRangeVisible" label="显示攻击范围" 
          @change = "handleAttackRangeCheck"
        />
        <el-checkbox 
          v-model="label.options.countDownVisible" label="显示等待时间"
          @change = "handleCountDownCheck"
        />
      </div>
    </el-popover>
    
  </div>
</template>

<script lang="ts" setup>
import GameManager from '@/components/game/GameManager';
import EnemyManager from '@/components/enemy/EnemyManager';
import { gameCanvas } from '@/components/game/GameCanvas';
import * as THREE from "three";
import Enemy from '@/components/enemy/Enemy';
import { ref, defineEmits, defineProps, watch } from 'vue';
import GameConfig from '@/components/utilities/GameConfig';

const emit = defineEmits(["pause","update:attackRangeIndet","update:countDownIndet"]);
const enemyLabels = ref([]);

let enemyManager: EnemyManager;
let enemies: Enemy[];

//FUNCTION                                           
//FUNCTION                                           
//FUNCTION  敌人label数据绑定                         
//FUNCTION                                           
//FUNCTION                                           

const updateLabelVisible = () => {
  enemies.forEach(enemy => {
    const label = enemyLabels.value[enemy.id];
    label.visible = enemy.visible();
  });
}

const updateLabelPosAndSize = () => {

  const scale =  gameCanvas.canvas.clientHeight / GameConfig.TILE_SIZE * 0.012;
  
  enemyManager.getEnemiesInMap().forEach(enemy => {
    if(!enemy.spine) return;
    const {skelSize, skelOffset} = enemy;
    
    const height = skelSize.y * 5.5;
    const width = skelSize.x * 5.5;

    const tempV = new THREE.Vector3();
    enemy.skeletonMesh.getWorldPosition(tempV);
    tempV.project(gameCanvas.camera);
    const x = (tempV.x *  .5 + .5) * gameCanvas.canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * gameCanvas.canvas.clientHeight;

    const label = enemyLabels.value[enemy.id];

    label.style = {
      height: height + 'px',
      width: width + 'px',
      left: x - width / 2 + 'px', 
      top: y - height / 2 + scale * skelOffset.y + 'px',
      transform: `scale(${scale})`
    }

  })
}

const updateDatas = () => {
  enemyManager.getEnemiesInMap().forEach(enemy => {
    if(!enemy.spine) return;
    const label = enemyLabels.value[enemy.id];
    const unMoveable = enemy.unMoveable;
    const countDown = enemy.getCountDown("checkPoint");
    const endCountDown = enemy.getCountDown("end");
    
    label.unMoveable = unMoveable;
    if(countDown > 0){
      label.countDown = Math.floor(countDown);
    }else{
      label.countDown = -1;
    }
    
    if(endCountDown > 0){
      label.endCountDown = Math.floor(endCountDown);
    }else{
      label.endCountDown = -1;
    }
  })
}

const update = () => {
  updateLabelVisible();
  updateLabelPosAndSize();
  updateDatas()
}

const initEnemyLabels = () => {
  enemies.forEach(enemy => {
    enemyLabels.value.push({
      key: enemy.key,
      name: enemy.name,
      options: enemy.options,
      style: {}
    });
    
  })
}

const animate = () => {
  requestAnimationFrame(()=>{
    if(enemyManager){
      update();
    }
    animate();
  });
}

animate();

const changeGameManager = (gameManager: GameManager) => {
  if(gameManager){
    enemyManager = gameManager.enemyManager;
    enemies = enemyManager.flatEnemies;

    initEnemyLabels();
  }else{
    enemyManager = null;
    enemies = [];
    enemyLabels.value = [];
  }

}

//FUNCTION                                           
//FUNCTION                                           
//FUNCTION  与复选框的交互                            
//FUNCTION                                           
//FUNCTION                                           

const {attackRangeCheckAll, countDownCheckAll} = defineProps(["attackRangeCheckAll", "countDownCheckAll"])

const handleLabelClick = (index) => {
  emit('pause');
}

//全选显示攻击范围
watch(() => attackRangeCheckAll, () => {
  enemyLabels.value.forEach((label, index) => {
    const enemy = enemies[index];

    if(enemy.isRanged()){
      label.options.attackRangeVisible = attackRangeCheckAll;
    }
    
  })
})

const handleAttackRangeCheck = () => {
  const labels = [];
  enemyLabels.value.forEach((label, index) => {
    const enemy = enemies[index];

    if(enemy.isRanged()){
      labels.push(label);
    }
    
  })

  let count = 0;
  labels.forEach(label => {
    if(label.options.attackRangeVisible){
      count++;
    }
  })

  const isIndeterminate = count > 0 && count < labels.length;
  emit("update:attackRangeIndet",isIndeterminate);
}

//全选显示等待时间
watch(() => countDownCheckAll, () => {
  enemyLabels.value.forEach(label => {

    label.options.countDownVisible = countDownCheckAll;
    
  })
})

const handleCountDownCheck = () => {

  let count = 0;
  enemyLabels.value.forEach(label => {
    if(label.options.countDownVisible){
      count++;
    }
  })

  const isIndeterminate = count > 0 && count < enemyLabels.value.length;
  emit("update:countDownIndet",isIndeterminate);
}

// defineExpose 来显式指定在组件中要暴露出去的属性。
defineExpose({
  changeGameManager
})

</script>

<style scoped lang="scss">
.container{
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.label{
  display: flex;
  user-select: none;
  font-size: 14px;
  position: absolute;
  //background-color: aqua;
  color: white;
  cursor: pointer;
  transform-origin: center center;
  text-align: center;
  justify-content: center;
  align-items: flex-end;
  .countdown{
    text-align: center;
    line-height: 17px;
    height: 18px;
    width: 18px;
    background-color: white;
    color: black;
    border-radius: 13px;
    border: 1px solid black;
    margin-left: 2px;
    margin-right: 2px;
  }
  .end-countdown{
    background-color: red;
    color: white;

  }
}

.enemy-key{
  display: block;
  font-size: 12px;
  margin-bottom: 7px;
}
</style>