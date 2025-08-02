<template>
<div class="data-table">
  <el-table 
    :data="enemyDatas" 
    border 
    style="width: 100%"
    align="center"
  >
    <el-table-column align="center" label="头像" width="70">
      <template #default="scope">
        <div class="icon">
          <img :src="scope.row.icon" :alt="scope.row.name">
        </div>
      </template>
    </el-table-column> 
    <el-table-column align="center" prop="name" label="名称"  width="100"/>
    <el-table-column sortable align="center" prop="count" label="数量" width="60" />
    
    <el-table-column sortable align="center" prop="levelType" label="地位" width="60">
      <template #default="scope">
        <div>
          {{ levelType[scope.row.levelType] }}
        </div>
      </template>
    </el-table-column>

    <el-table-column sortable align="center" prop="level" label="级别" width="60"/>

    <el-table-column 
      v-for="(name, key) in attrColumns"
      width="80"
      align="center" 
      :label="name"
      sortable
      :sort-by = "'attributes.' + key"
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
      sortable
      :sort-method="attackSpeedSort"
      width="80"
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
              accuracyNum(scope.row.attributes['baseAttackTime'] * 100 /  scope.row.attributes['attackSpeed']) 
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

    <el-table-column sortable align="center" prop="lifePointReduce" label="目标价值" width="70"/>
    <el-table-column sortable align="center" prop="lifePointReduce" label="查看详情">
      <template #default="scope">
        <span 
          class="detail-link"
          @click="showDetail(scope.row)"
        >详情</span>
      </template>
    </el-table-column>
  </el-table>
</div>

<el-dialog v-model="dialogVisible" width="800">
  <template #header="{ close, titleId, titleClass }">
    <div>
      <span>{{dialogData.name}}</span >
      <span class="title-level">{{ "级别" + dialogData.level}}</span>
    </div>
  </template>
  <el-descriptions
    direction="vertical"
    border
  >
    <el-descriptions-item
      :rowspan="2"
      :width="140"
      label="头像"
      align="center"
    >
      <el-image
        style="width: 100px; height: 100px"
        :src="dialogData.icon"
      />
    </el-descriptions-item>
    <el-descriptions-item label="生命值">{{ dialogData.attributes.maxHp }}</el-descriptions-item>
    <el-descriptions-item label="攻击力">{{ dialogData.attributes.atk }}</el-descriptions-item>
    <el-descriptions-item label="防御力">{{ dialogData.attributes.def }}</el-descriptions-item>
    <el-descriptions-item label="法术抗性">{{ dialogData.attributes.magicResistance }}</el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    direction="vertical"
    border
  >
    <el-descriptions-item label="重量等级">{{ dialogData.attributes.massLevel }}</el-descriptions-item>
    <el-descriptions-item label="移动速度">{{ dialogData.attributes.moveSpeed }}</el-descriptions-item>
    <el-descriptions-item label="攻击范围">{{ dialogData.attributes.rangeRadius }}</el-descriptions-item>
    <el-descriptions-item label="攻击间隔">{{ 
      accuracyNum(dialogData.attributes['baseAttackTime'] * 100 /  dialogData.attributes['attackSpeed'])  
    }}</el-descriptions-item>
    <el-descriptions-item label="目标价值">{{ dialogData.lifePointReduce }}</el-descriptions-item>
    <el-descriptions-item label="地位">{{ levelType[dialogData.levelType] }}</el-descriptions-item>
    <el-descriptions-item label="能力">
      <div v-if="dialogData.abilityList?.length > 0">
        <p class="ability-line" v-for="(ability, index) in dialogData.abilityList">
          <span class="pre" v-if="ability.textFormat === 'NORMAL'">·</span>
          <span class="pre" v-else-if="ability.textFormat === 'SILENCE'">※</span>
          <span :class="{ title : ability.textFormat === 'TITLE' }">
            {{ ability.text.replace(/<\$[\s\S]*?\/?>|<\/>/g, '') }}
          </span>
        </p>
      </div>
      <div v-else>
        无
      </div>
      
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    direction="vertical"
    border
  >
    <el-descriptions-item label="异常抗性">
      <div v-if="dialogData.immunes.length > 0">
        <el-tag 
          v-for="(immune, index) in dialogData.immunes"
          :key="index"
          size="large"
          class="immune-tag"
        >{{immuneTable[immune]}}</el-tag>
      </div>

      <div v-else>无</div>
    </el-descriptions-item>
  </el-descriptions>
</el-dialog>
</template>

<script setup lang="ts">
import eventBus from '@/components/utilities/EventBus';
import { immuneTable } from '@/components/utilities/Interface';
import { accuracyNum } from '@/components/utilities/utilities';
import { ref } from 'vue';

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
    const {type, value, calMethod} = item;
    
    const updown = value >= 1 ? "提升" : "降低";
    const color = value >= 1 ? "red" : "blue";
    let val;

    if( calMethod === "add"){
      val = value;
    }else if(calMethod === "mul"){
      val = accuracyNum(value * 100) + "%";
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

//攻速排序方法
const attackSpeedSort = (a, b) => {
  const speedA = a.attributes.baseAttackTime / a.attributes.attackSpeed;
  const speedB = b.attributes.baseAttackTime / b.attributes.attackSpeed;
  return speedA - speedB;
}

const dialogVisible = ref(false);
const dialogData = ref<EnemyData>(({} as EnemyData));

//展示详情
const showDetail = (data) => {
  dialogVisible.value = true;
  dialogData.value = data;
}

eventBus.on("showDetail", (data) => {
  showDetail(data);
})
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

.detail-link{
  color: #409eff; 
  cursor: pointer;
  &:hover{
    color: rgb(121, 187, 255);
  }
}

.title-level{
  margin-left: 6px;
  color: #0048ef;
}

.immune-tag{
  margin-right: 5px;
}

.ability-line{
  display: flex;
  .pre{
    font-size: 16px;
    font-weight: bolder;
  }
  .title{
    font-weight: bolder;
    font-size: 20px;
    color: #d63131;
  }
}
</style>