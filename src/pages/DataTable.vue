<template>
<div class="data-table">
  <el-table 
    :data="enemyDatas" 
    border 
    style="width: 100%"
    align="center"
  >
    <el-table-column align="center" :label="$t('table.Avatar')" width="70">
      <template #default="scope">
        <div class="icon">
          <img :src="scope.row.icon" :alt="scope.row.name" onerror="this.src='/placeholder.png'">
        </div>
      </template>
    </el-table-column> 
    <el-table-column align="center" prop="name" :label="$t('table.Name')"  width="100"/>
    <el-table-column sortable align="center" prop="count" :label="$t('table.Quantity')" width="60" />
    
    <el-table-column sortable align="center" prop="levelType" :label="$t('table.Type')" width="60">
      <template #default="scope">
        <div>
          {{ levelType[scope.row.levelType] }}
        </div>
      </template>
    </el-table-column>

    <el-table-column sortable align="center" prop="level" :label="$t('table.Level')" width="60"/>

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
      :label="$t('attr.AttackInterval')" 
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

    <el-table-column sortable align="center" prop="lifePointReduce" :label="$t('attr.TargetValue')"  width="70"/>
    <el-table-column sortable align="center" prop="lifePointReduce" :label="$t('table.ViewDetails')">
      <template #default="scope">
        <span 
          class="detail-link"
          @click="showDetail(scope.row)"
        >{{$t('table.Details')}}</span>
      </template>
    </el-table-column>
  </el-table>
</div>

<el-dialog v-model="dialogVisible" width="800">
  <template #header="{ close, titleId, titleClass }">
    <div>
      <span>{{dialogData.name}}</span >
      <span class="title-level">{{ $t('table.Level') + dialogData.level}}</span>
    </div>
  </template>
  <el-descriptions
    direction="vertical"
    border
  >
    <el-descriptions-item
      :rowspan="2"
      :width="140"
      :label="$t('table.Avatar')"
      align="center"
    >
      <el-image
        style="width: 100px; height: 100px"
        :src="dialogData.icon"

      >
        <template #error>
          <img style="height: 100%; width: 100%;" src="/placeholder.png">
        </template>
      </el-image>
    </el-descriptions-item>
    <el-descriptions-item :label="$t('attr.HP')">{{ dialogData.attributes.maxHp }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.ATK')">{{ dialogData.attributes.atk }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.DEF')">{{ dialogData.attributes.def }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.RES')">{{ dialogData.attributes.magicResistance }}</el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    direction="vertical"
    border
  >
    <el-descriptions-item :label="$t('attr.WeightClass')">{{ dialogData.attributes.massLevel }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.Speed')">{{ dialogData.attributes.moveSpeed }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.AttackRange')">{{ dialogData.attributes.rangeRadius }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.AttackInterval')">{{ 
      accuracyNum(dialogData.attributes['baseAttackTime'] * 100 /  dialogData.attributes['attackSpeed'])  
    }}</el-descriptions-item>
    <el-descriptions-item :label="$t('attr.TargetValue')">{{ dialogData.lifePointReduce }}</el-descriptions-item>
    <el-descriptions-item :label="$t('table.Type')">{{ levelType[dialogData.levelType] }}</el-descriptions-item>
    <el-descriptions-item :label="$t('table.Ability')">
      <div v-if="dialogData.abilityList?.length > 0">
        <p class="ability-line" v-for="(ability, index) in dialogData.abilityList">
          <span class="pre" v-if="ability.textFormat === 'NORMAL'">·</span>
          <span class="pre" v-else-if="ability.textFormat === 'SILENCE'">※</span>
          <span :class="{ title : ability.textFormat === 'TITLE' }">
            {{ ability.text.replace(/<[\$\@][\s\S\@]*?\/?>|<\/>/g, '') }}
          </span>
        </p>
      </div>
      <div v-else>
        {{$t('info.None')}}
      </div>
      
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
    direction="vertical"
    border
  >
    <el-descriptions-item :label="$t('attr.StatusRES')">
      <div v-if="dialogData.immunes.length > 0">
        <el-tag 
          v-for="(immune, index) in dialogData.immunes"
          :key="index"
          size="large"
          class="immune-tag"
        >{{immuneTable[immune]}}</el-tag>
      </div>

      <div v-else>{{$t('info.None')}}</div>
    </el-descriptions-item>
  </el-descriptions>

  <h3>{{$t('table.Parameters')}}</h3>
  <JsonViewer :value="jsonShow" copyable expanded boxed theme="light" :expandDepth="4"/>
</el-dialog>
</template>

<script setup lang="ts">
import eventBus from '@/components/utilities/EventBus';
import { immuneTable } from '@/type/Interface';
import { accuracyNum } from '@/components/utilities/utilities';
import { ref, shallowRef } from 'vue';

import {JsonViewer} from "vue3-json-viewer"
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const levelType = {
  NORMAL: t("table.Normal"),
  ELITE: t("table.Elite"),
  BOSS: t("table.BOSS"),
}

const attrColumns = {
  maxHp: t("attr.HP"),
  atk: t("attr.ATK"),
  def: t("attr.DEF"),
  magicResistance: t("attr.RES"),
  massLevel: t("attr.WeightClass"),
  moveSpeed: t("attr.Speed"),
  rangeRadius: t("attr.AttackRange")
}

const {enemyDatas} = defineProps(["enemyDatas"]);


const getAttrChange = (name, attrChange): string => {
  let res = "";
  
  attrChange?.forEach(item => {
    const {value, calMethod} = item;

    let updown = value >= 1 || calMethod === "addmul" ? t("info.Increase") : t("info.Decrease");
    const color = value >= 1 || calMethod === "addmul" ? "red" : "blue";
    let val;

    if( calMethod === "add"){
      val = value;
    }else if(calMethod === "mul"){
      updown += t("info.to");
      val = accuracyNum(value * 100) + "%";
    }else if(calMethod === "addmul"){
      val = accuracyNum(value * 100) + "%";
    }
    
    res += "<p>"
    res += `${name}${updown}:`
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

const jsonShow = shallowRef({
  talents: null,
  skills: null,
  animations: null,
  finalAttributes: null,
  buffs: null,
  countdown: null,
});

eventBus.on("showDetail", (data) => {
  jsonShow.value.talents = data.talents;
  jsonShow.value.skills = data.skills;
  jsonShow.value.animations = data.animations;
  jsonShow.value.finalAttributes = data.finalAttributes;
  jsonShow.value.buffs = data.buffs;
  jsonShow.value.countdown = data.countdown.timers;

  console.log(data)
  showDetail(data.enemyData);
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