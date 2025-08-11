<template>
  <div 
    class="container"
    @click="handleContainerClick"
  >
    <el-popover
      v-for = "(label, index) in enemyLabels"
      :disabled= "!showEnemyMenu"
      :key = "index"
      placement="top"
      :title="label.name + '#' + (label.id + 1)"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <div 
          :style = "label.style"
          v-show="label.visible"
          class="label"
          @click.stop="handleLabelClick(label)"
        >
          <div  
            class="countdown"
            v-if="!label.unMoveable"
            v-show="label.options.CountDownVisible && label.countDown > -1"
            :class="{
              'big': label.countDown >= 1000,
              'middle': label.countDown >= 100 && label.countDown < 1000,
              'small': label.countDown < 100,
            }"
            
          >{{ label.countDown > -1 ? label.countDown : "" }}
          </div>

          <div  
            class="countdown end-countdown"
            v-show="label.options.CountDownVisible && label.endCountDown > -1"
            :class="{
              'big': label.endCountDown >= 1000,
              'middle': label.endCountDown >= 100 && label.endCountDown < 1000,
              'small': label.endCountDown < 100,
            }"
            
          >{{ label.endCountDown > -1 ? label.endCountDown : "" }}
          </div>

        </div>
      </template>

      <div>
        <span class="enemy-key">{{ label.key }}</span>
        <span class="enemy-key">{{ `当前检查点：${label.currentCheckPoint + 1} / ${label.checkPointLength}` }}</span>
        <el-button @click="showDetail(label.id)">查看详情</el-button>
        <el-checkbox 
          :disabled="!enemies[index].isRanged()" 
          v-model="label.options.AttackRangeVisible" label="显示攻击范围" 
          @change = "handleAttackRangeCheck"
        />
        <el-checkbox 
          v-model="label.options.CountDownVisible" label="显示等待时间"
          @change = "handleCountDownCheck"
        />
      </div>
    </el-popover>
    
    <el-popover
      v-for = "(label, index) in trapLabels"
      :disabled= "!showEnemyMenu"
      :key = "index"
      placement="top"
      :title="'装置id:' + label.alias"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <div 
          :style = "label.style"
          v-show="label.visible"
          class="label trap-label"
          @click.stop="pauseGame()"
        >
          <div  
            class="countdown"
            v-show="label.options.CountDownVisible && label.countDown > -1"
            :class="{
              'big': label.countDown >= 1000,
              'middle': label.countDown >= 100 && label.countDown < 1000,
              'small': label.countDown < 100,
            }"
            
          >{{ label.countDown > -1 ? label.countDown : "" }}
          </div>

        </div>
      </template>

      <div>
        <el-checkbox 
          v-model="label.options.CountDownVisible" label="显示倒计时"
          @change = "handleCountDownCheck"
        />
      </div>
    </el-popover>

    <div 
      class="trap-dialog"
      v-show="trapDialog.visible"
      :style="{
        left:trapDialog.left + 'px',
        top:trapDialog.top + 'px',
        transform: `scale(${trapDialog.scale})`
      }"
    >
      <img class="exit" :src="exitImg" @click="handleRemoveTrap"></img>
      <div class="border"></div>
      <img class="icon" :src="trapDialog.iconUrl">
    </div>
  </div>
</template>

<script lang="ts" setup>
import GameManager from '@/components/game/GameManager';
import WaveManager from '@/components/enemy/WaveManager';
import { gameCanvas } from '@/components/game/GameCanvas';
import * as THREE from "three";
import Enemy from '@/components/enemy/Enemy';
import { ref, defineEmits, defineProps, watch } from 'vue';
import GameConfig from '@/components/utilities/GameConfig';
import exitImg from '@/assets/images/escape.png'
import Trap from '@/components/game/Trap';
import TrapManager from '@/components/game/TrapManager';
import eventBus from '@/components/utilities/EventBus';
import GameView from '@/components/game/GameView';

const { gameManager, attackRangeCheckAll, countDownCheckAll, showEnemyMenu } = defineProps(
  ["gameManager","attackRangeCheckAll", "countDownCheckAll", "showEnemyMenu"]
);

const emit = defineEmits(["pause","update:attackRangeIndet","update:countDownIndet"]);
const enemyLabels = ref([]);

let waveManager: WaveManager;
let trapManager: TrapManager;
let gameView: GameView;
let enemies: Enemy[];
let scale: number;
let canvasHeight: number;
let canvasWidth: number;

//#region  敌人label数据绑定                         
const initEnemyLabels = () => {
  enemies.forEach(enemy => {
    enemyLabels.value.push({
      id: enemy.id,
      key: enemy.key,
      name: enemy.name,
      checkPointLength: enemy.checkpoints.length,
      options: enemy.options,
      style: {}
    });
    
  })
}


const updateEnemyVisible = () => {
  enemies.forEach(enemy => {
    const label = enemyLabels.value[enemy.id];
    label.visible = enemy.visible();
  });
}

const updateEnemyPosAndSize = () => {

  scale =  canvasHeight / GameConfig.OBJECT_SCALE;

  waveManager.enemiesInMap.forEach(enemy => {
    if(!enemy.object) return;
    const {meshSize, meshOffset} = enemy;
    
    const height = meshSize.y * (enemy['fbxMesh']? 1 : 5.5);
    const width = meshSize.x * (enemy['fbxMesh']? 1 : 5.5);

    const {x, y} = gameView.localToWorld(enemy.object.position);

    const label = enemyLabels.value[enemy.id];

    label.style = {
      height: height + 'px',
      width: width + 'px',
      left: x - width / 2 + 'px', 
      top: y - height / 2 + scale * meshOffset.y + 'px',
      transform: `scale(${scale})`
    }

  })
}

const updateEnemyDatas = () => {
  waveManager.enemiesInMap.forEach(enemy => {
    if(!enemy.object) return;
    const label = enemyLabels.value[enemy.id];
    label.currentCheckPoint = enemy.checkPointIndex;

    const unMoveable = enemy.unMoveable;
    const countDown = enemy.countdown.getCountdownTime("checkPoint");
    const endCountDown = enemy.countdown.getCountdownTime("end");

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

//#endregion


//#region  与弹出框的交互                            

const handleLabelClick = (label) => {
  enemies.forEach(enemy => {
    enemy.options.RoutesVisible = false;
  })
  const find = enemies.find(enemy => enemy.id === label.id);
  find.options.RoutesVisible = true;
  pauseGame();
}

const pauseGame = () => {
  if(showEnemyMenu){
    emit('pause');
  }
}

//全选显示攻击范围
watch(() => attackRangeCheckAll, () => {
  enemyLabels.value.forEach((label, index) => {
    const enemy = enemies[index];

    if(enemy.isRanged()){
      label.options.AttackRangeVisible = attackRangeCheckAll;
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
    if(label.options.AttackRangeVisible){
      count++;
    }
  })

  const isIndeterminate = count > 0 && count < labels.length;
  emit("update:attackRangeIndet",isIndeterminate);
}


const handleCountDownCheck = () => {

  let count = 0;
  const labels = [...enemyLabels.value, ...trapLabels.value];
  labels.forEach(label => {
    if(label.options.CountDownVisible){
      count++;
    }
  })

  const isIndeterminate = count > 0 && count < labels.length;
  emit("update:countDownIndet", isIndeterminate);
}

const showDetail = (enemyId: number) => {
  const find = enemies.find(enemy => enemy.id === enemyId);
  eventBus.emit("showDetail", find.enemyData);
  console.log(find)
}

//全选显示等待时间
watch(() => countDownCheckAll, () => {
  enemyLabels.value.forEach(label => {

    label.options.CountDownVisible = countDownCheckAll;
    
  })

  trapLabels.value.forEach(label => {

    label.options.CountDownVisible = countDownCheckAll;
    
  })
})

//#endregion


//#region  与地图装置的交互                          
let activeTrap: Trap;
const trapDialog = ref({
  left: 0,
  top: 0,
  iconUrl: "",
  scale: 0,
  visible: false
});

const updateTrapSelected = () => {
  const find = trapManager.getSelected();

  if(find){
    activeTrap = find;

    const {x, y} = gameView.localToWorld(find.object.position);

    trapDialog.value.left = x -50;
    trapDialog.value.top = y -50;
    trapDialog.value.iconUrl = find.iconUrl;
    trapDialog.value.scale = 2 * scale;
    trapDialog.value.visible = true;
  }else{
    trapDialog.value.visible = false;
  }

}

const handleRemoveTrap = () => {
  gameManager.handleRemoveTrap(activeTrap);
}

//#endregion


//#region  装置label绑定                            
let traps: Trap[] = [];
const trapLabels = ref([]);

const initTrapLabels = () => {
  traps = [...trapManager.traps];
  traps.forEach((trap, index) => {
    trapLabels.value.push({
      alias: trap.alias,
      key: trap.key,
      options: trap.options,
      style: {}
    });
    trap.labelVue = trapLabels.value[index];
  })
}

const updateTrapSize = () => {
  const scale = canvasHeight / GameConfig.OBJECT_SCALE;
  traps.forEach(trap => {

    const {x, y} = gameView.localToWorld(trap.object.position);

    const label = trap.labelVue;
    
    const trapHeight = gameManager.getPixelSize(GameConfig.TILE_SIZE);
    const trapWidth = trapHeight;

    label.style = {
      height: trapHeight + 'px',
      width: trapWidth + 'px',
      left: x - trapWidth / 2 + 'px', 
      top: y - trapHeight / 2 + 'px',
      transform: `scale(${scale})`
    }

  })
}

const updateTrapVisible = () => {
  traps.forEach(trap => {
    const label = trap.labelVue;
    label.visible = trap.visible;
  });
}

const updateTrapDatas = () => {
  traps.forEach(trap => {
    if(!trap.visible) return;

    const label = trap.labelVue;

    const countDown = trap.countdown.getCountdownTime("waiting");

    if(countDown > 0){
      label.countDown = Math.floor(countDown);
    }else{
      label.countDown = -1;
    }


  })
}
//#endregion


//点击地图其他地方
const handleContainerClick = () => {
  enemies.forEach(enemy => {
    enemy.options.RoutesVisible = false;
  })
}

const update = () => {
  canvasHeight = gameCanvas.canvas.clientHeight;
  canvasWidth = gameCanvas.canvas.clientWidth;

  updateEnemyVisible();
  updateEnemyPosAndSize();
  updateEnemyDatas();
  updateTrapSelected();

  updateTrapVisible();
  updateTrapDatas();
  updateTrapSize();
  
}

const animate = () => {
  requestAnimationFrame(()=>{
    if(waveManager){
      update();
    }
    animate();
  });
}

animate();

const changeGameManager = () => {
  enemies = [];
  traps = [];
  enemyLabels.value = [];
  trapLabels.value = [];

  gameView = gameManager.gameView;
  waveManager = gameManager.waveManager;
  trapManager = gameManager.trapManager;
  enemies = waveManager.enemies;

  initEnemyLabels();
  initTrapLabels();
}

watch(() => gameManager, () => {
  changeGameManager();
})


</script>

<style scoped lang="scss">
.container{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 600;
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
  z-index: 1000;
  .countdown{
    position: absolute;
    text-align: center;
    line-height: 20px;
    height: 20px;
    width: 20px;
    background-color: white;
    color: black;
    border-radius: 22px;
    border: 1px solid black;
    margin-left: 2px;
    margin-right: 2px;
    margin-bottom: 5px;
  }
  .end-countdown{
    background-color: red;
    color: white;
  }
  .big{
    height: 23px;
    width: 23px;
    line-height: 23px;
    font-size: 10px;
  }
  .middle{
    font-size: 11px;
  }
  .small{
    font-size: 13px;
  }

  &.trap-label{
    z-index: 500;
    .countdown{
      margin-bottom: 13px;
      background-color: #1f4c9f;
      color:white;
    }
  }
}

.enemy-key{
  display: block;
  font-size: 12px;
  margin-bottom: 7px;
}

.trap-dialog{
  user-select: none;
  position: absolute;
  height: 100px;
  width: 100px;
  
  .border{
    position: absolute;
    left: -10px;
    top: -15px;
    height: 120px;
    width: 120px;
    border: 2px solid #fefefe;
    order: 2px solid #fefefe;
    transform:rotateX(45deg)  rotateZ(45deg);
    box-shadow: inset 0 0 16px hsla(0 , 0%, 94%, 0.9);
  }
  .exit{
    cursor: pointer;
    position: absolute;
    left: -5px;
    top: 0px;
    height: 30px;
    width: 30px;
    z-index: 1000;
    transform:rotateX(25deg);
  }
  .icon{
    position: absolute;
    left: 75px;
    top: 60px;
    height: 40px;
    width: 40px;
    z-index: 1000;
    transform:rotateX(25deg);
  }
}
</style>