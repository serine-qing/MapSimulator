<script lang="ts">
import Game from "@/components/game/Game"
import {setupCanvas} from '@/components/game/GameCanvas.ts';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";

export default{
  data(){
    return{
      gameSpeed: Number,
      maxSecond: Number,
      currentSecond: Number,
      pause: Boolean,
      cachePauseState: Boolean,
      isSliding: false
    }
  },
  props:["mapData"],
  watch:{
    async mapData(){
      if(!this.game){
        this.game = new Game();
      }
      await this.game.startGame(this.mapData);
      this.gameSpeed = GameConfig.GAME_SPEED;
      this.maxSecond = this.game.maxSecond;
      this.pause = false;
      this.isSliding = false;
      this.currentSecond = 0;
    },
    pause(){
      this.game?.gameManager?.changePause(this.pause);
    }
  },
  created(){
    this.maxSecond = 0;
    this.currentSecond = 0;
    this.pause = false;
    this.gameSpeed = GameConfig.GAME_SPEED;
    eventBus.on("second_change", this.handleSecondChange)
  },
  mounted() {
    setupCanvas(this.$refs.wrapper);
  },
  methods:{
    changeGameSpeed(){
      this.gameSpeed = this.gameSpeed === 4? 1 : this.gameSpeed * 2;
      this.game.gameManager.changeGameSpeed(this.gameSpeed);
    },
    changePause(){
      this.pause = !this.pause;
    },
    formatTooltip(val: number){
      return val * GameConfig.SIMULATE_STEP + "秒";  
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
      this.currentSecond = Math.floor(second / GameConfig.SIMULATE_STEP);
    },
    //滚动结束
    endSlider(){
      this.isSliding = false;
      this.pause = this.cachePauseState;
    }
  },
}
</script>

<template>
<div class="game">
  <div class="top">

    <div class="time-slider">
      <el-slider 
        v-model = "currentSecond" 
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

  </div>
  <div class="wrapper" ref="wrapper">
    <canvas id="c"></canvas>
  </div>
</div>
</template>

<style scoped lang="scss">
.game{
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  .top{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background-color: black;
    padding-top: 10px;
    .time-slider{
      width: 600px;
      margin-left: 80px;
    }
    .buttons{
      width: 160px;
      display: flex;
      padding-right: 10%;
      margin-left: 60px;
      
      button{
        font-size: 30px;
        cursor: pointer;
        height: 60px;
        width: 60px;
        background-color: white;
      }
      .play{
        line-height: 0px;
        margin-left: 40px;
        font-size: 20px;
      }
    }
  }
  .wrapper{
    flex: 1;
    height: 100%;
    width: 100%;
  }
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
