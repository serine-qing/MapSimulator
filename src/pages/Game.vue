<script lang="ts">
import Game from "@/components/game/Game"
import {setupCanvas} from '@/components/game/GameCanvas.ts';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";
import { timeFormat } from "@/components/utilities/utilities";
import Container from "@/pages/Container.vue"

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
    }
  },
  props:["mapData"],
  components:{ Container },
  watch:{
    async mapData(){
      if(!this.game){
        this.game = new Game();
      }
      console.log(this.mapData.levelId)

      this.$refs["container"].changeGameManager(null);
      this.loading = true;
      await this.game.startGame(this.mapData);
      this.reset();
      this.gameSpeed = GameConfig.GAME_SPEED;
      this.maxSecond = this.game.maxSecond;
      this.$refs["container"].changeGameManager(this.game.gameManager);
    },
    pause(){
      this.game?.gameManager?.changePause(this.pause);
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
      this.game.gameManager.changeGameSpeed(this.gameSpeed);
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
<div class="game" v-loading="loading">
  <div class="toolbar">
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
  <div class="wrapper" ref="wrapper">
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
</template>

<style scoped lang="scss">
.game{
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
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
  .wrapper{
    flex: 1;
    height: 100%;
    width: 100%;
  }
}

.buttons{
  width: 140px;
  display: flex;
  margin-left: 40px;
  
  button{
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
  position: fixed;
}

select {
    -moz-appearance: none;    /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
    appearance: none;         /* 标准属性 */
}
</style>
