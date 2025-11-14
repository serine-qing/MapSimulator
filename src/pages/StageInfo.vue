<template>
  <div class="info">
    <div class="title-link">
      <span>{{ title }}</span>
      <ExternalLinks 
        :level-code="levelCode" 
        :level-name="levelName"
        :level-full-code="levelFullCode"
      ></ExternalLinks>
    </div>
    
    <p class="description">{{ description }}</p>
    
    
    <p v-for="desc in extraDescription" :style="{color: desc.color?desc.color:'black'}">{{ desc.text }}</p>
    <p>{{$t("info.DeploymentLimit")}}:{{ characterLimit }}，{{$t("info.SquadSize")}}:{{ squadNum }}</p>
    <p v-if="challenge"><span class="challenge">{{$t("info.ChallengeCondition")}}:</span>{{ challenge }}</p>
    <p v-if="stageAttrInfo"><span class="challenge">{{$t("info.StatBonus")}}:</span>
      <span v-html="stageAttrInfo"></span>
    </p>
  </div>
</template>

<script setup lang="ts">
import ExternalLinks from "@/pages/ExternalLinks.vue"
const {title, description, levelCode, levelName, levelFullCode, 
  extraDescription, characterLimit, squadNum, challenge, stageAttrInfo} = defineProps<{
  title: string,
  description: string,
  levelCode: string,
  levelName: string,
  levelFullCode: string,
  extraDescription: any[],
  characterLimit: number,
  squadNum: number,
  challenge: string | undefined | null,
  stageAttrInfo: string
}>();

title
</script>

<style lang="scss" scoped>
.info{
  padding-left: 20px;
  .title-link{
    margin: 15px 0;
    margin-right: 30px;
    display: flex;
    justify-content: space-between;
      span{
        font-size: 28px;
        font-weight: bolder;
        color: var(--primary);
      }
  }

  .description{
    text-align: left;
    font-size: 15px;
    color: #555555;
  }
  :deep(.bluename){
    color: #0645ad;
  }
  
  :deep(.challenge){
    color: #d22d2dcc;
    font-weight: bolder;
  }
}
</style>