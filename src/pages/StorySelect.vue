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

        <template
          v-if = "!story.stage"
        >
          <el-sub-menu 
            v-for="(episode, index2) in story.childNodes"
            :index="episode.episode"
            :key="index2"
          >
            <template #title>{{ episode.episode }}</template>

            <el-menu-item 
              v-for="(stage, index3) in episode.childNodes"
              :index="stage.id"
              :key="index3"
              @click="handleItemClick(stage)"
            >
              {{ stage.operation + " " + stage.name }}
            </el-menu-item>

          </el-sub-menu>
        </template>

        <template
          v-else-if = "story.stage"
        >
          <el-menu-item 
            v-for="(stage, index3) in story.childNodes"
            :index="stage.id"
            :key="index3"
            @click="handleItemClick(stage)"
          >
            <!-- <span 
              v-if="
                stage.operation.includes('突袭') || 
                stage.operation.includes('磨难') || 
                stage.operation.includes('险地')
              "
            ></span> -->
            {{ stage.operation + " " + stage.name }}
          </el-menu-item>

        </template>

      </el-sub-menu>
    </el-menu>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {getStorys, getStageInfo} from "@/api/stages"
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const emit = defineEmits<{
  (e: 'changeStage', map: any): void
}>()

//3级关卡菜单

const activeEpisode = "act1halfidle";

const storys = ref([]);
const stageId = ref();   //当前关卡id
const currentStage = ref();   //当前关卡

const initActiveEpisode = (storys) => {
  for(let n = 0; n < storys.length; n++){
    const story = storys[n];

    if(story.stage !== true){

      for(let i = 0; i < story.childNodes.length; i++){
        const episode = story.childNodes[i];
        if(episode.id === activeEpisode){
          story.childNodes.splice(i, 1);
          episode.type = t("info.CurrentEvent") +": " + episode.episode;
          episode.stage = true;
          storys.unshift(episode);
          return;
        }
      }

    }
  }

    

}

getStorys().then((res) => {
  res.data.storys.forEach(story => {
    if(story.stage !== true){
      story.childNodes.reverse();
    }
  })

  initActiveEpisode(res.data.storys)

  storys.value = res.data.storys;
  //网址带有关卡id 就进行初始化
  const id = route.query.id as string;

  if(id){
    const queue: any = [];
    queue.push( {childNodes:storys.value} );

    let item;
    while(item = queue.shift()){
      if(item.childNodes){
        item.childNodes.forEach((j: any) => {
          queue.push(j)
        })
      }else{
        if(item.id === id){
          stageId.value = id;
          currentStage.value = item;
          return;
        }
      }
    }
  }

});

interface Stage{
  id: string,
  operation: string,
  name: string,
  description: string,
  episode: string,
  levelId: string,
  hasChallenge: boolean,   //是否有突袭
  challenge?: string,       //突袭条件(有这个key意味着是突袭关)
  sandTable?: any[],       //沙盘推演数据
}

const route = useRoute();
const router = useRouter();

const handleItemClick = (stage: Stage) => {
  if(stage.id) stageId.value = stage.id;
  currentStage.value = stage;
  router.push("/?id=" + stage.id);
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
  background-color: #545c64;
}
</style>