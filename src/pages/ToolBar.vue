<template>
  <div class="toolbar">
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
import { ref, watch } from 'vue';

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
