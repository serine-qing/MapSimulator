<template>
<div class="tags-box">
  <div
    class="tags-div"
    v-for="tag in tagsData"
  >
    <div 
      class="tag-collection"
      v-if="'type' in tag && tag.runeId === 'base'"
    >

      <div class="background">
        <div class="fix"></div>
      </div>

      <div class="content">
        <div class="collection-type">
          <div class="text">FXD</div>
        </div>

        <div 
          class="tag"
          :class="{active: tag.active}"
          @click="emit('handleTagClick', tag)"
        >
          <div class="hexagon-inner">
            <img
              v-if="tag.runeIcon"
              :src="tag.runeIcon"
            />
            <span v-else>{{ tag.runeId }}</span>
          </div>
          <div 
            v-if="tag.points"
            class="tag-score"
          >{{tag.points}}</div>
        </div>

      </div>
    </div>

    <div 
      class="tag-collection or"
      v-else-if="'children' in tag"
    >

      <div class="background">
        <div class="fix"></div>
      </div>

      <div class="content">
        <div class="collection-type">
          <div class="text">OR</div>
        </div>

        <template v-for="(childTag, index) in tag.children">
          <div 
            class="tag"
            v-show="childTag.active || tag.children.every(child => !child.active)"
            :class="{active: childTag.active}"
            @click="emit('handleMergeTagClick', tag, index)"
          >
            <div class="hexagon-inner">
              <img
                v-if="childTag.runeIcon"
                :src="childTag.runeIcon"
              />
              <span v-else>{{ childTag.runeId }}</span>
            </div>
            <div 
              v-if="childTag.points"
              class="tag-score"
            >{{childTag.points}}</div>
          </div>

          <div 
            v-show="!childTag.active && tag.children.find(child => child.active)"
            @click="emit('handleMergeTagClick', tag, index)"
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
      @click="emit('handleTagClick', tag)"
    >
      <div class="hexagon-inner">
        <img
          v-if="tag.runeIcon"
          :src="tag.runeIcon"
        />
        <span v-else>{{ tag.runeId }}</span>
      </div>
      <div 
        v-if="tag.points"
        class="tag-score"
      >{{tag.points}}</div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
const { tagsData } = defineProps(["tagsData"])
const emit = defineEmits(["handleTagClick", "handleMergeTagClick"])

</script>

<style lang="scss" scoped>
$tag-height: 60px;
.tags-box{
  flex: 1;
  background: linear-gradient(to right, rgba(84,87,86,1), rgba(84,87,86,0) 50%, rgba(84,87,86,0));
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px 0;
  .tags-div{
    height: $tag-height;
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
    img{
      height: 40px;
    }
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
    right: -2px;
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
      img{
        filter: invert(100%); //图片反色
      }
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
</style>