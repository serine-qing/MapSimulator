<template>
  <el-select  
    v-model="currentLang"
    style="width: 150px"
  >
    <el-option
      v-for="item in language"
      :key="item.key"
      :label="item.name"
      :value="item.key"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const language = [
  {
    key: "CN",
    name: "简体中文"
  },
  {
    key: "JP",
    name: "日本語"
  },
  {
    key: "EN",
    name: "English"
  },
  {
    key: "KR",
    name: "한국어"
  },
];

if(!localStorage.currentLang){
  localStorage.currentLang = "CN";
}

const currentLang = ref(localStorage.currentLang);

watch(currentLang, () => {
  localStorage.currentLang = currentLang.value;
  window.location.reload();
})


</script>

<style lang="scss" scoped>
  
</style>