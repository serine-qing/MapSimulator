<!-- 全息作战矩阵 -->
<template>
  <div class="wrapper">
    <div class="left">

      <div class="tags-container">
        <div class="title">基础</div>
        <div class="tags-box">

          <div class="tag-collection">

            <div class="background">
              <div class="fix"></div>
            </div>

            <div class="content">
              <div class="collection-type">
                <div class="icon"></div>
                <div class="text">FXD</div>
              </div>

              <div class="tag">
                <div class="hexagon-inner"></div>
              </div>
            </div>
          </div>

          <div
            class="tags-div"
            v-for="tag in baseTagsData"
          >
            <div 
              class="tag-collection or"
              v-if="'children' in tag"
            >

              <div class="background">
                <div class="fix"></div>
              </div>

              <div class="content">
                <div class="collection-type">
                  <div class="icon"></div>
                  <div class="text">OR</div>
                </div>

                <template v-for="(childTag, index) in tag.children">
                  <div 
                    class="tag"
                    v-if="childTag.active || tag.children.every(child => !child.active)"
                    :class="{active: childTag.active}"
                    style="font-size: 10px;"
                    @click="handleMergeTagClick(tag, index)"
                  >
                    <div style="font-size: 10px;" class="hexagon-inner">{{ childTag.key }}</div>
                    <!-- <div class="tag-score">???</div> -->
                  </div>

                  <div 
                    v-else
                    @click="handleMergeTagClick(tag, index)"
                    class="tag disable"
                  >
                    <div class="hexagon-inner">
                      <div class="tag-icon">互斥冲突</div>
                    </div>
                  </div>
                </template>
                

              </div>
            </div>
            <div 
              v-else
              class="tag"
              :class="{active: tag.active}"
              style="font-size: 10px;"
              
              @click="handleTagClick(tag)"
            >
              <div class="hexagon-inner">{{ tag.key }}</div>
            </div>

            

          </div>

        </div>
      </div>

      <div class="tags-container">
        <div class="title">附加</div>
        <div class="tags-box">

          <div
            class="tags-div"
            v-for="tag in extraTagsData"
          >
            <div 
              class="tag-collection or"
              v-if="'children' in tag"
            >

              <div class="background">
                <div class="fix"></div>
              </div>

              <div class="content">
                <div class="collection-type">
                  <div class="icon"></div>
                  <div class="text">OR</div>
                </div>

                <template v-for="(childTag, index) in tag.children">
                  <div 
                    class="tag"
                    v-if="childTag.active || tag.children.every(child => !child.active)"
                    :class="{active: childTag.active}"
                    style="font-size: 10px;"
                    @click="handleMergeTagClick(tag, index)"
                  >
                    <div style="font-size: 10px;" class="hexagon-inner">{{ childTag.key }}</div>
                    <!-- <div class="tag-score">???</div> -->
                  </div>

                  <div 
                    v-else
                    @click="handleMergeTagClick(tag, index)"
                    class="tag disable"
                  >
                    <div class="hexagon-inner">
                      <div class="tag-icon">互斥冲突</div>
                    </div>
                  </div>
                </template>
                

              </div>
            </div>
            <div 
              v-else
              class="tag"
              :class="{active: tag.active}"
              style="font-size: 10px;"
              
              @click="handleTagClick(tag)"
            >
              <div class="hexagon-inner">{{ tag.key }}</div>
            </div>

            

          </div>


        </div>
      </div>

      <span style="color: red; font-size: 14px;">词条为对地图隐藏怪组进行分析得出，可能有误，仅供参考！</span>
      
      <div 
        class="submit"
        @click="handleSubmit"
        :class="{disabled: !hasChanged()}"
      >确定</div>
    </div>
    <div class="right">
      <div class="description">
        <div class="title">指标·??????</div>

        <div 
          v-for="activeTag in activeTags"
          class="content"
        >
          <div 
            class="icon"
          >{{ activeTag.key }}</div>

          <div class="text">
            <p>{{ activeTag.desc }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
interface TagSGroup{
  key: string,               //tagsgroup名
  children: Tag[],
}

interface Tag{
  key: string,              //rune名
  group: string | null,     //分组名(or)
  desc: string,             //效果文字描述
  runes: any,                //rune效果
  active: boolean,          //是否激活 
}


import { getMatrixRunes } from '@/api/stages';
import { shallowRef, toRaw, watch } from 'vue';

const { levelId } = defineProps(["levelId"])
const emit = defineEmits(["changeCombatRunes"]);

const baseTagsData = shallowRef<(Tag | TagSGroup)[]>([]);
const extraTagsData = shallowRef<(Tag | TagSGroup)[]>([]);
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

const handleTagClick = (tag: Tag) => {
  tag.active = !tag.active;
  updateActiveTags();
}

const handleMergeTagClick = (mergeTag, index) => {
  const children = mergeTag.children;
  const currentActive = !children[index].active;

  currentActive && children.forEach(tag => tag.active = false);
  children[index].active = currentActive;

  updateActiveTags();
}

const parseRunesData = (runes: Tag[]): (Tag | TagSGroup)[] => {
  const data: (Tag | TagSGroup)[] = [];
  runes.forEach(rune => {
    rune.active = false;

    if(rune.group){
      const find = data.find(tag => tag.key === rune.group) as TagSGroup;
      if(find){

        find.children.push( rune )

      }else{

        data.push({
          key: rune.group,
          children: [ rune ]
        })

      }
    }else{
      data.push( rune )
    }

  });

  return data;
}

const regex = /[^/]+$/;
const getData = () => {
  const id = levelId.match(regex)[0];
  getMatrixRunes(id).then(res => {
    baseTagsData.value = parseRunesData(res.data.base);
    extraTagsData.value = parseRunesData(res.data.extra);
  })
}

//数据是否改变
const hasChanged = () => {
  return currentActiveTags.value.length !== activeTags.value.length ||
    currentActiveTags.value.find(tagKey => {
      const find = activeTags.value.find(tag => tag.key === tagKey);
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
    currentActiveTags.value = activeTags.value.map(activeTag => activeTag.key);
    emit('changeCombatRunes', toRaw(runes)) 
  }
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
</script>

<style scoped lang="scss">
$tag-height: 60px;
.wrapper{
  user-select: none;
  background-color: white;
  display: flex;
  min-height: 400px;
  .left{
    flex: 1;
    padding: 10px;
  }
  .right{
    width: 350px;
    background-color: #000000;
    padding: 6px;
  }
}

.tags-container{
  display: flex;
  padding-right: 10px;
  margin-bottom: 20px;
  min-height: 180px;
  .title{
    width: 24px;
    background-color: #8c0005;
    color: #ffffff;
    font-weight: bolder;
    font-size: 16px;
    line-height: 18px;
    text-align: center;
    padding-top: 20px;  
  }
  .tags-box{
    flex: 1;
    background: linear-gradient(to right, rgba(84,87,86,1), rgba(84,87,86,0) 50%, rgba(84,87,86,0));
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    .tags-div{
      height: $tag-height;
    }
  }
}

.tag-collection{
  position: relative; 
  height: $tag-height;
  &.or{
    .background{
      background-color: #757577;
      .fix{
        background-color: #fcfdfd;
      }
    }

    .content .collection-type .text{
      color: #cfd1d4;
    }
  }

  .background{
    position: absolute;
    top: calc(($tag-height - 20px) / 2);
    height: 20px;
    width: calc(100% - 20px);
    background-color: #2c2c2c;
    z-index: 0;
    .fix{
      width: 4px;
      height: 100%;
      background-color: #050505;
    }
  }

  .content{
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    padding-left: 16px;
    .collection-type{
      display: flex;
      flex-direction: column; 
      .icon{
        height: 28px;
      }
      .text{
        color: #f3f3f3;
        font-size: 20px;
        text-shadow: 0 0 5px #000000;
      }
    }
  }

}

.tag{
  position: relative;
  margin: 0 10px;
  cursor: pointer;
  filter: drop-shadow(0 0 8px rgba( 56,58,60, 1));
  .hexagon-inner{
    height: $tag-height;
    width: $tag-height - 8px;
    background-color: #a2a6a9;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);

    display: flex;
    justify-content: center;
    align-items: center;
    .tag-icon{
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }

  .tag-score{
    position: absolute;
    height: 15px;
    line-height: 15px;
    width: 22px;
    background: linear-gradient(to bottom, #050609, #454547 );
    right: 0;
    bottom: 0;
    border-radius: 2px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
  }

  &.active{
    filter: drop-shadow(0 0 8px rgba( 137,2,5, 1));
    .hexagon-inner{
      background-color: #ffffff;

    }
  }

  &.disable{
    filter: none;
    .hexagon-inner{
      background-color: #252525;
      .tag-icon{
        line-height: 16px;
        color: #545454;
        font-weight: bold;
      }
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
    text-align: center;
  }
  .content{
    margin-top: 20px;
    display: flex;
    .icon{
      margin-top: 3px;
      height: 24px;
      line-height: 24px;
      width: 50px;
      background-color: #eaecec;
      border-radius: 3px;
      font-size: 10px;
      text-align: center;
    }
    .text{
      flex: 1;
      color: #ffffff;
      p{
        margin: 0 6px;
      }
    }
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
</style>
