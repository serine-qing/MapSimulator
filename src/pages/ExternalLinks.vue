<template>
  <div class="external-links">
    <a target="_blank" class="prts" :href="prtsLink">查看PRTS.WIKI</a>
    <a target="_blank" class="arkrec" :href="arkrecLink">查看少人WIKI</a>
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

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
  arkrecLink.value = `https://wiki.arkrec.com/operation/${levelCode}+${levelName}`;
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