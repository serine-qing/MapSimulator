<template>
  <div class="enemy-wave">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      text-color="#F2F6FC"
      class="menu"
      ref="menu"
    >
      <el-sub-menu 
        v-for="(enemyArr, i) in enemies"
        :index="i.toString()"
        :key="i"
      >

        <template #title>
          波次&nbsp;<span class="info">{{i+1}}</span>，开始时间:&nbsp;<span class="info">{{ enemyArr[0].spawnTime }}</span>&nbsp;秒
        </template>

        <div class="cards">
          <div 
            class="enemy-card"
            :class="{active: enemyIndex === index && waveIndex === i}"
            v-for="(enemy, index) in enemyArr"
          >
            <div class="button">
              <span class="time">{{ enemy.spawnTime + "秒" }}</span>
              <el-button 
                class="play-button" 
                type="primary" 
                :icon="CaretRight" 
                circle 
                size="small"
                @click="jumpToEnemyIndex(enemy.id)"
              />
            </div>
            <div class="content">
              <el-image class="head-image" :src="enemy.icon" fit="fill" />
              <div class="name">
                <span class="index">#{{enemy.id + 1}}</span>
                {{enemy.name}}
              </div>
            </div>
          </div>
        </div>
      </el-sub-menu>
  
    </el-menu>



  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue';
import eventBus from "@/components/utilities/EventBus";
const { active } = defineProps(['active']);

import {
  CaretRight,
} from '@element-plus/icons-vue'

let enemies = ref();
const enemyIndex = ref(0);
const waveIndex = ref(0);
const menu = ref(null);

watch(() => active, () => {
  if(active){
    menu.value.open(waveIndex.value.toString());
  }
})

watch(waveIndex, () => {
  try{
    menu.value.open(waveIndex.value.toString());
  }catch{
    
  }
  
})

eventBus.on("enemies_init", (res) => {
  enemies.value = res;
});

eventBus.on("enemy_index_change", (eIndex, wIndex) => {

  if(enemies.value?.length){
    enemyIndex.value = eIndex;
    waveIndex.value = wIndex;
  }

});

const jumpToEnemyIndex = (index: number) => {
  eventBus.emit("jump_to_enemy_index", index);
}

</script>

<style scoped lang="scss">
.enemy-wave{
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #545c64;
  padding: 6px 10px 6px 12px;
  align-items: center;
  user-select: none;
  .menu{
    border: none;
    .cards{
      display: flex;
      align-items: center;
      flex-direction: column;
      margin: 0 10px;
      .enemy-card{
        margin-bottom: 6px;
        height: 60px;
        width: 100%;
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 60px;
          .time{
            font-size: 12px;
            margin-bottom: 5px;
          }
          .play-button{
            font-size: 20px;
            ::v-deep .el-icon{
              padding-top: 1px;
              padding-left: 4px;
            }
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
  }
  .info{
    color: #409EFF;
  }

}
</style>