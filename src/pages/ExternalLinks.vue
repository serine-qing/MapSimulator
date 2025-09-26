<template>
  <div class="external-links">
    <a target="_blank" class="prts" :href="prtsLink">{{$t('info.PRTSWIKI')}}</a>
    <a target="_blank" class="arkrec" :href="arkrecLink">{{$t('info.Arkrec')}}</a>
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const language = localStorage.currentLang || "CN";
let arkrecPrefix;

switch (language) {
  case "CN":
    arkrecPrefix = "wiki";
    break;
  case "JP":
    arkrecPrefix = "jp";
    break;  
  default:
    arkrecPrefix = "en";
    break;
}
const {levelCode, levelName, levelFullCode} = defineProps<{
  levelCode: string,
  levelName: string,
  levelFullCode: string,
}>();

const prtsLink = ref("");
const arkrecLink = ref("");

watch(() => levelCode, () => {
  if(levelFullCode.includes("磨难") || levelFullCode.includes("险地")){
    prtsLink.value = `https://prts.wiki/w/${levelFullCode}_${levelName}`;
  }else{
    prtsLink.value = `https://prts.wiki/w/${levelCode}_${levelName}`;
  }
  arkrecLink.value = `https://${arkrecPrefix}.arkrec.com/operation/${levelCode}+${levelName}`;
})
</script>

<style lang="scss" scoped>
.external-links{
  display: flex;
  align-items: center;
  justify-content: center;
  a{
    text-decoration: none;
  }
}
.prts{
  
}
.arkrec{
  margin-left: 20px;
}
</style>