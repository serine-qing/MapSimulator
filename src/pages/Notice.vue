<template>
  <div class="notice">
    <el-popover
      class="box-item"
      placement="bottom-start"
      :width="600"
    >
      <template #reference> 
        <el-link type="danger">更新公告</el-link>
      </template>
      <p style="color: red;">8.14更新：“墟”S关地图更新</p>
      <p style="color: red;">8.12更新：孤星机制优化</p>
      <p style="color: red;">8.9更新：完成路线显示功能</p>
      <p style="color: red;">8.6更新：完成惯性和避障力</p>
      <p style="color: red;">8.5更新：新活动敌人、装置技能基本完成适配，雷遁忍者跳跃暂未实现。</p>
      <p></p>
      <p>目前项目还处于测试运行阶段，基础框架搭好了，但是方舟各个活动、主线机制复杂多样，每个活动都得独立做适配，我首先保证当期活动是没问题的。</p>
      <p>小水管服务器，承载能力可能不够，如果卡顿请见谅</p>
      <p>开发者：露托official : <el-link href="https://space.bilibili.com/10356132" type="primary">B站主页</el-link>，欢迎关注！</p>
    </el-popover>
    
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const content = ref("");

</script>

<style lang="scss" scoped>
.notice{
  z-index: 1000;
  position: absolute;
  left: 30px;
  top: 35px;
}

</style>