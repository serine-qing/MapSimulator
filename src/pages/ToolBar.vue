<template>
  <div class="toolbar">
    <router-link :to="navLink.to" class="nav-link">{{ navLink.text }}</router-link>
    <Language></Language>
    <div class="checkboxs">

      <el-checkbox
        v-model="attackRangeCheckAll"
        :indeterminate="attackRangeIndet"
        @change = "attackRangeIndet = false"
      >
        {{$t("info.ShowAttackRange")}}
      </el-checkbox>

      <el-checkbox
        v-model="countDownCheckAll"
        :indeterminate="countDownIndet"
        @change = "countDownIndet = false"
      >
        {{$t("info.ShowWaitingTime")}}
      </el-checkbox>

      <el-checkbox
        v-model="showEnemyMenu"
      >
        {{$t("info.ShowMenu")}}
      </el-checkbox>
          
    </div>
  </div>

</template>

<script lang="ts" setup>
import eventBus from '@/components/utilities/EventBus';
import Language from "@/pages/Language.vue"
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navLink = computed(() => {
  if (route.path === '/sponsor') {
    return { to: '/', text: '返回' };
  }
  return { to: '/sponsor', text: '赞助我' };
});

const attackRangeCheckAll = ref(false);
const attackRangeIndet = ref(false);
const countDownCheckAll = ref(true);
const countDownIndet = ref(false);
const showEnemyMenu = ref(false);

watch(attackRangeCheckAll, () => {
  eventBus.emit("update:attackRangeCheckAll", attackRangeCheckAll.value);
})

watch(countDownCheckAll, () => {
  eventBus.emit("update:countDownCheckAll", countDownCheckAll.value);
})

watch(showEnemyMenu, () => {
  eventBus.emit("update:showEnemyMenu", showEnemyMenu.value);
})

eventBus.on("update:attackRangeIndet", (value) => {
  attackRangeIndet.value = value;
})

eventBus.on("update:countDownIndet", (value) => {
  countDownIndet.value = value;
})
</script>

<style scoped lang="scss">
.toolbar{
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-link {
  padding: 6px 12px;
  background: var(--primary-light, #eef2ff);
  border: 1px solid var(--primary, #4361ee);
  color: var(--primary, #4361ee);
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: var(--primary, #4361ee);
    color: white;
  }
}
.checkboxs{
  margin-left: 10px;
  width: 250px;
  display: flex;
  flex-direction: column;
  color: #fff;
  :deep(.el-checkbox){
    height: 20px;
  }
}
</style>
