import { ref, watch } from "vue";
import eventBus from "./EventBus";

//显示开关的共享状态：
//PC端渲染在Header的工具条里，手机端渲染在「显示」菜单面板里（避免header横排放不下）
//watch里的副作用（emit事件、清掉半选状态）只在这一处定义，两端共用

export const attackRangeCheckAll = ref(false);
export const attackRangeIndet = ref(false);
export const countDownCheckAll = ref(true);
export const countDownIndet = ref(false);
export const showEnemyMenu = ref(false);

watch(attackRangeCheckAll, () => {
  //等价于原来checkbox上的@change="attackRangeIndet = false"
  attackRangeIndet.value = false;
  eventBus.emit("update:attackRangeCheckAll", attackRangeCheckAll.value);
})

watch(countDownCheckAll, () => {
  countDownIndet.value = false;
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
