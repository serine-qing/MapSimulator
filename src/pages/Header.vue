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
  height: var(--header-h, 60px);
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

// ===== 窄屏（手机）：专属深色顶栏样式（与PC白底完全不同） =====
// 第一行：标题+赞助我+语言；第二行：三个显示开关（小字号）；wiki链接手机端隐藏
@media (max-width: 768px){
  .header{
    flex-wrap: wrap;
    //作为flex子项默认min-width:auto，会被nowrap内容撑宽导致不换行
    min-width: 0;
    max-width: 100%;
    height: auto;
    background-color: #1d1e22;
    border-bottom: none;
    box-shadow: none;
    .left{
      padding-left: 10px;
      order: 1;
      height: 40px;
      display: flex;
      align-items: center;
      .header-title{
        font-size: 15px;
        color: #ffffff;
        white-space: nowrap;
      }
    }
    //display:contents把header-link和ToolBar内部元素提升为header的flex子项
    .right{
      display: contents;
    }
  }

  .header-link{
    //手机端隐藏少人Wiki入口（开关已移入菜单面板，这里仅兜底）
    display: none;
  }
}
</style>
