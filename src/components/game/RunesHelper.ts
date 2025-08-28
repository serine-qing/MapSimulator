import { accuracyNum, toCamelCase } from "@/components/utilities/utilities"
import TileManager from "./TileManager";
import Tile from "./Tile";
import act42side from "../entityHandler/众生行记";

class RunesHelper{
  private runes: any[];
  private enemyGroupEnable: string[] = [];       //额外出现某组敌人
  private enemyGroupDisable: string[] = [];      //移除某组敌人
  private enemyChanges: { [ key:string ] : string } = {};      //移除某组敌人
  public attrChanges: { [ key:string ] : any } = {};     //敌人属性提升
  private predefinesEnable: {[key: string]: boolean} = {};  //装置修改
  private bannedTiles: Vec2[] = [];
  private talentChanges: any[] = [];

  public charNumDdd: number = 0;
  public squadNum: number = 13;
  constructor(runes: any){
    this.runes = runes;

    const addOtherRuneBlackbord = [];
    this.runes.forEach(rune => {

      act42side.parseRune(rune)

      const { blackboard } = rune;

      switch (rune.key) {
      
        case "level_hidden_group_enable":
          this.enemyGroupEnable = [
            ...blackboard.map( i => i.valueStr),
            ...this.enemyGroupEnable
          ]
          break;
        
        case "level_hidden_group_disable":
          this.enemyGroupDisable = [
            ...blackboard.map( i => i.valueStr),
            ...this.enemyGroupDisable
          ]
          break; 

        //敌人更换
        case "level_enemy_replace":
          const changeFrom = blackboard[0].valueStr;
          const changeTo = blackboard[1].valueStr;
          this.enemyChanges[changeFrom] = changeTo;
        
        //敌人属性修改
        case "enemy_attribute_mul":
        case "ebuff_attribute":
        case "enemy_attribute_add":
        case "enemy_attackradius_mul":
        case "ebuff_attack_radius":     //全体攻击范围改变
        case "enemy_weight_add":
        case "ebuff_weight":   //全体重量改变
        case "enemy_attribute_additive_mul":  //todo 这个不知道乘算还是加算

          this.getAttrChanges(rune);

          break;
        
        //ban格子
        case "global_forbid_location":
          blackboard.forEach( item => {
            const vecArr = item.valueStr.split("|");
            vecArr.forEach(_vec => {
              const vec = _vec
                .replace("(","")
                .replace(")","")
                .split(",")
              this.bannedTiles.push({
                x: vec[1],
                y: vec[0],
              })
            })

          })
          break;

        //地图装置修改
        case "level_predefines_enable":
          blackboard.forEach( item => {
            this.predefinesEnable[item.key] = !!item.value;
          })
          break;
        
        //todo tile修改
        case "map_tile_blackb_add":
          break;

        //单位再部署时间增加
        case "char_respawntime_add":
        case "char_respawntime_mul":
          break;
        
        //敌人天赋修改
        case "enemy_talent_blackb_add":
        case "enemy_talent_blackb_mul":
        case "enemy_talent_blackb_max":
          const change = {}; 
          blackboard.forEach(item => {
            
            switch (item.key) {
              case "enemy":
              case "key":       //MT-S-5 enemy填成key了
                change["enemy"] = item.valueStr.split("|");
                break;
              default:
                change[item.key] = item.valueStr? item.valueStr:item.value;
                break;
            }
          })

          switch (rune.key) {
            case "enemy_talent_blackb_add":
              change["calMethod"] = "add";
              break;
            case "enemy_talent_blackb_mul":
              change["calMethod"] = "mul";
              break;
            case "enemy_talent_blackb_max":
              change["calMethod"] = "set";
              break;
          }

          this.talentChanges.push(change);
          break;

        //沙盘推演会用到，修改rune值的
        case "add_other_rune_blackb":
          addOtherRuneBlackbord.push(rune);
          break;

        //增减部署位
        case "global_placable_char_num_add":
          this.charNumDdd += blackboard[0].value;
          break;

        //更改可携带干员数
        case "global_squad_num_limit":
          this.squadNum = blackboard[0].value;
          break;
      }
      
    })
    
    //让加算排前面，加乘排中间,乘算排后面
    Object.values(this.attrChanges).forEach(attrChange => {
      attrChange.sort((a, b) => {
        if(a.calMethod !== b.calMethod){
          if(a.calMethod === "add"){
            return -1;
          }else if(a.calMethod === "addmul"){
            return -1;
          }else{
            return 1;
          }

        }else{
          return 0;
        }
      })
    })

    //各种计算类型
    // console.log(this.attrChanges)
    //需要放在其他rune解析完后处理
    addOtherRuneBlackbord.forEach(rune => {
      this.addRuneBlackb(rune);
    })
  }

  private getAttrChanges(rune){
    const { difficultyMask } = rune;

    if(!this.attrChanges[difficultyMask]){
      this.attrChanges[difficultyMask] = [];
    }

    const attrChanges = {};
    switch (rune.key) {
      //加法提升
      case "enemy_attribute_add":
      case "enemy_weight_add":
      case "ebuff_weight":
        attrChanges["calMethod"] = "add";
        break;
      case "enemy_attribute_additive_mul":
        attrChanges["calMethod"] = "addmul";
        break;
      //乘法提升
      default:
        attrChanges["calMethod"] = "mul";
        break;
    }
    
    //enemy_exclude是指不包括的敌人
    //enemy指包括的敌人
    rune.blackboard.forEach( item => {
      const { key, value , valueStr} = item;
      let camelKey = toCamelCase(key); 

      if(
        (rune.key === "ebuff_attack_radius" && key === "range_scale") ||
        (rune.key === "enemy_attackradius_mul" && key === "scale")
      ){
        //攻击范围
        camelKey = "rangeRadius"
      }else if (
        (rune.key === "ebuff_weight" && key === "value") ||
        (rune.key === "enemy_weight_add" && key === "value")
      ){
        ///重量
        camelKey = "massLevel"
      }

      let val;

      switch (camelKey) {
        case "enemyExclude":
        case "enemy":
          val = valueStr.split("|");
          break;
        case "enemyLevelType":
          val = valueStr.split("|");
          break;
        case "runeAlias":    
          val = valueStr;
          break;
        default:
          val = value;
          break;
      }

      attrChanges[camelKey] = val;
      
    })

    this.attrChanges[difficultyMask].push(attrChanges);
  }

  private addRuneBlackb(rune){
    const runeAlias = rune.blackboard.find(b => b.key === "rune_alias")?.valueStr;
    const { difficultyMask } = rune;

    const attrChange = this.attrChanges[difficultyMask];
    attrChange.forEach(item => {
      if(item.runeAlias && item.runeAlias === runeAlias){
        rune.blackboard.forEach(attr => {
          const key = toCamelCase(attr.key);
          if(
            key !== "rune_alias" && 
            key !== "six_star_rune_alias" && 
            attr.value !== 0 && 
            item[key] !== undefined
          ){
            item[key] += attr.value;
          }
        })

      }
    })
  }

  public checkEnemyGroup(group: string): boolean{
    return !group || this.enemyGroupEnable.includes(group) && !this.enemyGroupDisable.includes(group);
  }

  public checkEnemyChange(key: string): string{
    const change = this.enemyChanges[key];
    return change? change : key;
  }

  public checkEnemyAttribute(data: EnemyData){
    const { key , attributes, levelType } = data;
    
    if(!data.attrChanges) data.attrChanges = {};

    Object.keys(this.attrChanges).forEach(type => {
      const changesArr = this.attrChanges[type]
      
      changesArr.forEach(item => {
        let apply = true;
        const {enemy, enemyExclude, enemyLevelType, calMethod} = item;
        if(enemy){
          apply = enemy.includes(key);
        }else if(enemyExclude){

          apply = !enemyExclude.includes(key);
        }else if(enemyLevelType){
          apply = enemyLevelType.includes(levelType);
        }
        
        if(apply){
          Object.keys(item).forEach(attrKey => {

            if(attrKey !== "enemyExclude" && attrKey !== "enemy" && attrKey !== "calMethod"){
              const attrValue = item[attrKey];

              if(!data.attrChanges[attrKey]){
                data.attrChanges[attrKey] = [];
              }

              data.attrChanges[attrKey].push({
                type, value: attrValue, calMethod
              });
            }
          })


        }
      })

    })

    Object.keys(attributes).forEach(attrKey => {
      const attrValue = attributes[attrKey];

      const attrChange = data.attrChanges[attrKey];
      let value = attrValue;

      if(attrChange){
        value =  attrChange.reduce((acc, current) => {
          //加算
          if(current.calMethod === "add"){
            return acc + current.value;
          //乘算
          }else if(current.calMethod === "mul"){
            return acc * current.value;

          }else if(current.calMethod === "addmul"){
            return acc + attrValue * current.value;
          }
        }, attrValue );

        value = Math.max(value, 0);

        //消除乘完后会出现的很长小数
        attributes[attrKey] = accuracyNum(value);
      }

    });

  }

  //检查ban格子
  public checkBannedTiles(tileManager: TileManager){
    
    this.bannedTiles.forEach(vec2 => {
      const tile: Tile = tileManager.getTile(vec2);
      if(tile){
        tile.isBanned = true;
      }
    })
  }

  public checkPredefines(traps){
    traps?.forEach(trap => {
      const enable = this.predefinesEnable[trap.alias];
      if(enable === true){
        trap.hidden = false;
      }else if(enable === false){
        trap.hidden = true;
      }
    })
  }

  public checkTalentChanges(data: EnemyData){
    const find = this.talentChanges.find(talentChange => talentChange.enemy.includes(data.key))
    if(find){
      //todo calMethod是不是该放外面
      data.talentBlackboard.forEach(tB => {
        const changeVal = find[tB.key];
        if(changeVal){
          switch (find.calMethod) {
            case "add":
              tB.value += changeVal;
              break;
            case "mul":
              tB.value *= changeVal;
              break;
            case "set":
              tB.value = changeVal;
              break;
          }
          
        }

      })
    }
  }
}

export default RunesHelper;