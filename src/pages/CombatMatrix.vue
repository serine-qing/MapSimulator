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
    </div>
    <div class="right">
      <div class="description">
        <div class="title">指标·死而不朽</div>
        <div class="content">
          <div class="icon"></div>
          <div class="text">
            <p>< 爱国者 >不再等待</p>
            <p>< 爱国者 >行军姿态受到来自非阻挡单位的物理与法术伤害减少90%，被阻挡较长时间该效果逐渐降低至0%，直到脱离阻挡</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>


</script>
<style scoped lang="scss">
$tag-height: 60px;
.wrapper{
  user-select: none;
  height: 500px;
  background-color: white;
  display: flex;
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
  height: 140px;
  display: flex;
  padding-right: 10px;
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
    top: ($tag-height - 20px) / 2;
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
      height: 24px;
      width: 50px;
      background-color: #eaecec;
      border-radius: 3px;
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


</style>
