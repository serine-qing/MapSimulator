<template>
  <div class="menu-wrapper">

    <el-button 
      type="info" 
      @click="menuShow = true"
      class="fixed-icon" 
    >
    
      <el-icon >
        <View />
      </el-icon>
      <span class="icon-text">显示</span>
    </el-button>

    <transition> 

    <div
      class="menu"
      v-show="menuShow"
    >
      <div class="icons">
        <el-button type="info" @click="menuShow = false">
          <el-icon >
            <Hide />
          </el-icon>
          <span class="icon-text">隐藏</span>
        </el-button>
        
        <el-button type="info" @click="toggle = !toggle">
          <el-icon >
            <Menu />
          </el-icon>
          <span class="icon-text">{{toggle? "波次" : "菜单"}}</span>
        </el-button>
        
      </div>  
      
      <StorySelect 
        @changeStage = "handleChangeStage"
        v-show="toggle"
      />
      <EnemyWave 
        v-show="!toggle"
        :active = "!toggle"
      />
    </div>

    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import StorySelect from "./StorySelect.vue"
import EnemyWave from "./EnemyWave.vue"

const emit = defineEmits<{
  (e: 'changeStage', map: any): void
}>()

const handleChangeStage = (map: any) => {
  emit("changeStage", map);
}

const menuShow = ref(true);
const toggle = ref(true);
</script>

<style scoped lang="scss">
.menu-wrapper{
  position: relative;
}
.menu{
  overflow: hidden;
  position: relative;
  z-index: 1002;
  height: 100%;
  width: 350px;
  display: flex;
  flex-direction: column;
  ::-webkit-scrollbar {
    width: 6px;
    background-color: #545C64;
  }

  ::-webkit-scrollbar-thumb {
    background: #9BAAF0;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  .icons{
    padding-top: 12px;
    padding-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #545c64;
    .el-icon{
      font-size: 24px;
    }
  }

  :deep(.el-menu){
    border-right: none;
  }
}

.fixed-icon{
  top: 6px;
  left: 2px;
  z-index: 1001;
  font-size: 24px;
  position: absolute;
}

.v-enter-from,
.v-leave-to{
  width: 0;
}

.v-enter-to,
.v-leave-from{
  width: 330px;
}

.v-enter-active,
.v-leave-active{
  transition: all 0.4s;
}

.icon-text{
  font-size: 16px;
}
</style>
