<template>
  <div class="language">
    <div 
      v-for="language in languages"
      :class="{active: currentLang === language.key}"
      class="language-button"
      @click="currentLang = language.key"
    >{{language.name}}</div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const languages = [
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
.language{
  display: flex;
  justify-content: center;
  align-items: center;
  .title{
    font-size: 18px;
    color: #409eff;
    margin: 4px 0;
  }
}

.language-button {
  background: var(--primary-light);
  border: 1px solid var(--border);
  color: var(--primary);
  padding: 8px 15px;
  border-radius: 6px;
  margin-right: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 14px;
  &.active, &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(67, 97, 238, 0.3);
  }
}
</style>