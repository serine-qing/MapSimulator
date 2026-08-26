<template>
  <el-dropdown trigger="click" @command="handleCommand" size="small">
    <span class="language-trigger">
      <span>{{ currentLangLabel }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in languages"
          :key="lang.key"
          :command="lang.key"
          :class="{ active: currentLang === lang.key }"
        >
          {{ lang.key }} {{ lang.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

const languages = [
  { key: "CN", name: "简体中文" },
  { key: "JP", name: "日本語" },
  { key: "EN", name: "English" },
  { key: "KR", name: "한국어" },
];

if (!localStorage.currentLang) {
  localStorage.currentLang = "CN";
}

const currentLang = ref(localStorage.currentLang);

const currentLangLabel = computed(() => {
  const lang = languages.find(l => l.key === currentLang.value);
  return lang ? `${lang.key} ${lang.name}` : "CN 简体中文";
});

const handleCommand = (key: string) => {
  currentLang.value = key;
};

watch(currentLang, () => {
  localStorage.currentLang = currentLang.value;
  window.location.reload();
})
</script>

<style lang="scss" scoped>
.language-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 8px 12px;
  width: 100px;
  background: var(--primary-light, #eef2ff);
  border: 1px solid var(--primary, #4361ee);
  border-radius: 6px;
  color: var(--primary, #4361ee);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--primary, #4361ee);
    color: white;
  }

  .arrow {
    font-size: 12px;
    margin-left: 2px;
  }
}

:deep(.el-dropdown-menu__item) {
  &.active {
    color: var(--primary, #4361ee);
    font-weight: 600;
    background: var(--primary-light, #eef2ff);
  }
}
</style>