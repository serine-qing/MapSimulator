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
        v-for="(actionArr, i) in actions"
        :index="i.toString()"
        :key="i"
      >

        <template #title>
          {{$t('game.Wave')}}&nbsp;
          <span class="info">{{i+1}}</span>，{{$t('game.StartTime')}}:&nbsp;
          <span class="info">{{ actionArr[0]?.actionTime }}</span>&nbsp;{{$t('game.Second')}}
        </template>

        <div class="cards">
          <div 
            class="enemy-card"
            :class="{active: actionIndex === index && waveIndex === i}"
            v-for="(action, index) in actionArr"
          >
            <div class="button">
              <span class="time">{{ action.actionTime + $t('game.Second') }}</span>
              <el-button 
                class="play-button" 
                type="primary" 
                :icon="CaretRight" 
                circle 
                size="small"
                @click="jumpToEnemyIndex(action.id)"
              />
            </div>
            <div class="content">
              <el-image class="head-image" :src="action.enemys[0]?.icon" fit="fill" />
              <div class="name">
                <span class="index">#{{action.id + 1}}</span>
                {{
                  action.enemys[0] ? action.enemys[0].name : 
                  action.actionData.key === "move_camera" ? "移动地图" : "装置出现"
                }}
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
import Global from '@/components/utilities/Global';

const actions = ref([]);
const actionIndex = ref(0);
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

eventBus.on("actions_init", (acts) => {
  actions.value = acts;
});

eventBus.on("action_index_change", (aIndex, wIndex) => {
  if(Global.gameManager.isSimulate) return;
  if(actions.value.length > 0){
    actionIndex.value = aIndex;
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