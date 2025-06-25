<template>
  <el-col 
    :xs="10" 
    :sm="8"
    :md="6"
    :lg="5"
    :xl="4"
    class="story-menu"
  >
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="menu"
      default-active="2"
      text-color="#fff"
    >
      <el-sub-menu 
        v-for="(story, index1) in storys"
        :index="story.type"
        :key="index1"
      >
        <template #title>
          <span>{{ story.type }}</span>
        </template>

        <el-sub-menu 
          v-for="(episode, index2) in story.childNodes"
          :index="episode.episode"
          :key="index2"
        >
          <template #title>{{ episode.episode }}</template>

          <el-menu-item 
            v-for="(stage, index3) in episode.childNodes"
            :index="stage.operation"
            :key="index3"
            @click="handleItemClick(stage)"
          >
            {{ stage.operation + "  " + stage.cn_name }}
          </el-menu-item>

        </el-sub-menu>

      </el-sub-menu>
    </el-menu>
  </el-col>
</template>

<script lang="ts" setup>
import { ref } from "vue";

//3级关卡菜单
import {getStorys, getStageInfo} from "@/components/api/stages"

const storys= ref([]) as any;

getStorys().then((res) => {
  storys.value = res.data.storys;

});

interface Stage{
  operation: string,
  levelId: string,
  cn_name: string,
  description: string,
  episode: string
}

const handleItemClick = (stage: Stage) => {
  const levelId = stage.levelId?.toLocaleLowerCase();
  if( levelId ){
    getStageInfo(levelId).then((res) => {
        console.log(res.data)
    });
  }
}


</script>

<style scoped lang="scss">
.story-menu{
  height: 100vh;
  overflow-y: scroll;
  .menu{
    min-height: 100vh;
  }
}
</style>
