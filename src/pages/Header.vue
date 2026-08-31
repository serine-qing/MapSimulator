<template>
  <div class="header">
    <div class="left">
      <span class="header-title">方舟地图模拟器</span>
    </div>

    <div class="right">
      <a href="/operators" target="_blank" class="header-link">少人Wiki编队识别器</a>
      <ToolBar></ToolBar>
    </div>
  </div>

</template>

<script lang="ts" setup>
import ToolBar from "./ToolBar.vue"
</script>

<style scoped lang="scss">
.header{
  height: 60px;
  width: 100%;
  background-color: #FFFFFF;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left{
    padding-left: 20px;
    .header-title{
      font-size: 20px;
      font-weight: 700;
      color: var(--primary);
    }

  }
  .right{
    display: flex;
    align-items: center;
  }

  .header-link{
    font-size: 14px;
    margin-right: 20px;
  }
}
</style>
