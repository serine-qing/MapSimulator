import { toCamelCase } from "@/components/utilities/utilities"
import MapTiles from "./MapTiles";
import Tile from "./Tile";

class RunesHelper{
  private runes: any[];
  private enemyGroupEnable: string[] = [];       //额外出现某组敌人
  private enemyGroupDisable: string[] = [];      //移除某组敌人
  private enemyChanges: { [ key:string ] : string } = {};      //移除某组敌人
  private attrChanges: { [ key:string ] : any } = {};     //敌人属性提升
  private bannedTiles: Vec2[] = [];
  constructor(runes: any){
    this.runes = runes;

    this.runes.forEach(rune => {
      const { difficultyMask, blackboard } = rune;

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
            ...this.enemyGroupEnable
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
        case "enemy_weight_add":
          if(!this.attrChanges[difficultyMask]){
            this.attrChanges[difficultyMask] = [];
          }

          const attrChanges = {};

          //enemy_exclude是指不包括的敌人
          //enemy指包括的敌人
          blackboard.forEach( item => {
            const { key, value, valueStr } = item;
            let camelKey = toCamelCase(key); 

            if(rune.key === "enemy_attackradius_mul" && key === "scale"){
              //攻击范围
              camelKey = "rangeRadius"
            }else if (rune.key === "enemy_weight_add" && key === "value"){
              ///重量
              camelKey = "massLevel"
            }

            let val;

            switch (camelKey) {
              case "enemyExclude":
              case "enemy":
                val = valueStr.split("|");
                break;

              default:
                val = value;
                break;
            }

            attrChanges[camelKey] = val;
            
          })

          this.attrChanges[difficultyMask].push(attrChanges);

          break;
        
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

          //攻击范围改变
        case "enemy_attackradius_mul":
          break;
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
    const { key , attributes } = data;
    if(!data.attrChanges) data.attrChanges = {};

    Object.keys(this.attrChanges).forEach(type => {
      const changesArr = this.attrChanges[type]
      
      changesArr.forEach(item => {
        let apply = true;
        if(item["enemy"]){
        
          apply = item["enemy"].find(enemyKey => key === enemyKey);
        }else if(item["enemyExclude"]){

          apply = !item["enemyExclude"].find(enemyKey => key === enemyKey);
        }

        if(apply){
          Object.keys(item).forEach(attrKey => {

            if(attrKey !== "enemyExclude" && attrKey !== "enemy"){
              const attrValue = item[attrKey];

              if(!data.attrChanges[attrKey]){
                data.attrChanges[attrKey] = [];
              }

              data.attrChanges[attrKey].push({
                type, value: attrValue
              });
            }
          })


        }
      })

    })

    Object.keys(attributes).forEach(attrKey => {
      const attrValue = attributes[attrKey];

      const attrChange = data.attrChanges[attrKey];
      let multiplier = 1;
      let value = attrValue;
      
      if(attrChange){
        switch (attrKey) {
          case "magicResistance": //法抗
          case "massLevel": //重量等级
            multiplier =  attrChange.reduce((acc, current) => acc + current.value, 0 );
            value = multiplier + attrValue;
            break;
          
          default:
            multiplier = attrChange.reduce((acc, current) => acc * current.value, 1 );
            value = multiplier * attrValue
            break;
        }

        //消除乘完后会出现的很长小数
        attributes[attrKey] = parseFloat( 
          value.toFixed(4) 
        );
      }

    });

  }

  //检查ban格子
  public checkBannedTiles(mapTiles: MapTiles){
    this.bannedTiles.forEach(vec2 => {
      const tile: Tile = mapTiles.get(vec2);
      if(tile){
        tile.isBanned = true;
      }
    })
  }
}

export default RunesHelper;