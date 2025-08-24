<!-- 全息作战矩阵 -->
<template>
  <div class="wrapper">
    <div class="left">

      <div style="opacity: 0.4; cursor:not-allowed;" class="tags-container">
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

          <div class="tag-collection or">

            <div class="background">
              <div class="fix"></div>
            </div>

            <div class="content">
              <div class="collection-type">
                <div class="icon"></div>
                <div class="text">OR</div>
              </div>

              <div class="tag active">
                <div class="hexagon-inner"></div>
                <div class="tag-score">3</div>
              </div>

              <div class="tag disable">
                <div class="hexagon-inner">
                  <div class="tag-icon">互斥冲突</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div class="tags-container">
        <div class="title">附加</div>
        <div class="tags-box">

          <div
            class="tags-div"
            v-for="tag in tagsData"
          >
            <div 
              v-if="!tag.children"
              class="tag"
              :class="{active: tag.active}"
              style="font-size: 10px;"
              
              @click="handleTagClick(tag)"
            >
              <div class="hexagon-inner">{{ tag.key }}</div>
            </div>

            <div 
              class="tag-collection or"
              v-else
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
            <p 
              v-for="enemy in activeTag.enemies"
            >额外出现{{ enemy.count }}个{{ enemy.name }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, toRaw, watch } from 'vue';

const { combatMatrixData, levelId } = defineProps(["combatMatrixData", "levelId"])
const emit = defineEmits(["changeCombatRunes"]);

const tagsData = ref([]);
const activeTags = ref([]);
const currentActiveTags = ref([]);   //当前游戏应用的tags，用于检测改变

const updateActiveTags = () => {
  activeTags.value = [];
  tagsData.value.forEach(tag => {
    if(tag.children){
      tag.children.forEach(child => {
        child.active && activeTags.value.push(child);
      });
    }else{
      tag.active && activeTags.value.push(tag)
    }
  });
}

const handleTagClick = (tag) => {
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

const parseData = () => {
  const regex = /(.+?)([1-9])$/;
  const regex2 = /(.+?)(base|high)$/;
  combatMatrixData?.forEach(data => {
    if(data.key === "before") return;
    const enemies = {};
    data.enemies.forEach(enemy => {

      if(!enemies[enemy.key]){
        enemies[enemy.key] = {
          name: enemy.name,
          count: 1
        };
      }else{
        enemies[enemy.key].count ++;
      }
    })

    const match = data.key.match(regex);
    const match2 = data.key.match(regex2);
    let mergeKey;
    if(match || match2){
      mergeKey = match? match[1] : match2[1];
    }

    if(data.key.includes("dpshld")){
      mergeKey = "dpshld";
    }

    if(mergeKey){
      const find = tagsData.value.find(data => data.mergeKey === mergeKey);

      if(find){

        find.children.push({
          key: data.key,
          enemies,
          active: false
        })

        find.children.sort((a ,b) => {
          return parseInt(a.key.replace(mergeKey, "")) - parseInt( b.key.replace(mergeKey, ""));
        })

      }else{

        tagsData.value.push({
          mergeKey,
          children:[{
            key: data.key,
            enemies,
            active: false
          }]
        })
      }
    }else{
      tagsData.value.push({
        key: data.key,
        enemies,
        active: false
      })
    }

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
    
    currentActiveTags.value = activeTags.value.map(activeTag => activeTag.key);
    emit('changeCombatRunes', toRaw(currentActiveTags.value)) 
  }
}

let currentLevelId;
watch(() => combatMatrixData, () => {
  
  if(currentLevelId !== levelId){
    currentLevelId = levelId;
    tagsData.value = [];
    activeTags.value = [];
    currentActiveTags.value = [];
    parseData();
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
    top: calc($tag-height - 20px) / 2;
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
