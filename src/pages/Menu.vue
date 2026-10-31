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

    <!-- 窄屏抽屉模式的半透明遮罩，点击关闭菜单 -->
    <div
      class="menu-mask"
      v-if="isNarrow && menuShow"
      @click="menuShow = false"
    ></div>

    <transition>

    <div
      class="menu"
      :class="{ 'as-toppanel': isNarrow }"
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
import eventBus from "@/components/utilities/EventBus";
import StorySelect from "./StorySelect.vue"
import EnemyWave from "./EnemyWave.vue"

const emit = defineEmits<{
  (e: 'changeStage', map: any): void
}>()

//窄屏（手机）用抽屉模式，菜单默认收起，避免挤占画布
const isNarrow = window.matchMedia("(max-width: 768px)").matches;
const menuShow = ref(!isNarrow);
const toggle = ref(true);

const handleChangeStage = (map: any) => {
  emit("changeStage", map);
  //窄屏选完关卡自动收起抽屉，露出画布
  if(isNarrow){
    menuShow.value = false;
  }
}

//手机端：顶部header里的「菜单」按钮控制面板开合（画布上的悬浮眼睛按钮已隐藏）
eventBus.on("toggle-menu-panel", () => {
  menuShow.value = !menuShow.value;
});
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

  //窄屏：菜单变顶部下拉面板，从header下方展开盖住画布区（原左侧栏放到顶部）
  &.as-toppanel{
    position: fixed;
    left: 0;
    right: 0;
    top: var(--header-h, 60px);
    bottom: 0;
    width: 100%;
    height: auto;
    z-index: 1002;
    background-color: #545c64;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    //关卡目录可能很长，面板内部滚动
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

//抽屉/面板遮罩，盖住画布，点击关闭菜单
.menu-mask{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.4);
}

// ===== 窄屏：面板从顶部滑下；遮罩避开header，菜单开着时header仍可操作 =====
@media (max-width: 768px){
  .menu-mask{
    top: var(--header-h, 60px);
  }
  .v-enter-from,
  .v-leave-to{
    width: 100%;
    opacity: 0;
    transform: translateY(-12px);
  }
  .v-enter-to,
  .v-leave-from{
    width: 100%;
    opacity: 1;
    transform: translateY(0);
  }
  .v-enter-active,
  .v-leave-active{
    transition: all 0.25s;
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

//窄屏：不用悬浮眼睛按钮，菜单入口放到顶部header里（ToolBar的「菜单」按钮）
@media (max-width: 768px){
  .fixed-icon{
    display: none;
  }
}
</style>
