<template>
  <div class="enemy-wave">

    <div 
      class="enemy-card"
      :class="{active: enemyIndex === index}"
      v-for="(enemie, index) in enemies"
    >
      <div class="button">
        <el-button 
          class="play-button" 
          type="primary" 
          :icon="CaretRight" 
          circle 
          size="small"
          @click="jumpToEnemyIndex(index)"
        />
      </div>
      <div class="content">
        <el-image class="head-image" :src="test" fit="fill" />
        <div class="name">
          <span class="index">#{{index + 1}}</span>
          {{enemie.name}}
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import test from "@/assets/test.png"
import eventBus from "@/components/utilities/EventBus";

import {
  CaretRight,
} from '@element-plus/icons-vue'

const enemies = ref([]);
const enemyIndex = ref(0);

eventBus.on("enemies_init", (res) => {
  enemies.value = res;
});

eventBus.on("enemy_index_change", (index) => {
  enemyIndex.value = index;
});

const jumpToEnemyIndex = (index: number) => {
  enemyIndex.value = index;
  eventBus.emit("jump_to_enemy_index", index);
}

</script>

<style scoped lang="scss">
.enemy-wave{
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #545c64;
  padding: 6px 10px 6px 16px;
  align-items: center;
  .enemy-card{
    margin-bottom: 6px;
    height: 50px;
    width: 280px;
    background-color: #909399;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
    color: #fff; 
    display: flex;
    align-items: center;
    &:hover{
      background-color: #b1b3b8;  
    }
    &.active{
      background-color: #fff;
      color: #000;
      border: 2px solid #b88b8b;

    }
    div{
      display: flex;
      align-items: center;
      height: 100%;
    }
    .button{
      justify-content: center;
      width: 40px;
      .play-button{
        font-size: 20px;
      }
      border-right: 1px solid #e4e7ed;
    }
    .content{
      justify-content: flex-start;
      flex: 1;
      margin-left: 6px;
      display: flex;
      cursor: pointer;
      .head-image{
        height: 35px;
        width: 35px;
        margin-right: 6px;
      }
      .name{
        flex: 1;
        .index{
          margin-right: 4px;
        }
      }

    }
  }
}
</style>