<template>
  <div class="toolbar">
    <!-- 手机端：菜单入口放在顶部（替代画布上悬浮的眼睛按钮），仅首页有菜单 -->
    <span
      class="menu-toggle"
      v-if="isHome && isNarrow"
      @click="eventBus.emit('toggle-menu-panel')"
    >☰ 菜单</span>
    <router-link :to="navLink.to" class="nav-link">{{ navLink.text }}</router-link>
    <Language></Language>
    <div class="checkboxs">

      <el-checkbox
        v-model="attackRangeCheckAll"
        :indeterminate="attackRangeIndet"
        @change = "attackRangeIndet = false"
      >
        {{$t("info.ShowAttackRange")}}
      </el-checkbox>

      <el-checkbox
        v-model="countDownCheckAll"
        :indeterminate="countDownIndet"
        @change = "countDownIndet = false"
      >
        {{$t("info.ShowWaitingTime")}}
      </el-checkbox>

      <el-checkbox
        v-model="showEnemyMenu"
      >
        {{$t("info.ShowMenu")}}
      </el-checkbox>
          
    </div>
  </div>

</template>

<script lang="ts" setup>
import Language from "@/pages/Language.vue"
import eventBus from '@/components/utilities/EventBus';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  attackRangeCheckAll,
  attackRangeIndet,
  countDownCheckAll,
  countDownIndet,
  showEnemyMenu
} from '@/components/utilities/displayOptions';

const route = useRoute();

const navLink = computed(() => {
  if (route.path === '/sponsor') {
    return { to: '/', text: '返回' };
  }
  return { to: '/sponsor', text: '赞助我' };
});
//显示开关的状态与事件联动统一放在displayOptions.ts，桌面/手机两端共用

//手机端顶部的「菜单」按钮：只有首页才有侧边菜单
const isNarrow = window.matchMedia("(max-width: 768px)").matches;
const isHome = computed(() => route.path === "/");
</script>

<style scoped lang="scss">
.toolbar{
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-link {
  padding: 6px 12px;
  background: var(--primary-light, #eef2ff);
  border: 1px solid var(--primary, #4361ee);
  color: var(--primary, #4361ee);
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: var(--primary, #4361ee);
    color: white;
  }
}
.checkboxs{
  margin-left: 10px;
  width: 250px;
  display: flex;
  flex-direction: column;
  color: #fff;
  :deep(.el-checkbox){
    height: 20px;
  }
}

// ===== 窄屏（手机）：配合Header深色顶栏 =====
// 第一行：标题+菜单按钮+赞助我+语言；第二行：三个显示开关（缩小字号保证全显）
@media (max-width: 768px){
  .toolbar{
    display: contents;
  }
  .menu-toggle{
    order: 2;
    align-self: center;
    padding: 3px 10px;
    font-size: 12px;
    color: #fff;
    background: var(--primary, #4361ee);
    border-radius: 6px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
  }
  .nav-link{
    order: 3;
    align-self: center;
    padding: 2px 8px;
    font-size: 12px;
    white-space: nowrap;
    background: transparent;
    border-color: #5a5d66;
    color: #cfd3dc;
    &:hover {
      background: #2c2e34;
      color: #fff;
    }
  }
  //Language组件根节点是el-dropdown，无法直接加order，用:deep调整
  :deep(.el-dropdown){
    order: 4;
    align-self: center;
  }
  .checkboxs{
    order: 6;
    //100%宽强制独占第二行；异常长的翻译兜底横滑
    width: 100%;
    flex: none;
    margin-left: 0;
    padding: 0 8px 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 8px;
    color: #fff;
    &::-webkit-scrollbar{
      display: none;
    }
    //注意：嵌套的:deep() Vue不支持，必须平铺写
    :deep(.el-checkbox){
      height: 20px;
      flex-shrink: 0;
    }
    :deep(.el-checkbox__input){
      margin-right: 4px;
    }
    :deep(.el-checkbox__label){
      //缩小字号：三个开关连同最长的「点击敌人后显示菜单」在375px内完整放下
      font-size: 10px;
      white-space: nowrap;
      color: #d8dbe2;
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__label){
      color: #6ea8ff;
    }
  }
}
</style>
