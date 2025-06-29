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
      text-color="#fff"
      :default-active = "stageId"
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
            :index="stage.levelId"
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
import { onMounted, ref, watch } from "vue";
import {getStorys, getStageInfo} from "@/api/stages"
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits<{
  (e: 'changeStage', map: any): void
}>()

//3级关卡菜单


const storys = ref([]);
const stageId = ref("");   //当前关卡id

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

const route = useRoute();
const router = useRouter();

const handleItemClick = (stage: Stage) => {
  router.push("/?id=" + stage.levelId);
}

//id改变后修改当前关卡
watch( stageId , () => {
    if( stageId.value ){
      getStageInfo(stageId.value.toLowerCase()).then((res) => {
        emit("changeStage", res.data)
      });
  } 
})

onMounted(() => {

  const id = route.query.id as string;
  if(stageId){
    stageId.value = id;
  }
})
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
