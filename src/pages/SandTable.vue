<template>
  <div class="wrapper">
    <div class="sand-table">
      <p class="title">选择沙盘推演假设 <span>敌人属性将逐级提升</span></p>
      <div class="tags">

        <div 
          class="tag"
        >
          <div class="tag-title">
            <CaretRight></CaretRight><span>LV.1</span>
          </div>
          <div 
            class="tag-tab"
            :class="{'shadow-blink': rune1Selected === -1}"
          >

            <div 
              v-for="(rune, index) in runes1"
              class="tag-item"
              :class="{active: rune1Selected === index}"
              @click="handleRune1Selected(index)"
            > 
              <div 
                v-if="index < runes1.length - 1"
                v-show="rune1Selected === -1"
                class="icon"
              >或是</div>
              <span class="tag-info">{{rune.runeDesc}}</span>
            </div>

          </div>
        </div>

        <div 
          class="tag"
          :style="{opacity: rune1Selected > -1? 1 : 0.3}"
        >
          <div class="tag-title">
            <CaretRight></CaretRight><span>LV.2</span>
          </div>
          <div 
            class="tag-tab"
            :class="{'shadow-blink': (rune1Selected > -1 && rune2Selected === -1)}"
          >

            <div 
              v-for="(rune, index) in runes2"
              class="tag-item"
              :class="{active: rune2Selected === index}"
              @click="handleRune2Selected(index)"
            >
              <div 
                v-if="index < runes2.length - 1"
                v-show="rune2Selected === -1"
                class="icon"
              >或是</div>
              <span class="tag-info">{{rune.runeDesc}}</span>
            </div>

          </div>
        </div>

      </div>
      <div 
        class="submit"
        @click="handleSubmit"
        :class="{disabled: !hasChanged()}"
      >确定</div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, shallowRef, toRaw, watch } from 'vue';
const { sandTableData } = defineProps(["sandTableData"])

const emit = defineEmits(["changeRunesData"]);

const runes1 = shallowRef([]);
const runes2 = shallowRef([]);
const rune1Selected = ref<number>(-1);   //选中的tag
const rune2Selected = ref<number>(-1);

const currentRune1 = ref<number>(-1); 
const currentRune2 = ref<number>(-1);


watch(() => sandTableData, () => {
  runes1.value = [];
  runes2.value = [];
  currentRune1.value = -1;
  currentRune2.value = -1;
  rune1Selected.value = -1;
  rune2Selected.value = -1;

  if(sandTableData && sandTableData.length > 0){
    sandTableData.forEach(data => {
      if(data.runeKey.includes("rune_level1")){
        runes1.value.push(data)
      }else if(data.runeKey.includes("rune_level2")){
        runes2.value.push(data)
      }
    })
  }

})


const handleRune1Selected = (index: number) => {
  if(rune1Selected.value === index){  //取消第一行tag选中后，第二行也要取消
    rune1Selected.value = -1;
    rune2Selected.value = -1;
  }else{
    rune1Selected.value = index;
  }
}

const handleRune2Selected = (index: number) => {
  if(rune1Selected.value === -1) return;  //只有选了第一行tag，才能选第二行
  if(rune2Selected.value === index){ 
    rune2Selected.value = -1;
  }else{
    rune2Selected.value = index
  }
}

const hasChanged = () => {
  return rune1Selected.value !== currentRune1.value ||
    rune2Selected.value !== currentRune2.value
}




const handleSubmit = () => {
  if(hasChanged()){
    const data = [];
    rune1Selected.value > -1 && data.push(runes1.value[rune1Selected.value]?.runeKey);
    rune2Selected.value > -1 && data.push(runes2.value[rune2Selected.value]?.runeKey);

    emit('changeRunesData', data) 
    currentRune1.value = rune1Selected.value;
    currentRune2.value = rune2Selected.value;
    
  }
}

</script>
<style scoped lang="scss">
.wrapper{
  background-color: white;
  padding: 10px;
  display: flex;
  
}

.sand-table{
  flex: 1;
  background: linear-gradient(#010101, #858686 40%, #858686);
  padding: 10px;
  .title{
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    span{
      float: right;
      padding-bottom: -2px;
      font-size: 13px;
      margin-right: 4px;
      color: #706e6f;
    }
  }
  .submit{
    margin-top: 10px;
    margin-bottom: 4px  ;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    width: 160px;
    background-color: #a60026;
    color: #ffffff;
    cursor: pointer;
    user-select: none;
    float: right;
    box-shadow: 0 3px 10px 1px #261a1d;

    &.disabled{
      cursor: not-allowed;
      background-color: #fab6b6;
      box-shadow: none;
    }
  }
}

.tags{
  display: flex;
  flex-direction: column;
  .tag{
    height: 100px;
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    .tag-title{
      height: 26px;
      line-height: 26px;
      width: 220px;
      background: linear-gradient(to right,rgba(184,0,44,1),rgba(184,0,44,0.4) 60%, rgba(184,0,44,0));
      padding-left: 6px;
      margin-bottom: 6px;
      svg{
        height: 12px;
      }
      span{
        color: #ffffff;
        font-size: 18px;
      }
    }
    .tag-tab{
      display: flex;
      flex: 1;
      
      &.shadow-blink{
        /* 初始阴影 */
        box-shadow: 0 0 10px rgba(255, 0, 0, 0);
        /* 动画设置 */
        animation: shadow-pulse 1.5s infinite;

        @keyframes shadow-pulse {
          0% {
            box-shadow: 0 0 6px rgba(255, 0, 0, 0); /* 透明 */
          }
          50% {
            box-shadow: 0 0 12px rgba(255 ,255,255, 0.8); /* 高亮 */
          }
          100% {
            box-shadow: 0 0 6px rgba(255, 0, 0, 0); /* 恢复透明 */
          }
        }
      }
      .tag-item{
        position: relative;
        user-select: none;
        cursor: pointer;
        flex: 1;
        background-color: #0f0e0e;
        border: 2px solid #555455;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .tag-info{
          color: #ffffff;
          margin-left: 40px;
        }
        &.right-item{
          border-left: none;
        }

        &.active{
          background: linear-gradient(to right,#191919, #970828);
          border: 2px solid;
          border-image: linear-gradient(to right, rgba(216,22,75, 0), rgba(216,22,75, 0) 20%, rgba(216,22,75, 1)) 1;  
          
        }

        .icon{
          background-color: #555655;
          color: #ffffff;
          height: 22px;
          width: 50px;
          border-radius: 10px;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          right: -25px;
          z-index: 100;
        }
      }
    }
  }
}
</style>
