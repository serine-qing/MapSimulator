<script lang="ts" setup>
import * as THREE from "three"
import {setupCanvas} from '@/components/game/GameCanvas.ts';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";
import { accuracyNum, timeFormat } from "@/components/utilities/utilities";
import Container from "@/pages/Container.vue"
import SVGRoute from "@/pages/SVGRoute.vue"
import GameOverMask from "@/pages/GameOverMask.vue"
import DataTable from "@/pages/DataTable.vue"
import TokenCards from "@/pages/TokenCards.vue"
import MapModel from "@/components/game/MapModel";
import GameManager from "@/components/game/GameManager";
import { computed, onMounted, ref, shallowRef, watch } from 'vue';

import btnPause from '@/assets/images/btn_pause.png';
import btnPlay from '@/assets/images/btn_play.png';
import btnSpeed1x from '@/assets/images/btn_speed_1x.png';
import btnSpeed2x from '@/assets/images/btn_speed_2x.png';
import btnSpeed4x from '@/assets/images/btn_speed_4x.png';

import Notice from "@/pages/Notice.vue"


//#region 游戏基础功能
let mapData = null;
let mapModel: MapModel;
let gameManager: GameManager;
const gameManagerRef = shallowRef();

const gameSpeed = ref();
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
}
reset();

gameSpeed.value = GameConfig.GAME_SPEED;

eventBus.on("second_change", (second: number) => {
  currentSecond.value = Math.floor(second);
  sliderValue.value = Math.floor(second / gameManager.simStep);
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
}

const changePause = () => {
  pause.value = !pause.value;
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
  mapData = map;
  
  isStart.value = true;
  isFinished.value = false;
  loading.value = true;

  mapModel = new MapModel(mapData);

  await mapModel.init();
  if(gameManager){
    gameManager.destroy();
  }

  reset();
  gameSpeed.value = GameConfig.GAME_SPEED;

  gameManager = new GameManager(mapModel);

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
const stageAttrInfo = ref("");
const characterLimit = ref(0);

//生成关卡详情
const generateStageInfo = () => {
  const {levelId, operation, cn_name, challenge: _challenge, description:_description} = mapData;
  console.log(levelId)
  title.value = `${operation} ${cn_name}`;

  challenge.value = _challenge?.replace(/<@[\s\S]*?>|<\/[\s\S]*?>|\\n/g, "");
  description.value = _description?.replace(/<@[\s\S]*?>|<\/[\s\S]*?>|\\n/g, "");
  characterLimit.value = mapData.options.characterLimit;

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
      const { enemy, enemyExclude, calMethod } = attrChange;
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

const attackRangeCheckAll = ref(false);
const attackRangeIndet = ref(false);
const countDownCheckAll = ref(true);
const countDownIndet = ref(false);
const showEnemyMenu = ref(false);

defineExpose({
  newGame
})

</script>

<template>
<div class="main" v-loading="loading">
  <Notice/>
  <div class="game">
    
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
      </div>

      <div class="checkboxs">
        <el-checkbox
          v-model="attackRangeCheckAll"
          :indeterminate="attackRangeIndet"
          @change = "attackRangeIndet = false"
        >
          显示攻击距离
        </el-checkbox>

        <el-checkbox
          v-model="countDownCheckAll"
          :indeterminate="countDownIndet"
          @change = "countDownIndet = false"
        >
          显示等待时间
        </el-checkbox>

        <el-checkbox
          v-model="showEnemyMenu"
        >
          点击敌人后显示菜单
        </el-checkbox>
      </div>
    </div>
    <div class="content">
      <div class="game-wrapper" ref="wrapperRef">
        <canvas id="c"></canvas>
        <Container 
          ref = "containerRef"
          @pause = "pause = true"
          :attackRangeCheckAll = "attackRangeCheckAll"
          :countDownCheckAll = "countDownCheckAll"
          :showEnemyMenu = "showEnemyMenu"
          @update:attackRangeIndet = "val => attackRangeIndet = val"
          @update:countDownIndet = "val => countDownIndet = val"
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

  <div class="info">
    <h2>{{ title }}</h2>
    <p class="description">{{ description }}</p>
    <p>部署上限：{{ characterLimit }}</p>
    <p v-if="challenge"><span class="challenge">突袭条件：</span>{{ challenge }}</p>
    <p v-if="stageAttrInfo"><span class="challenge">属性加成：</span>
      <span v-html="stageAttrInfo"></span>
    </p>
  </div>

  <DataTable
    :enemyDatas = "enemyDatas"
  >
  </DataTable>
</div>


</template>

<style scoped lang="scss">
.main{
  width: 100%;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
}
.game{
  display: flex;
  flex-direction: column;
  height: 100vh;
  .toolbar{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background-color: black;
    padding-top: 10px;
    .lifepoint{
      font-size: 18px;
      margin-left: 20px;
      width: 60px;
      color: white;
    }
    .time-slider{
      width: 400px;
      margin-left: 40px;
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
  width: 180px;
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
  
  .button{
    user-select: none;
    cursor: pointer;
    height: 60px;
    overflow: hidden;
    text-align: center;
    img{
      height: 74px;
    }
  }
}

.checkboxs{
  width: 160px;
  background-color: white;
  padding-left: 10px;
  ::v-deep .el-checkbox{
    height: 20px;
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

.info{
  h1,h2{
    text-align: center;
    margin: 10 0;
  }
  .description{
    text-align: center;
    font-size: 15px;
    color: #555555;
  }
  ::v-deep .bluename{
    color: #0645ad;
  }
  ::v-deep .challenge{
    color: #d22d2dcc;
    font-weight: bolder;
  }
}
</style>
