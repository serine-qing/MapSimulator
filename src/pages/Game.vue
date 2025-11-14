<script lang="ts" setup>
import * as THREE from "three"
import {setupCanvas} from '@/components/game/GameCanvas';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";
import { accuracyNum, timeFormat } from "@/components/utilities/utilities";
import Container from "@/pages/Container.vue"
import SVGRoute from "@/pages/SVGRoute.vue"
import GameOverMask from "@/pages/GameOverMask.vue"
import DataTable from "@/pages/DataTable.vue"
import TokenCards from "@/pages/TokenCards.vue"
import SandTable from "@/pages/SandTable.vue"
import CombatMatrix from "@/pages/CombatMatrix.vue"
import MapModel from "@/components/game/MapModel";
import GameManager from "@/components/game/GameManager";
import { computed, onMounted, ref, shallowRef, watch } from 'vue';

import btnPause from '@/assets/images/btn_pause.png';
import btnPlay from '@/assets/images/btn_play.png';
import btnBase from '@/assets/images/btn_base.png';
import btnSpeed1x from '@/assets/images/btn_speed_1x.png';
import btnSpeed2x from '@/assets/images/btn_speed_2x.png';
import btnSpeed4x from '@/assets/images/btn_speed_4x.png';

import StageInfo from '@/pages/StageInfo.vue';
import Notice from "@/pages/Notice.vue"
import Global from "@/components/utilities/Global";

//#region 沙盘推演数据

const sandTableData = shallowRef(null);   //沙盘推演
let runesData: string[] = [];   //沙盘推演选定tag
const changeRunesData = (data) => {
  runesData = data;
  newGame(mapData)
}

//#endregion

//#region 全息作战矩阵
const isCombatMatrix = ref(false);
let matrixRunes = []
const changeCombatRunes = (data) => {
  matrixRunes = data;
  newGame(mapData)
}
//#endregion

//#region 游戏基础功能
let mapData = null;
let mapModel: MapModel;
let gameManager: GameManager;
const levelId = ref("");

const gameManagerRef = shallowRef();

const gameSpeed = ref();
const timeStop = ref(false);
const maxSecond = ref(0);
const currentSecond = ref();
const pause = ref(false);
const cachePauseState = ref();
const loading = ref(false);
const wrapperRef = ref();
const containerRef = ref();
const tokenCardsRef = ref();
const tokenCards = shallowRef([]);
const maxEnemyCount  = ref(0);
const finishedEnemyCount = ref(0);

const isStart = ref(false);
const isFinished = ref(false);

const sliderValue = ref();
const isSliding = ref(false);

const attackRangeVisible = ref(false);

const reset = () => {
  maxSecond.value = 0;
  currentSecond.value = 0;
  pause.value = false;
  isSliding.value = false;
  sliderValue.value = 0;
  attackRangeVisible.value = false;
  maxEnemyCount.value = 0;
  finishedEnemyCount.value = 0;
  runesData = [];
  matrixRunes = [];
  sandTableData.value = null;
  timeStop.value = false;
}
reset();

gameSpeed.value = GameConfig.GAME_SPEED;

eventBus.on("second_change", (second: number) => {
  currentSecond.value = Math.floor(second);
  sliderValue.value = Math.floor( Math.min(second, maxSecond.value * gameManager.simStep) / gameManager.simStep);
})

eventBus.on("gameStart", () => {
  loading.value = false;
})
eventBus.on("setData", (data) => {
  finishedEnemyCount.value = data.finishedEnemyCount;
})
eventBus.on("update:maxSecond", (_maxSecond) => {
  maxSecond.value = _maxSecond;
})
eventBus.on("update:isFinished", (_isFinished) => {
  isFinished.value = _isFinished;
})


const formatTooltip = (val: number) => {
  return val * (gameManager?.simStep? gameManager.simStep : GameConfig.SIMULATE_STEP) + "秒";
}

const changeGameSpeed = () => {
  gameSpeed.value = gameSpeed.value === 4? 1 : gameSpeed.value * 2;
  gameManager.changeGameSpeed(gameSpeed.value);
  timeStop.value = false;
}

//更改游戏倍速
const changePause = () => {
  pause.value = !pause.value;
}

//开启/关闭时停模式（0.1倍速）
const changeTimeStop = () => {
  if(timeStop.value){
    gameSpeed.value = 1;
    gameManager.changeGameSpeed(1);
    timeStop.value = false;
  }else{
    gameSpeed.value = 1;
    gameManager.changeGameSpeed(0.2);
    timeStop.value = true;
  }
  
}

const changeSecond = (val: number) => {
  if(!isSliding.value){
    cachePauseState.value = pause.value;
  }
  isSliding.value = true;
  pause.value = true;

  eventBus.emit("jump_to_time_index", val);
}

//滚动结束
const endSlider = () => {
  isSliding.value = false;
  pause.value = cachePauseState.value;
}

const MS = computed(() => {
  return currentSecond.value + "秒";
})

const restart = () => {
  gameManager.restart();
}

onMounted(() => {
  setupCanvas(wrapperRef.value);
})

watch(pause, () => {
  gameManager?.changePause(pause.value);
})

//创建游戏
const newGame = async (map) => {
  if(gameManager){
    gameManager.destroy();
    Global.reset();
  }
  mapData = map;
  levelId.value = mapData.levelId;
  mapData.levelCode = mapData.operation.replace(/[^a-zA-Z0-9-]/g, "");

  if(
    mapData.levelId.includes("obt/recalrune")
  ){
    isCombatMatrix.value = true;
  }else{
    isCombatMatrix.value = false;
  }
  
  if(isCombatMatrix.value && matrixRunes.length === 0) return; //全息作战矩阵0tag不会开始游戏

  isStart.value = true;
  isFinished.value = false;
  loading.value = true;

  mapModel = new MapModel(mapData, {
    runesData,
    matrixRunes
  });

  gameManager = new GameManager();
  await mapModel.init();

  reset();
  
  sandTableData.value = mapData.sandTable;

  gameSpeed.value = GameConfig.GAME_SPEED;

  gameManager.init(mapModel);
  
  gameManagerRef.value = gameManager;
  maxEnemyCount.value = gameManager.waveManager.maxEnemyCount;

  tokenCards.value = gameManager.tokenCards;

  generateStageInfo();
  handleEnemyDatas(mapModel.enemyDatas);

}
//#endregion

//#region 生成关卡详情
const title = ref("");
const challenge = ref("");
const description = ref("");
const extraDescription = ref([]);
const stageAttrInfo = ref("");
const characterLimit = ref(0);
const squadNum = ref(13);

const levelCode = ref("");
const levelFullCode = ref("");   //包含磨难 险地
const levelName = ref("");
//生成关卡详情
const generateStageInfo = () => {
  //额外关卡信息
  extraDescription.value = mapModel.extraDescription;
  const {levelId, operation, name, challenge: _challenge, description:_description} = mapData;
  console.log(levelId)

  levelCode.value = mapData.levelCode;
  levelFullCode.value = operation;
  levelName.value = name;

  title.value = `${operation} ${name}`;

  challenge.value = _challenge?.replace(/<@[\s\S]*?>|<\/[\s\S]*?>|\\n/g, "");
  description.value = _description?.replace(/<@[\s\S]*?>|<\/[\s\S]*?>|\\n/g, "");
  characterLimit.value = mapModel.characterLimit;
  squadNum.value = mapModel.squadNum;

  const enemyDatas = mapModel.enemyDatas;

  const attrColumns = {
    maxHp: "生命值",
    atk: "攻击力",
    def: "防御力",
    magicResistance: "法术抗性",
    massLevel: "重量等级",
    moveSpeed: "移动速度",
    rangeRadius: "攻击范围"
  }

  const stageAttrRunes = [];

  Object.values(mapModel.runesHelper.attrChanges).forEach(attrChanges => {
    attrChanges.forEach(attrChange => {
      let { enemy, enemyExclude, calMethod } = attrChange;
      if(enemy?.length > 10){
        enemy = null;
      }
      if(enemyExclude?.length > 10){
        enemyExclude = null;
      }
      let includeEnemy;
      let excludeEnemy;
      if(enemy){
        includeEnemy = enemy.map(
          eName => "<span class='bluename'>" + enemyDatas.find(eData => eData.key === eName)?.name + "</span>" 
        )?.join("/");
      }else if(enemyExclude){
        excludeEnemy = enemyExclude.map(
          eName => "<span class='bluename'>" + enemyDatas.find(eData => eData.key === eName)?.name + "</span>" 
        )?.join("/");
      }

      const rune = {
        includeEnemy,
        excludeEnemy,
        attrChanges: [],
        calMethod
      };
      Object.keys(attrChange).forEach(key => {
        const name = attrColumns[key];
        if(name){
          const val = attrChange[key];
          rune.attrChanges.push({
            name, val
          });
        }
      })

      //有相同类型的rune就合并
      const find = stageAttrRunes.find(traverseRune => {
        return traverseRune.calMethod === rune.calMethod &&
          traverseRune.includeEnemy === rune.includeEnemy &&
          traverseRune.excludeEnemy === rune.excludeEnemy
      });

      if(find){
        
        const fAC = find.attrChanges; //原本属性
        const rAC = rune.attrChanges; //需要额外乘/加的属性

        rAC.forEach(rItem => {
          const fItem = fAC.find(i => i.name === rItem.name);
          if(fItem){

            if(find.calMethod === "add"){
              fItem.val += rItem.val;
            }else if(find.calMethod === "mul"){
              fItem.val *= rItem.val;
            }

          }else{
            find.attrChanges.push(rItem);
          }
        })
      }else{
        stageAttrRunes.push(rune);
      }

    })
  })

  let infoStr1 = "";
  let infoStr2 = "";

  stageAttrRunes.forEach(rune => {
    let enemyNamesStr = "";
    let attrChangeStr = "";

    if(rune.excludeEnemy){
      enemyNamesStr += "除" + rune.excludeEnemy + "外的敌方单位的";
    }else if(rune.includeEnemy){
      enemyNamesStr += rune.includeEnemy + "的";
    }else{
      enemyNamesStr += "敌方单位的";
    }

    rune.attrChanges.forEach(item => {
      const name = item.name;
      const isAdd = rune.calMethod === "add";
      const val = isAdd? item.val : accuracyNum(item.val * 100);
      const valStr = `<span class="challenge">${val}</span>`;
      const calMethodStr = isAdd? "提升":"提升至";
      attrChangeStr += name + calMethodStr + (isAdd? valStr + "，" : valStr + "%，");
    })
    
    if(rune.calMethod === "add"){
      infoStr1 += enemyNamesStr + attrChangeStr;
    }else if(rune.calMethod === "mul"){
      infoStr2 += enemyNamesStr + attrChangeStr;
    }
  })

  infoStr1 = infoStr1.slice(0, -1); //去个逗号
  infoStr2 = infoStr2.slice(0, -1); 

  stageAttrInfo.value = infoStr1 && infoStr2? infoStr1 + "，" + infoStr2 : infoStr1 + infoStr2;

}
//#endregion

//#region 处理敌人数据
const enemyDatas = ref([]);

const handleEnemyDatas = (_enemyDatas) => {
  const cloneEnemyDatas = [];
  _enemyDatas.forEach(enemyData => {
    const cloneEnemyData = {};
    Object.keys(enemyData).forEach(key => {
      
      if(key !== "skeletonData"){
        cloneEnemyData[key] = enemyData[key];
      }
    })

    cloneEnemyDatas.push(cloneEnemyData)
  })

  enemyDatas.value = cloneEnemyDatas;
}
//#endregion

//绑定快捷键
document.addEventListener("keydown", (event) => {
  if(event.code === "Digit1"){ 
    changeGameSpeed();
  }else if(event.code === "Digit2"){
    changePause();
  }
})

defineExpose({
  newGame
})

</script>

<template>
<div class="game-container" v-loading="loading">  
  <CombatMatrix
    v-show="isCombatMatrix"
    :levelId = "levelId"
    @changeCombatRunes = "changeCombatRunes"
  />
  <SandTable
    v-show="sandTableData"
    :sandTableData = "sandTableData"
    @changeRunesData = "changeRunesData"
  />
  <div class="game" >
    <div class="toolbar" v-show="isStart">  
      <span class="lifepoint"> {{ finishedEnemyCount }} / {{maxEnemyCount}}</span>
      <div class="time-slider">
        <el-slider 
          v-model = "sliderValue" 
          :max = "maxSecond"
          :format-tooltip = "formatTooltip"
          @input = "changeSecond"
          @change = "endSlider"
        />
      </div>

      <div class="buttons">
        <div 
          @click="changeGameSpeed()"
          class="button"
        >
          <img v-show="gameSpeed === 1" :src="btnSpeed1x">
          <img v-show="gameSpeed === 2" :src="btnSpeed2x">
          <img v-show="gameSpeed === 4" :src="btnSpeed4x">
        </div>
        <div 
          @click="changePause()"
          class="button"
        >
          <img style="height: 80px;" v-show="!pause" :src="btnPause">
          <img style="height: 80px;" v-show="pause" :src="btnPlay">
        </div>
        <div 
          @click="changeTimeStop()"
          class="button time-stop"
        >
          <img style="height: 80px;" :src="btnBase"></img>
          <span class="Speed02" style="font-size: 11px;">{{timeStop? $t('info.Disable'): $t('info.Enable')}} {{$t('info.02xSpeed')}}</span>
        </div>
      </div>

    </div>
    <div class="content">
      <div class="game-wrapper" ref="wrapperRef">
        <canvas id="c"></canvas>
        <Container 
          ref = "containerRef"
          @pause = "pause = true"
          :gameManager = "gameManagerRef"
        ></Container>

        <SVGRoute
          :gameManager = "gameManagerRef"
        ></SVGRoute>
        <GameOverMask
          v-show="isFinished"
          @restart = "restart"
        ></GameOverMask>
      </div>
      <div 
        class="game-tools"
        v-show="tokenCards.length > 0"
      >
        <TokenCards
          ref = "tokenCardsRef"
          :tokenCards = "tokenCards"
          :gameManager = "gameManagerRef"
        ></TokenCards>
      </div>
    </div>


  </div>
  <StageInfo
    :title = "title"
    :challenge="challenge"
    :character-limit="characterLimit"
    :description="description"
    :extra-description="extraDescription"
    :level-code="levelCode"
    :level-full-code="levelFullCode"
    :level-name="levelName"
    :squad-num="squadNum"
    :stage-attr-info="stageAttrInfo"
  ></StageInfo>
  <DataTable
    :enemyDatas = "enemyDatas"
  >
  </DataTable>

  <Notice/>
</div>


</template>

<style scoped lang="scss">
.game-container{
  width: 100%;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
}
.game{
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  background-color: #AAAAAA;
  position: relative;
  .toolbar{
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background-color: transparent;
    z-index: 1000;
    .lifepoint{
      font-size: 18px;
      margin-left: 20px;
      width: 80px;
      color: white;
    }
    .time-slider{
      width: 600px;
      margin-left: 20px;
    }
  }
  .content{
    flex: 1;
    position: relative;
    width: 100%;
    display: flex;
    .game-wrapper{
      flex: 1;
      position: relative;
      width: 100%;
    }
    .game-tools{
      width: 100px;
      background-color: black;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
  }

}

.buttons{
  width: 270px;
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
  
  .button{
    user-select: none;
    cursor: pointer;
    height: 60px;
    text-align: center;
    img{
      height: 74px;
    }
  }
}

canvas{
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

select {
  -moz-appearance: none;    /* Firefox */
  -webkit-appearance: none; /* Safari 和 Chrome */
  appearance: none;         /* 标准属性 */
}

.time-stop{
  position: relative;
  span{
    top: 8px;
    left: 16px;
    font-size: 15px;
    position: absolute;
    color: #fff;
    width: 60px;
  }
}

.Speed02{
  margin-top: 5px;
}

</style>
