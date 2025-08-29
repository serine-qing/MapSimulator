<!-- 全息作战矩阵 -->
<template>
  <div class="wrapper">
    <div class="left">

      <div class="tags-container">
        <div class="title">
          <img src="@/assets/images/recalrune/icon_rune_head_essential.png">
          基础
        </div>
        
        <Tags
          :tagsData = "baseTagsData"
          @handleTagClick = "handleBaseTagClick"
          @handleMergeTagClick = "handleBaseMergeTagClick"
        />
      </div>

      <div class="tags-container">
        <div class="title">
          <img src="@/assets/images/recalrune/icon_rune_head_rewarding.png">
          附加
        </div>
        
        <Tags
          :tagsData = "extraTagsData"
          @handleTagClick = "handleTagClick"
          @handleMergeTagClick = "handleMergeTagClick"
        />
      </div>

      
      
      <div class="toolbar">
        <div class="score">
          <img src="@/assets/images/recalrune/rate_dissolve_a.png">
          <span class="str">当前评分</span>
          <span class="num">{{ score }}</span>
        </div>
        <div class="btns">
          <div 
            class="clear"
            @click="clear"
          >
            <img src="@/assets/images/recalrune/button_clear.png">
          </div>
          <div 
            class="submit"
            @click="handleSubmit"
            :class="{disabled: !hasChanged()}"
          >确定</div>
        </div>
      </div>
      
    </div>

    <div 
      class="right "
    >
      <div class="description">
        <div class="title">
          <img src="@/assets/images/recalrune/icon_rune_head_essential.png">
          {{fixedRuneSeriesName}}
        </div>

        <Desc
          :activeTags = "activeTags"
          :essential = "true"
        />

      </div>

      <div 
        class="description"
        style="margin-top: 20px;"
      >
        <div class="title">
          <img src="@/assets/images/recalrune/icon_rune_head_rewarding.png">
          附加条件
        </div>

        <Desc
          :activeTags = "activeTags"
          :essential = "false"
        />
        

      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
interface TagSGroup{
  groupKey: string,               //tagsgroup名
  children: Tag[],
}

interface Tag{
  runeId: string,              //rune名
  type: string,             //fxd：必点 or：多选一
  essential: boolean,         //是否必选
  exclusiveGroupId: string | null,     //分组名(or)
  description: string,             //效果文字描述
  runes: any,                //rune效果
  active: boolean,          //是否激活 
  points?: number,           //分数
  runeIcon: string,            //图片url
}

import { ElNotification } from 'element-plus';
import Desc from './CombatMatrix/Desc.vue';
import Tags from './CombatMatrix/Tags.vue';

import { getRecalRunes } from '@/api/stages';
import { computed, ref, shallowRef, toRaw, watch } from 'vue';

const { levelId } = defineProps(["levelId"])
const emit = defineEmits(["changeCombatRunes"]);

const fixedRuneSeriesName = ref("");
const baseTagsData = ref<(Tag | TagSGroup)[]>([]);
const extraTagsData = ref<(Tag | TagSGroup)[]>([]);
const activeTags = shallowRef<Tag[]>([]);
const currentActiveTags = shallowRef<string[]>([]);   //当前游戏应用的tags，用于检测改变

const updateActiveTags = () => {
  activeTags.value = [];

  [...baseTagsData.value, ...extraTagsData.value].forEach(tag => {
    if( "children" in tag ){
      tag.children.forEach(child => {
        child.active && activeTags.value.push(child);
      });
    }else{
      tag.active && activeTags.value.push(tag)
    }
  });

}

const showWarning = () => {
  ElNotification({
    title: '',
    message: '基础指标无法取消选中',
    type: 'info',
    duration: 2000
  })
}

//基础tag不能取消
const handleBaseTagClick = (tag: Tag) => {
  showWarning();
}

//至少要点一个
const handleBaseMergeTagClick = (mergeTag, index) => {
  const tag = mergeTag.children[index];
  if(tag && !tag.active){
    handleMergeTagClick(mergeTag, index);
  }else{
    showWarning();
  }
  
}

let activeDom;
let clearShadow;
//右侧详情跳转到当前选中tag
const scrollGotoActiveTag = (tag: Tag) => {
  if(tag.active){
    requestAnimationFrame(() => {
      activeDom = document.querySelector(`#${tag.runeId}`);
      activeDom.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
      activeDom.classList.add("tagdesc-white-shadow");

      clearShadow = setTimeout(() => {
        activeDom.classList.remove("tagdesc-white-shadow");
      }, 3000);
    })
  }
}

const handleTagClick = (tag: Tag) => {
  if(clearTimeout){
    clearTimeout(clearShadow);
    activeDom?.classList?.remove("tagdesc-white-shadow");
  }

  tag.active = !tag.active;
  updateActiveTags();
  scrollGotoActiveTag(tag);
  
}

const handleMergeTagClick = (mergeTag, index) => {
  if(clearTimeout){
    clearTimeout(clearShadow);
    activeDom?.classList?.remove("tagdesc-white-shadow");
  }
  
  const children = mergeTag.children;
  const currentActive = !children[index].active;

  currentActive && children.forEach(tag => tag.active = false);
  children[index].active = currentActive;

  updateActiveTags();
  scrollGotoActiveTag(children[index]);

}

const parseRunesData = (runes: Tag[]): (Tag | TagSGroup)[] => {
  const data: (Tag | TagSGroup)[] = [];
  runes.forEach(rune => {
    rune.active = false;

    if(rune.runeIcon){
      rune.runeIcon = "/recalruneTags/" + rune.runeIcon + ".png";
    }else{
      rune.runeIcon = "/recalruneTags/fixed_rune_icon.png";
    }

    if(rune.exclusiveGroupId){
      rune.type = "or";

      const find = data.find(tag => {
        if("groupKey" in tag && tag.groupKey === rune.exclusiveGroupId){
          return true;
        }
      }) as TagSGroup;
      
      if(find){
        find.children.push( rune )

      }else{
        data.push({
          groupKey: rune.exclusiveGroupId,
          children: [ rune ]
        })

      }
    }else{
      data.push( rune )
    }

  });

  data.forEach((rune, index) => {
    if("children" in rune && rune.children.length === 1){
      data[index] = rune.children[0];
      data[index].type = null;
    }
  })

  return data;
}

//清空
const clear = () => {
  extraTagsData.value.forEach(tag => {
    if("children" in tag){
      tag.children.forEach(t => t.active = false);
    }else{
      tag.active = false;
    }
    
  })

  updateActiveTags();
}

//数据是否改变
const hasChanged = ():boolean => {
  return currentActiveTags.value.length !== activeTags.value.length ||
    !!currentActiveTags.value.find(runeId => {
      const find = activeTags.value.find(tag => tag.runeId === runeId);
      return !find;
    })
}

//提交更改
const handleSubmit = () => {
  if(hasChanged()){
    const runes = [];
    activeTags.value.forEach(tag => {
      tag.runes.forEach(rune => {
        runes.push(rune);
      })
    })
    currentActiveTags.value = activeTags.value.map(activeTag => activeTag.runeId);
    emit('changeCombatRunes', toRaw(runes)) 
  }
}

const clickDefaultRunes = () => {
  baseTagsData.value.forEach(tags => {
    if("children" in tags){
      tags.children[0].active = true;
  
    }else{
      tags.active = true;
    }
  })

  updateActiveTags();
}

const regex = /[^/]+$/;
const getData = () => {
  const id = levelId.match(regex)[0];
  getRecalRunes(id).then(res => {
    const { parsedRunes} = res.data;
    fixedRuneSeriesName.value = res.data.fixedRuneSeriesName;
    const baseTags = parsedRunes.filter(parsedRune => parsedRune.essential);
    const extraTags = parsedRunes.filter(parsedRune => !parsedRune.essential);
    baseTagsData.value = parseRunesData(baseTags);
    extraTagsData.value = parseRunesData(extraTags);

    clickDefaultRunes();
    handleSubmit();
  })
}

watch(() => levelId, () => {
  baseTagsData.value = [];
  extraTagsData.value = [];
  activeTags.value = [];
  currentActiveTags.value = [];
  if(
    levelId.includes("obt/recalrune") ||
    levelId.includes("obt/crisis")
  ){
    getData();
  }

})

//总分数
const score = computed(() => {
  let _score = 0;
  activeTags.value.forEach(tag => {
    if(tag.active && tag.points){
      _score += tag.points;
    }
  })

  return _score;
})

</script>

<style scoped lang="scss">
.wrapper{
  user-select: none;
  background-color: white;
  display: flex;
  min-height: 500px;
  .left{
    flex: 1;
  }
  .right{
    height: 600px;
    overflow: auto;
    width: 350px;
    background-color: #000000;
    padding: 6px;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #8b8b8b;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #8b8b8b;
    }
  }
}

.tags-container{
  display: flex;
  padding-right: 10px;
  margin: 5px;
  margin-bottom: 20px;
  min-height: 150px;
  .title{
    width: 24px;
    background-color: #8c0005;
    color: #ffffff;
    font-weight: bolder;
    font-size: 16px;
    line-height: 18px;
    text-align: center;
    padding-top: 10px;  
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      width: 30px;
    }
  }

}

.description{
  display: flex;
  flex-direction: column;
  .title{
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    background-color: #9e0004;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 30px;
    }
  }
}

.toolbar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  background-color: #000000;
  padding: 10px;
  .score{
    display: flex;
    align-items: center;
    padding-left: 10px;
    img{
      height: 30px;
    }
    .str{
      color: #8d8d8d;
      font-size: 12px;
      margin-left: 10px ;
    }
    .num{
      font-size: 36px;
      line-height: 30px;
      margin-top: -4px;
      color: #ececec;
      margin-left: 24px;
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .hint{
      margin-right: 20px;
      color: red; 
      font-size: 14px;
    }
    .clear{
      cursor: pointer;
      height: 40px;
      margin-right: 20px;
    }
    .submit{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 160px;
      background-color: #a60026;
      color: #ffffff;
      cursor: pointer;
      user-select: none;
      float: right;
      box-shadow: 0 3px 10px 1px #261a1d;
      font-size: 22px;
      line-height: 40px;
      &.disabled{
        cursor: not-allowed;
        background-color: #fab6b6;
        box-shadow: none;
      }
    }
  }
  
}

</style>
