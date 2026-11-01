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
import CrisisContractMap from "./CrisisContractMap.vue";
import MapModel from "@/components/game/MapModel";
import GameManager from "@/components/game/GameManager";
import type { EnemyData } from "@/type";
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

import btnPause from '@/assets/images/btn_pause.png';
import btnPlay from '@/assets/images/btn_play.png';
import btnBase from '@/assets/images/btn_base.png';
import btnSpeed1x from '@/assets/images/btn_speed_1x.png';
import btnSpeed2x from '@/assets/images/btn_speed_2x.png';
import btnSpeed4x from '@/assets/images/btn_speed_4x.png';

import StageInfo from '@/pages/StageInfo.vue';
import Notice from "@/pages/Notice.vue"
import Global from "@/components/utilities/Global";
import { getCCBMapData } from "@/api/stages.js";

//#region 沙盘推演数据

const sandTableData = shallowRef(null);   //沙盘推演
let runesData: string[] = [];   //沙盘推演选定tag
const changeRunesData = (data) => {
  runesData = data;
  newGame(mapData)
}

//#endregion

//#region 全息作战矩阵和危机合约CCB2
const isCombatMatrix = ref(false);
let matrixRunes = []
let ccbRunes = []
const changeCombatRunes = (data) => {
  matrixRunes = data;
  newGame(mapData)
}

const changeCCBRunes = (data) => {
  ccbRunes = data;
  newGame(mapData)
}
//#endregion

//#region 游戏基础功能
let mapData = null;
let mapModel: MapModel;
let gameManager: GameManager;
const levelId = ref("");
const ccbId = ref("");      //危机合约使用的id

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
  ccbRunes = [];
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

//#region 全屏看图（手机端）
const isFs = ref(false);
//强制旋转横屏（CSS rotate）
const isRotate = ref(false);

//切换全屏UI：body.fs-map由全局样式隐藏header
const applyFsState = (on: boolean, landscapeLocked = false) => {
  isFs.value = on;
  document.body.classList.toggle("fs-map", on);
  //Android锁横屏成功→真横屏，不用旋转；
  //iOS/微信锁不了→把整个游戏区旋转90°，横着铺满屏幕
  isRotate.value = on && !landscapeLocked;
}

const leaveFullscreen = async () => {
  const doc = document as any;
  try {
    if(doc.fullscreenElement || doc.webkitFullscreenElement){
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      await exit?.call(document);
    }
  } catch(e){ /* 忽略：iOS本就没有真全屏 */ }
  try { (screen.orientation as any)?.unlock?.(); } catch(e){ /* 忽略 */ }
  applyFsState(false);
}

const toggleFullscreen = async () => {
  //以UI状态为准：iOS伪全屏下fullscreenElement恒为null，不能用它判断
  if(isFs.value){
    await leaveFullscreen();
    return;
  }
  const doc = document as any;
  //优先真全屏（Android Chrome支持，可锁横屏）；iOS Safari不支持div全屏，静默降级为纯CSS覆盖模式
  try {
    const root = doc.documentElement;
    const reqFs = root.requestFullscreen || root.webkitRequestFullscreen;
    if(reqFs){ await reqFs.call(root); }
  } catch(e){ /* 忽略 */ }
  //尝试锁定横屏（仅Android支持；iOS/微信会抛错，静默处理，失败时用CSS强制旋转横屏兜底）
  let locked = false;
  try {
    const orient = (screen.orientation as any);
    if(orient?.lock){ await orient.lock("landscape"); locked = true; }
  } catch(e){ /* 忽略 */ }
  applyFsState(true, locked);
}

//系统手势/返回键退出真全屏时同步按钮状态
const handleFsChange = () => {
  const doc = document as any;
  if(!(doc.fullscreenElement || doc.webkitFullscreenElement) && isFs.value){
    try { (screen.orientation as any)?.unlock?.(); } catch(e){ /* 忽略 */ }
    applyFsState(false);
  }
}

//#region 旋转横屏模式的滑块拖动
//CSS旋转90°后，el-slider内部用clientX相对rect计算位置会全部算错（表现为拖不动）。
//所以在旋转模式下盖一层透明热区接管拖动，按与GameManager.getEventOffset相同的
//逆变换换算成本地坐标；el-slider只负责显示进度
const hitDragging = ref(false);
const sliderHitSeek = (e: PointerEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  //本地x方向 = 屏幕y方向；布局宽 = 旋转后包围盒的高
  const localX = e.clientY - rect.top;
  const ratio = Math.max(0, Math.min(1, localX / Math.max(1, rect.height)));
  const val = Math.round(ratio * maxSecond.value);
  sliderValue.value = val;
  changeSecond(val);   //内部会缓存暂停状态、置isSliding并jump到对应时间
};
const sliderHitDown = (e: PointerEvent) => {
  e.preventDefault();
  hitDragging.value = true;
  try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch(err){ /* 忽略 */ }
  sliderHitSeek(e);
};
const sliderHitMove = (e: PointerEvent) => {
  if(!hitDragging.value) return;
  sliderHitSeek(e);
};
const sliderHitUp = () => {
  if(!hitDragging.value) return;
  hitDragging.value = false;
  endSlider();   //恢复拖动前的暂停状态
};
//#endregion
//#endregion

onMounted(() => {
  setupCanvas(wrapperRef.value);
  document.addEventListener("fullscreenchange", handleFsChange);
  document.addEventListener("webkitfullscreenchange", handleFsChange);
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFsChange);
  document.removeEventListener("webkitfullscreenchange", handleFsChange);
  //路由离开时若还在全屏，恢复页面
  if(document.body.classList.contains("fs-map")){
    leaveFullscreen();
  }
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
  ccbId.value = mapData.id;
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

  const extraRunes = isCombatMatrix.value ? matrixRunes : ccbRunes;

  mapModel = new MapModel(mapData, {
    runesData,
    matrixRunes: extraRunes,
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

  //todo 
  mapModel.runesHelper.attrChanges.forEach(attrChange => {
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

    const blackboards = attrChange.blackboards;
    blackboards.forEach(bb => {
      const name = attrColumns[bb.key];
      if(name){
        const val = bb.value;
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

const handleEnemyDatas = (_enemyDatas: EnemyData[]) => {
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
<div class="game-container" :class="{ 'is-fullscreen': isFs, 'is-rotate': isRotate }" v-loading="loading">
  <CombatMatrix
    v-show="isCombatMatrix"
    :levelId = "levelId"
    @changeCombatRunes = "changeCombatRunes"
  />
  <CrisisContractMap
    v-if="ccbId"
    :map-id="ccbId"
    @confirm="changeCCBRunes"
  />
  
  <SandTable
    v-show="sandTableData"
    :sandTableData = "sandTableData"
    @changeRunesData = "changeRunesData"
  />
  <div class="game" >
    <div class="toolbar" v-show="isStart">  
      <span class="lifepoint"> {{ finishedEnemyCount }} / {{ maxEnemyCount }}</span>
      <div class="time-slider">
        <el-slider
          v-model = "sliderValue"
          :max = "maxSecond"
          :format-tooltip = "formatTooltip"
          @input = "changeSecond"
          @change = "endSlider"
        />
        <!-- 旋转横屏模式：CSS旋转会让el-slider的clientX位置计算出错（拖不动），
             盖透明热区按逆变换接管拖动 -->
        <div
          class="slider-hit"
          v-if="isRotate"
          @pointerdown="sliderHitDown"
          @pointermove="sliderHitMove"
          @pointerup="sliderHitUp"
          @pointercancel="sliderHitUp"
        ></div>
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
      <!-- 手机端：全屏看图按钮（悬浮地图右上角；全屏后原地变「退出全屏」，
           位置见下方 .is-fullscreen/.is-rotate 规则） -->
      <div class="fs-toggle" @click="toggleFullscreen">
        <el-icon><FullScreen /></el-icon>
        <span>{{ isFs ? "退出全屏" : "全屏" }}</span>
      </div>
    </div>


  </div>
  <!-- 手机端：地图下方的详情/表格独立滚动区；PC端display:contents保持原布局 -->
  <div class="below-pane">
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

    <div class="beian">
      <img src="/beian.png" alt="">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=51011402000931" rel="noreferrer" target="_blank">川公网安备51011402000931号</a>
    </div>
  </div>
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
  height: calc(100vh - var(--header-h, 60px));
  //移动端浏览器地址栏动态伸缩，dvh更准确（不支持的浏览器回退到上一行）
  height: calc(100dvh - var(--header-h, 60px));
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
      //固定600px在手机上放不下，改为弹性宽度自适应
      flex: 1;
      max-width: 600px;
      min-width: 0;
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

//PC端：透明容器，StageInfo/DataTable等保持原来的直接排布
.below-pane{
  display: contents;
}

.beian{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
  img{
    margin-right: 2px;
    height: 18px;
  }
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

.expand{
  position: relative;
}

.expand-toggle{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.expand-toggle:hover{
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
}

// ===== 窄屏（手机）：上地图、下表格的分栏结构 =====
@media (max-width: 768px){
  //整屏固定高度：上栏地图 + 下栏详情/表格各自滚动，页面本身不再整体滚动
  .game-container{
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--header-h, 60px));
    height: calc(100dvh - var(--header-h, 60px));
    overflow: hidden;
  }

  .game{
    //上栏：常驻深色工具条 + 地图窗格
    flex: none;
    height: auto;
    background-color: #1d1e22;

    .toolbar{
      //不再悬浮在画布上，改为常驻一行（与header同色，像手机App控制条）
      position: static;
      height: 56px;
      .lifepoint{
        font-size: 14px;
        //悬浮眼睛按钮已移除（菜单入口在顶部header），左边距还原
        margin-left: 8px;
        width: auto;
      }
      .time-slider{
        margin-left: 8px;
        margin-right: 4px;
      }
    }

    .content{
      //必须去掉flex:1（basis 0会把下面显式height吃掉），高度才生效
      flex: none;
      //地图窗格：高度随屏宽计算（够地图平铺+少量留白），消灭上下大片空隙
      height: min(calc(100vw / 1.55 + 28px), 50vh);
      height: min(calc(100vw / 1.55 + 28px), 50dvh);
      background-color: #AAAAAA;
    }
  }

  //下栏：关卡详情 + 敌人表格 + 公告 + 备案号，独立滚动
  .below-pane{
    //必须取消PC端的display:contents，否则没有盒子、flex高度全部失效
    display: block;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .buttons{
    width: auto;
    margin-left: 8px;
    margin-right: 8px;

    .button{
      height: 44px;

      img{
        height: 50px !important;
      }
    }
  }

  .time-stop span{
    font-size: 10px !important;
    top: 4px;
    left: 8px;
    //宽度足够「0.2倍速」整词放一行，折行只在「开启」后断，不再切碎词
    width: 58px;
  }

  //Token卡片：右侧竖条改为地图窗格底部横排悬浮，不再挤占画布宽度
  .game .content .game-tools{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    z-index: 999;
    background-color: transparent;
  }

  .beian{
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

// ===== 全屏看图（手机端地图右上角悬浮按钮）=====
.fs-toggle{
  //PC端不显示，完全不影响桌面布局
  display: none;
}

@media (max-width: 768px){
  .fs-toggle{
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    top: 6px;
    right: 8px;
    z-index: 999;
    padding: 4px 10px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    .el-icon{
      font-size: 14px;
    }
  }
}

//全屏看图模式：地图窗格独占屏幕。
//注意这些规则不能放进媒体查询——真全屏锁横屏后视口宽度可能超过768px
.game-container.is-fullscreen{
  height: 100vh;
  height: 100dvh;
  .game{
    height: 100%;
    //工具条（时间轴/倍速/暂停/时停）保持显示，全屏下也要能操作；
    //手机端它本来就是地图上方的常驻深色条，直接复用
    .toolbar{
      //与屏幕顶部留出间距，别贴着边缘
      margin-top: 20px;
    }
    .time-slider{
      //给旋转模式的拖动热区做定位上下文
      position: relative;
    }
    .content{
      //地图窗格铺满剩余空间（覆盖媒体查询里的固定高度）
      flex: 1;
      height: auto;
    }
  }
  //隐藏下方详情/表格
  .below-pane{
    display: none;
  }
}

//旋转横屏模式下盖在el-slider上的拖动热区（仅此模式渲染，PC端不存在）
.slider-hit{
  position: absolute;
  left: 0;
  right: 0;
  //上下各扩一点，热区更好点
  top: -12px;
  bottom: -12px;
  z-index: 10;
  //阻止浏览器把滑动当成页面滚动，否则pointer事件会被取消
  touch-action: none;
  cursor: pointer;
  user-select: none;
}

//全屏时按钮固定到屏幕右上角；3个类的选择器压过媒体查询里的1个类规则，
//任何视口宽度下都显示（真全屏锁横屏后可能>768px，不能只靠媒体查询）
.game-container.is-fullscreen .fs-toggle{
  display: flex;
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 1003;
}

//旋转横屏模式：按钮在旋转容器内跟着一起转（用户看到的是正的），
//容器有transform时fixed以容器本地坐标定位——本地右上角=用户视角右上角。
//放在工具条下方（56px条+20px间距+8px），别压住「时停」按钮。
//注意必须写在.is-fullscreen规则后面，同优先级下后者覆盖前者的top
.game-container.is-rotate .fs-toggle{
  top: 84px;
  right: 8px;
}

//无法API锁横屏时（iOS/微信）的强制旋转横屏：
//竖屏持机时把整个游戏区旋转90°，布局上做成「横屏画布」，正好铺满竖屏
.game-container.is-rotate{
  position: fixed;
  top: 0;
  left: 0;
  //用视口高做布局宽、视口宽做布局高——布局上就是一块横屏画布
  //(offsetWidth/offsetHeight不含transform，画布resize会按667×375这类横屏尺寸计算)
  width: 100vh;
  width: 100dvh;
  height: 100vw;
  z-index: 1002;
  //先上移一个屏宽再顺时针转90°，正好盖满竖屏；
  //触摸坐标逆变换见GameManager.getEventOffset
  transform: rotate(90deg) translate(0, -100vw);
  transform-origin: top left;
}

</style>
