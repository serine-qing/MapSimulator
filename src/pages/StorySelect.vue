<template>
  <div class="story-menu">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"

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
            :index="stage.operation"
            :key="index3"
            @click="handleItemClick(stage)"
          >
            {{ stage.operation + "  " + stage.cn_name }}
          </el-menu-item>

        </el-sub-menu>

      </el-sub-menu>
    </el-menu>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {getStorys, getStageInfo} from "@/api/stages"
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits<{
  (e: 'changeStage', map: any): void
}>()

//3级关卡菜单


const storys = ref([]);
const stageId = ref();   //当前关卡id
const currentStage:any = ref();   //当前关卡

getStorys().then((res) => {
  storys.value = res.data.storys;

  //网址带有关卡id 就进行初始化
  const id = route.query.id as string;

  const queue: any = [];
  queue.push( {childNodes:storys.value} );
  let item;
  while(item = queue.shift()){
    if(item.childNodes){
      item.childNodes.forEach((j: any) => {
        queue.push(j)
      })
    }else{
      if(item.operation === id){
        stageId.value = id;
        currentStage.value = item;
        return;
      }
    }
  }

});

interface Stage{
  operation: string,
  cn_name: string,
  description: string,
  episode: string,
  levelId: string,
  hasChallenge: boolean,   //是否有突袭
  challenge?: string       //突袭条件(有这个key意味着是突袭关)
}

const route = useRoute();
const router = useRouter();

const handleItemClick = (stage: Stage) => {
  stageId.value = stage.operation;
  currentStage.value = stage;
  router.push("/?id=" + stage.operation);
}

//stage改变后修改当前关卡
watch( currentStage , () => {
  const levelPath = currentStage.value.levelId;
    if( levelPath ){
      getStageInfo(levelPath).then((res) => {
        emit(
          "changeStage", 
          { ...res.data, ...currentStage.value }
        )
      });
  } 
})
</script>

<style lang="scss" scoped>
.story-menu{
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>