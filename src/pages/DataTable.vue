<template>
<div class="data-table">
  <el-table 
    :data="enemyDatas" 
    border 
    style="width: 100%"
    align="center"
  >
    <el-table-column align="center" prop="name" label="头像" width="70">
      <template #default="scope">
        <div class="icon">
          <img :src="scope.row.icon" :alt="scope.row.name">
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="name" label="名称"  width="100"/>
    <el-table-column align="center" prop="count" label="数量" width="60" />
    
    <el-table-column align="center" prop="levelType" label="地位">
      <template #default="scope">
        <div>
          {{ levelType[scope.row.levelType] }}
        </div>
      </template>
    </el-table-column>

    <el-table-column align="center" prop="level" label="级别" width="60"/>

    <el-table-column 
      v-for="(name, key) in attrColumns"
      align="center" 
      :label="name"
    >

      <template #default="scope">
        <el-tooltip
          v-if="!!scope.row.attrChanges[key]"
          effect="dark"
          :content="getAttrChange( name, scope.row.attrChanges[key])"
          placement="top"
          raw-content
        >
          <div class="active">
            {{ 
              key === "rangeRadius"? 
                scope.row.attributes[key] > 0 ? scope.row.attributes[key]: "—"
                : scope.row.attributes[key] 
            }}
          </div>
        </el-tooltip>
        
        <div v-else>
          {{ 
            key === "rangeRadius"? 
              scope.row.attributes[key] > 0 ? scope.row.attributes[key]: "—"
              : scope.row.attributes[key] 
          }}
        </div>
      </template>
    </el-table-column>

    <el-table-column 
      align="center" 
      label="攻击间隔"
    >

      <template #default="scope">
        <el-tooltip
          v-if="!!scope.row.attrChanges['attackSpeed']"
          effect="dark"
          :content="getAttrChange( '攻击速度', scope.row.attrChanges['attackSpeed'])"
          placement="top"
          raw-content
        >
          <div class="active">
            {{ 
              parseFloat( 
                (scope.row.attributes['baseAttackTime'] * 100 /  scope.row.attributes['attackSpeed']).toFixed(3) 
              )
            }}
          </div>
        </el-tooltip>
        
        <div v-else>
          {{ 
            scope.row.attributes['baseAttackTime']
          }}
        </div>
      </template>
    </el-table-column>

    <el-table-column align="center" prop="lifePointReduce" label="目标价值"/>
  </el-table>
</div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const levelType = {
  NORMAL: "普通",
  ELITE: "精英",
  BOSS: "领袖",
}

const attrColumns = {
  maxHp: "生命值",
  atk: "攻击力",
  def: "防御力",
  magicResistance: "法术抗性",
  massLevel: "重量等级",
  moveSpeed: "移动速度",
  rangeRadius: "攻击范围"
}

const {enemyDatas} = defineProps(["enemyDatas"]);


const getAttrChange = (name, attrChange): string => {
  let res = "";
  
  attrChange?.forEach(item => {
    const {type, value} = item;
    
    //todo 冗余代码太多 需要统一化 提升和降低的判断要相对于原本数值
    const updown = value >= 1 ? "提升" : "降低";
    const color = value >= 1 ? "red" : "blue";
    let val;
    switch (name) {
      case "法术抗性":
      case "重量等级":
        val = value;
        break;
    
      default:
        val = parseFloat( 
          (value * 100).toFixed(4) 
        ) + "%";
        break;
    }
    
    res += "<p>"
    switch (type) {
      case "FOUR_STAR":
        res += `突袭${name}${updown}:`
        break;
    
      default:
        res += `通用${name}${updown}:`
        break;
    }
    res += `<span style = 'color:${color}'>    ${val}</span></p>`;
    
  });
  return res;
}

</script>

<style lang="scss" scoped>
.data-table{
  padding: 10px;
  margin-bottom: 20px;
  background-color: white;
  .icon{
    height: 50px;
    width: 50px;
    img{
      height: 100%;
      width: 100%;
    }
  }
  .active{
    color: red;
    cursor: pointer;
  }
}
</style>