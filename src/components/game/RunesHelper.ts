import { accuracyNum, toCamelCase } from "@/components/utilities/utilities"
import TileManager from "./TileManager";
import Tile from "./Tile";

class RunesHelper{
  private runes: any[];
  private enemyGroupEnable: string[] = [];       //额外出现某组敌人
  private enemyGroupDisable: string[] = [];      //移除某组敌人
  private enemyChanges: { [ key:string ] : string } = {};      //移除某组敌人
  public attrChanges: { [ key:string ] : any } = {};     //敌人属性提升
  private predefinesEnable: {[key: string]: boolean} = {};  //装置修改
  private bannedTiles: Vec2[] = [];
  private talentChanges: any[] = [];
  constructor(runes: any){
    this.runes = runes;

    this.runes.forEach(rune => {
      const { difficultyMask, blackboard } = rune;

      //敌人选择的预处理
      let enemy;
      let enemyExclude;

      blackboard.forEach( item => {
        const { key, valueStr } = item;
        let camelKey = toCamelCase(key); 
        switch (camelKey) {
          case "enemy":
            enemy = valueStr.split("|");
            break;
          case "enemyExclude":
            enemyExclude = valueStr.split("|");
            break;
        }
      })

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
            //乘法提升
            default:
              attrChanges["calMethod"] = "mul";
              break;
          }
          
          //enemy_exclude是指不包括的敌人
          //enemy指包括的敌人
          blackboard.forEach( item => {
            const { key, value } = item;
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
                val = enemyExclude;
              case "enemy":
                val = enemy;
                break;
              default:
                val = value;
                break;
            }

            attrChanges[camelKey] = val;
            
          })

          this.attrChanges[difficultyMask].push(attrChanges);

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
        case "enemy_talent_blackb_add":
        case "enemy_talent_blackb_mul":
        case "enemy_talent_blackb_max":
          const change = {
            enemy
          }; 
          blackboard.forEach(item => {
            
            switch (item.key) {
              case "enemy":
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
      }
      
    })
    
    //让加算排前面，乘算排后面
    Object.values(this.attrChanges).forEach(attrChange => {
      attrChange.sort((a, b) => {
        if(a.calMethod !== b.calMethod){
          return a.calMethod === "add"? -1 : 1;
        }else{
          return 0;
        }
      })
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
    const { key , attributes } = data;
    if(!data.attrChanges) data.attrChanges = {};

    Object.keys(this.attrChanges).forEach(type => {
      const changesArr = this.attrChanges[type]
      
      changesArr.forEach(item => {
        let apply = true;
        const {enemy, enemyExclude, calMethod} = item;
        if(enemy){
        
          apply = enemy.find(enemyKey => key === enemyKey);
        }else if(enemyExclude){

          apply = !enemyExclude.find(enemyKey => key === enemyKey);
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