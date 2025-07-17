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
      pause: Boolean,
      attackRangeVisible: false, //远程敌人攻击范围是否可见
      cachePauseState: Boolean,
      isSliding: false,
      loading: false
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
    attackRangeVisible(){
      this.game.gameManager.updateAttackRangeVisible(this.attackRangeVisible);
    }
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
<div class="game" v-loading="loading">
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
      <button 
        @click="attackRangeVisible = !attackRangeVisible"
        class="play"
      >
        {{attackRangeVisible?"显示":"不显示"}}
      </button>
    </div>

  </div>
  <div class="wrapper" ref="wrapper">
    <canvas id="c"></canvas>
    <Container 
      ref = "container"
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
      width: 240px;
      display: flex;
      padding-right: 10%;
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
