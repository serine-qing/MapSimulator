<script lang="ts" setup>
import Header from "@/pages/Header.vue"
</script>

<template>
<div class="index">
  <Header></Header>
  <router-view />
</div>
</template>

<style>
:root {
  --primary: #4361ee;
  --primary-light: #eef2ff;
  --secondary: #3a0ca3;
  --accent: #4cc9f0;
  --text: #2d3748;
  --text-light: #718096;
  --bg: #f7fafc;
  --card-bg: #ffffff;
  --border: #e2e8f0;
  --success: #48bb78;
  --warning: #ed8936;
  --danger: #f56565;
  /* header高度，Game等区域用它计算可用高度 */
  --header-h: 60px;
}

/* 窄屏深色顶栏：第一行40px + 第二行小字号开关条 */
@media (max-width: 768px) {
  :root {
    --header-h: 64px;
  }
}

/* 手机端全屏看图模式：隐藏顶部header，地图独占屏幕（全局规则，横屏宽视口下也生效） */
body.fs-map .header {
  display: none;
}

</style>

<style scoped>
.index{
  height: 100vh;
  /* 移动端浏览器地址栏动态伸缩，dvh更准确（不支持的浏览器回退到上一行） */
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content{
  flex: 1;
  display: flex;
  overflow: hidden;
  .main{
    flex: 1;
    overflow: auto;
  }
}
#c{
  display: block;
  position: fixed;
}

.beian{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
  img{
    margin-right: 2px ;
    height: 18px;
  }
}
</style>
