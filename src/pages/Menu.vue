<template>
  <div>

    <el-button 
      type="info" 
      @click="menuShow = true"
      class="fixed-icon" 
    >
    
      <el-icon >
        <View />
      </el-icon>
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
        </el-button>
        
        <el-button type="info" @click="toggle = !toggle">
          <el-icon >
            <Menu />
          </el-icon>
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
.menu{
  overflow: hidden;
  position: relative;
  z-index: 100;
  height: 100%;
  width: 350px;
  display: flex;
  flex-direction: column;
  .icons{
    padding-top: 6px;
    padding-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #545c64;
    .el-icon{
      font-size: 24px;
    }
  }
}

.fixed-icon{
  top: 6px;
  left: 2px;
  z-index: 10;
  font-size: 24px;
  position: fixed;
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
</style>
