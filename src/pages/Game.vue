<script lang="ts">
import Game from "@/components/game/Game"
import {setupCanvas} from '@/components/game/GameCanvas.ts';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";
import { timeFormat } from "@/components/utilities/utilities";
import Container from "@/pages/Container.vue"
import DataTable from "@/pages/DataTable.vue"
import MapModel from "@/components/game/MapModel";

let mapModel: MapModel;
let game: Game = new Game();

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

      attackRangeCheckAll: false,
      attackRangeIndet: false,

      countDownCheckAll: true,
      countDownIndet: false,

      enemyDatas: null
    }
  },
  props:["mapData"],
  components:{ Container, DataTable },
  watch:{
    async mapData(){
      console.log(this.mapData.levelId)

      this.$refs["container"].changeGameManager(null);
      this.loading = true;

      mapModel = new MapModel(this.mapData);

      await mapModel.init();
      await game.startGame(mapModel);

      this.handleEnemyDatas(mapModel.enemyDatas);

      this.reset();
      this.gameSpeed = GameConfig.GAME_SPEED;
      this.maxSecond = game.maxSecond;
      this.$refs["container"].changeGameManager(game.gameManager);

    },
    pause(){
      game?.gameManager?.changePause(this.pause);
    },
  },
  created(){
    this.reset();
    this.gameSpeed = GameConfig.GAME_SPEED;
    eventBus.on("second_change", this.handleSecondChange)
    eventBus.on("gamestart", () => {
      this.loading = false;
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
      game.gameManager.changeGameSpeed(this.gameSpeed);
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
    </div>
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
</style>
