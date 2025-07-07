<script lang="ts">
import Game from "@/components/game/Game"
import {setupCanvas} from '@/components/game/GameCanvas.ts';
import GameConfig from "@/components/utilities/GameConfig";
import eventBus from "@/components/utilities/EventBus";

function timeFormat(timestamp: number): string{
  const minute = Math.floor(timestamp / 60);
  const second = timestamp % 60;
  let str = minute > 0 ? minute + "分" : "";
  str += second + "秒";
  return str ;
}

export default{
  data(){
    return{
      gameSpeed: Number,
      maxSecond: Number,
      sliderValue: Number,   //时间滑块的数值
      currentSecond: Number, //当前时间(秒)
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
      this.reset();
      this.gameSpeed = GameConfig.GAME_SPEED;
      this.maxSecond = this.game.maxSecond;
      
    },
    pause(){
      this.game?.gameManager?.changePause(this.pause);
    }
  },
  created(){
    this.reset();
    this.gameSpeed = GameConfig.GAME_SPEED;
    eventBus.on("second_change", this.handleSecondChange)
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
<div class="game">
  <div class="top">
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
    .ms{
      color: white;
    }
    .time-slider{
      width: 600px;
      margin-left: 40px;
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
