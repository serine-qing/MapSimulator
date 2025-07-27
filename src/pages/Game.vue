<script lang="ts">
import Game from "@/components/game/Game"
import {setupCanvas} from '@/components/game/GameCanvas.ts';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";
import { accuracyNum, timeFormat } from "@/components/utilities/utilities";
import Container from "@/pages/Container.vue"
import GameOverMask from "@/pages/GameOverMask.vue"
import DataTable from "@/pages/DataTable.vue"
import MapModel from "@/components/game/MapModel";
import GameManager from "@/components/game/GameManager";

let mapModel: MapModel;
let game: Game = new Game();
let gameManager: GameManager;

export default{
  data(){
    return{
      gameSpeed: Number,
      maxSecond: Number,
      sliderValue: Number,   //时间滑块的数值
      currentSecond: Number, //当前时间(秒)
      pause: false,
      attackRangeVisible: false, //远程敌人攻击范围是否可见
      cachePauseState: Boolean,
      isSliding: false,
      loading: false,

      title: "",
      challenge: "",
      description: "",
      stageAttrInfo: "",   //属性加成信息   

      attackRangeCheckAll: false,
      attackRangeIndet: false,

      countDownCheckAll: true,
      countDownIndet: false,
      enemyDatas: null,

      isFinished: false
    }
  },
  props:["mapData"],
  components:{ Container, DataTable, GameOverMask},
  watch:{
    async mapData(){
      this.isFinished = false;
      this.$refs["container"].changeGameManager(null);
      this.loading = true;

      mapModel = new MapModel(this.mapData);

      await mapModel.init();
      await game.startGame(mapModel);

      gameManager = game.gameManager;

      this.generateStageInfo();
      this.handleEnemyDatas(mapModel.enemyDatas);
      this.reset();
      this.gameSpeed = GameConfig.GAME_SPEED;
      this.maxSecond = game.maxSecond;
      this.$refs["container"].changeGameManager(gameManager);

    },
    pause(){
      gameManager?.changePause(this.pause);
    }
  },
  created(){
    this.reset();
    this.gameSpeed = GameConfig.GAME_SPEED;
    eventBus.on("second_change", this.handleSecondChange)
    eventBus.on("gameStart", () => {
      this.loading = false;
    })
    eventBus.on("update:isFinished", (isFinished) => {
      this.isFinished = isFinished;
    })
  },
  mounted() {
    setupCanvas(this.$refs.wrapper);
  },
  methods:{
    reset(){
      this.maxSecond = 0;
      this.currentSecond = 0;
      this.pause = false;
      this.isSliding = false;
      this.sliderValue = 0;
      this.attackRangeVisible = false;
    },
    changeGameSpeed(){
      this.gameSpeed = this.gameSpeed === 4? 1 : this.gameSpeed * 2;
      gameManager.changeGameSpeed(this.gameSpeed);
    },
    changePause(){
      this.pause = !this.pause;
    },
    formatTooltip(val: number){
      return timeFormat(val * GameConfig.SIMULATE_STEP)
    },
    changeSecond(val: number){
      if(!this.isSliding){
        this.cachePauseState = this.pause;
      }
      this.isSliding = true;
      this.pause = true;
      eventBus.emit("jump_to_time_index", val);
    },
    handleSecondChange(second: number){
      this.currentSecond = Math.floor(second);
      this.sliderValue = Math.floor(second / GameConfig.SIMULATE_STEP);
    },
    //滚动结束
    endSlider(){
      this.isSliding = false;
      this.pause = this.cachePauseState;
    },
    handleEnemyDatas(enemyDatas){
      const cloneEnemyDatas = [];
      enemyDatas.forEach(enemyData => {
        const cloneEnemyData = {};
        Object.keys(enemyData).forEach(key => {
          
          if(key !== "skeletonData"){
            cloneEnemyData[key] = enemyData[key];
          }
        })

        cloneEnemyDatas.push(cloneEnemyData)
      })

      this.enemyDatas = cloneEnemyDatas;
    },
    restart(){
      gameManager.restart();
    },
    //生成关卡详情
    generateStageInfo(){
      const {levelId, operation, cn_name, challenge, description} = this.mapData;
      console.log(levelId)
      this.title = `${operation} ${cn_name}`;
      this.challenge = challenge;
      this.description = description;

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

        attrChangeStr = attrChangeStr.slice(0, -1); //去个逗号
        
        if(rune.calMethod === "add"){
          infoStr1 += enemyNamesStr + attrChangeStr;
        }else if(rune.calMethod === "mul"){
          infoStr2 += enemyNamesStr + attrChangeStr;
        }
      })

      this.stageAttrInfo = infoStr1 && infoStr2? infoStr1 + "，" + infoStr2 : infoStr1 + infoStr2;

    }
  },
  computed:{
    //分秒
    MS(){
      return timeFormat(this.currentSecond);
    }
  }
}
</script>

<template>
<div class="main">

  <div class="game" v-loading="loading">
    <div class="toolbar" v-show="mapData">
      <span class="ms">{{ MS }}</span>
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
        <button @click="changeGameSpeed()">{{gameSpeed}}X</button>
        <button 
          @click="changePause()"
          class="play"
        >
          {{pause?"播放":"暂停"}}
        </button>
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
      </div>
    </div>
    <div class="game-wrapper" ref="wrapper">
      <canvas id="c"></canvas>
      <Container 
        ref = "container"
        @pause = "pause = true"
        :attackRangeCheckAll = "attackRangeCheckAll"
        :countDownCheckAll = "countDownCheckAll"
        @update:attackRangeIndet = "val => attackRangeIndet = val"
        @update:countDownIndet = "val => countDownIndet = val"
      ></Container>
      <GameOverMask
        v-show="isFinished"
        @restart = "restart"
      ></GameOverMask>
    </div>
  </div>

  <div class="info">
    <h1>{{ title }}</h1>
    <p class="description">{{ description }}</p>
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
    .ms{
      color: white;
    }
    .time-slider{
      width: 600px;
      margin-left: 40px;
    }

  }
  .game-wrapper{
    flex: 1;
    position: relative;
    width: 100%;
  }
}

.buttons{
  width: 140px;
  display: flex;
  margin-left: 40px;
  
  button{
    user-select: none;
    font-size: 30px;
    cursor: pointer;
    height: 60px;
    background-color: white;
  }
  .play{
    line-height: 0px;
    margin-left: 20px;
    font-size: 20px;
  }
}

.checkboxs{
  width: 160px;
  background-color: white;
  padding-left: 10px;
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
  h1{
    text-align: center;
  }
  .description{
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
