import { accuracyNum, getAttrBlackBoard, getBlackBoardItem, toCamelCase, tuplesToVec2 } from "@/components/utilities/utilities"
import TileManager from "./TileManager";
import Tile from "./Tile";
import act42side from "../entityHandler/众生行记";
import act45side from "../entityHandler/无忧梦呓";
import Global from "../utilities/Global";
import { LevelType } from "../utilities/Enum";
import type { AttrBlackboard, AttrChange, BlackBoard, EnemyData, TileData, Vec2 } from "@/type";
import { EnemyAttrKey } from "@/type/Enemy";


interface TileBlackbChange{
  locations: Vec2[]
  blackboards: BlackBoard[]
}

class RunesHelper{
  public runes: any[];
  public enemyGroupEnable: string[] = [];       //额外出现某组敌人
  public enemyGroupDisable: string[] = [];      //移除某组敌人
  public enemyChanges: { [ key:string ] : string } = {};      //移除某组敌人
  public attrChanges: AttrChange[] = [];     //敌人属性提升
  public predefinesEnable: {[key: string]: boolean} = {};  //装置修改
  public bannedTiles: Vec2[] = [];
  public talentChanges: any[] = [];
  public skillCDChanges: any[] = [];
  public tileBlackbChanges: TileBlackbChange[] = [];

  public charNumDdd: number = 0;
  public squadNum: number = 13;

  constructor(runes: any){
    this.runes = runes;
    
    Global.gameHandler.parseRunes(this);

    const addOtherRuneBlackbord = [];
    this.runes.forEach(rune => {

      const  blackboards: BlackBoard[] = rune.blackboard;

      switch (rune.key) {
      
        case "level_hidden_group_enable":
          this.enemyGroupEnable = [
            ...blackboards.map( i => i.valueStr),
            ...this.enemyGroupEnable
          ]
          break;
        
        case "level_hidden_group_disable":
          this.enemyGroupDisable = [
            ...blackboards.map( i => i.valueStr),
            ...this.enemyGroupDisable
          ]
          break; 

        //敌人更换
        case "level_enemy_replace":
          const changeFrom = blackboards[0].valueStr;
          const changeTo = blackboards[1].valueStr;
          this.enemyChanges[changeFrom] = changeTo;
        
        //敌人属性修改
        case "enemy_attribute_mul":
        case "ebuff_attribute":
        case "enemy_attribute_add":
        case "enemy_attackradius_mul":
        case "ebuff_attack_radius":     //全体攻击范围改变
        case "enemy_weight_add":
        case "ebuff_weight":   //全体重量改变
        case "enemy_attribute_additive_mul":

          this.getAttrChanges(rune);

          break;
        
        //ban格子
        case "global_forbid_location":
          blackboards.forEach( item => {
            const vecArr = item.valueStr.split("|");
            vecArr.forEach(_vec => {
              const vec = _vec
                .replace("(","")
                .replace(")","")
                .split(",")
              this.bannedTiles.push({
                x: parseInt(vec[1]),
                y: parseInt(vec[0]),
              })
            })

          })
          break;

        //地图装置修改
        case "level_predefines_enable":
          blackboards.forEach( item => {
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
          blackboards.forEach(item => {
            
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
          this.charNumDdd += blackboards[0].value;
          break;

        //更改可携带干员数
        case "global_squad_num_limit":
          this.squadNum = blackboards[0].value;
          break;

        //todo 修改敌人技能cd
        case "enemy_skill_cd_mul":
          this.skillCDChanges.push({
            enemy: this.getBlackboard(rune, "enemy").split("|"),
            scale: this.getBlackboard(rune, "scale"),
            skill: this.getBlackboard(rune, "skill"),
            calMethod: "mul",
          })
          break;

        //修改地图tile的blackboard
        case "map_tile_blackb_assign":
          const location = blackboards.find(blackb => blackb.key === "location" );
          if(!location) return;
          blackboards.remove(location);
          
          this.tileBlackbChanges.push({
            locations: tuplesToVec2(location.valueStr),
            blackboards
          })

          break;
      }
      
    })
    
    
    //让加算排前面，加乘排中间,乘算排后面
    const calOrder: Record<string, number> = { "add": 0, "addmul": 1, "mul": 2 };
    this.attrChanges.sort((a, b) => {
      return (calOrder[a.calMethod] ?? 3) - (calOrder[b.calMethod] ?? 3);
    })
    //各种计算类型
    // console.log(this.attrChanges)
    //需要放在其他rune解析完后处理
    addOtherRuneBlackbord.forEach(rune => {
      this.addRuneBlackb(rune);
    })
  }

  //加上BBKey可获取双重key指定的rune
  public getRunes(runekey: string, BBKey?: string): any[]{
    const find = [];
    this.runes.forEach(rune => {
      if(rune.key === runekey){
        if(BBKey){
          const find = rune.blackboard.find(bb => bb.key === "key");
          if(!find || find.valueStr !== BBKey) return;
        }
        find.push(rune);
      }
    })

    return find;
  }

  public getBlackboard(rune: any, key: string){
    const find = rune.blackboard?.find(item => item.key === key);
    if(find) return find.valueStr ? find.valueStr : find.value;
  }

  private getAttrChanges(rune){
    const { difficultyMask } = rune;

    let calMethod;
    switch (rune.key) {
      //加法提升
      case "enemy_attribute_add":
      case "enemy_weight_add":
      case "ebuff_weight":
        calMethod = "add";
        break;
      case "enemy_attribute_additive_mul":
        calMethod = "addmul";
        break;
      //乘法提升
      default:
        calMethod = "mul";
        break;
    }
    
    //enemy_exclude是指不包括的敌人
    //enemy指包括的敌人
    let enemy: string[];
    let enemyExclude: string[];
    let enemyLevelType: LevelType[];
    let runeAlias: string;
    let blackboards: AttrBlackboard[] = [];

    rune.blackboard.forEach( item => {
      const { key, value , valueStr}:{ key:string, value: number, valueStr: string }  = item;
      
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
        case "enemy":
          enemy =  valueStr.split("|");
          break;
        case "enemyExclude":
          enemyExclude =  valueStr.split("|");
          break;
        case "enemyLevelType":
          enemyLevelType = valueStr.split("|").map(str => str as unknown as LevelType);
          break;
        case "runeAlias":    
          runeAlias = valueStr;
          break;
        default:
          const attrKey = camelKey as EnemyAttrKey;
          blackboards.push({
            key: attrKey,
            value
          })
          break;
      }
      
    })

    const attrChange: AttrChange = {
      difficultyMask,
      calMethod,
      enemyLevelType,
      enemy,
      enemyExclude,
      runeAlias,
      blackboards
    };

    this.attrChanges.push(attrChange);
  }

  private addRuneBlackb(rune){
    const runeAlias = rune.blackboard.find(b => b.key === "rune_alias")?.valueStr;
    const { difficultyMask } = rune;


    const attrChanges = this.attrChanges.filter(change => {
      return change.difficultyMask === difficultyMask &&
        change.runeAlias === runeAlias
    });

    attrChanges.forEach(attrChange => {
      
      rune.blackboard.forEach(attr => {
        const key = toCamelCase(attr.key);
        if(
          key !== "runeAlias" && key !== "sixStarRuneAlias" 
        ){
          const bbItem = getAttrBlackBoard(key as EnemyAttrKey, attrChange.blackboards);
          if(bbItem){
            bbItem.value = accuracyNum(bbItem.value + attr.value);
          }
        }
      })
      
    })

  }

  public checkEnemyGroup(group: string): boolean{
    //todo rune冲突时候的优先级
    return !group || this.enemyGroupEnable.includes(group) && !this.enemyGroupDisable.includes(group);
  }

  public checkEnemyChange(key: string): string{
    const change = this.enemyChanges[key];
    return change? change : key;
  }

  //检查是否是需要应用的enemy
  private isApplyEnemy(enemyKey: string, enemy?, enemyExclude?): boolean{
    let apply = true;
    if(enemy){
      apply = enemy.includes(enemyKey);
    }else if(enemyExclude){
      apply = !enemyExclude.includes(enemyKey);
    }

    return apply;
  }

  public checkEnemyAttribute(enemyData: EnemyData){
    const { key , attributes, levelType } = enemyData;
    
    this.attrChanges.forEach(attrChange => {
      
      const {enemy, enemyExclude, enemyLevelType} = attrChange;

      let apply = true;
      if(enemy){
        apply = enemy.includes(key);
      }else if(enemyExclude){
        apply = !enemyExclude.includes(key);
      }else if(enemyLevelType){
        apply = enemyLevelType.includes(levelType);
      }
      
      //筛选是否适用rune
      if(apply){
        enemyData.attrChanges.push({
          difficultyMask: attrChange.difficultyMask,
          calMethod: attrChange.calMethod,
          blackboards: attrChange.blackboards
        })
        
      }
      
    })

    const addmulMultipliers: Record<string, number> = {};
    enemyData.attrChanges.forEach(attrChange => {
      switch(attrChange.calMethod){
        case "add":
          attrChange.blackboards.forEach(bb => {
            attributes[bb.key] += bb.value;
          })
          break;
        case "mul":
          attrChange.blackboards.forEach(bb => {
            attributes[bb.key] *= bb.value;
          })
          break;
        case "addmul":
          //先收集总倍率，forEach结束后统一乘，避免attributes在遍历中变动
          attrChange.blackboards.forEach(bb => {
            if(!addmulMultipliers[bb.key]) addmulMultipliers[bb.key] = 1;
            addmulMultipliers[bb.key] += bb.value;
          })
          break;
      }
    })

    //统一应用addmul倍率
    for(const key in addmulMultipliers){
      attributes[key] *= addmulMultipliers[key];
    }

    for(const key in attributes){
      //消除乘完后可能会出现的很长小数
      //近战敌人攻击范围是-1
      attributes[key] = accuracyNum( Math.max(attributes[key], -1) );
    }

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
    if(traps && Array.isArray(traps)){
      traps.forEach(trap => {
        const enable = this.predefinesEnable[trap.alias];
        if(enable === true){
          trap.hidden = false;
        }else if(enable === false){
          trap.hidden = true;
        }
      })
    }

  }

  public checkTalentChanges(data: EnemyData){
    const find = this.talentChanges.find(talentChange => talentChange.enemy?.includes(data.key))
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

  public checkSkillChanges(data: EnemyData){

    //技能CD修改
    data.skills && data.skills.forEach(skill => {
      const find = this.skillCDChanges.find(change => change.skill === skill.prefabKey);
      if(find && this.isApplyEnemy(data.key, find.enemy)){
        switch (find.calMethod) {
          case "mul":
            skill.cooldown *= find.scale;
            break;
          case "add":
            
            break;
        }

      }
    });

  }

  public checkTileBlackboard(tileData: TileData, location: Vec2){
    const find = this.tileBlackbChanges.find(blackbChange => blackbChange.locations.find(
      _location => _location.x === location.x && _location.y === location.y
    ));
    if(find) tileData.blackboard = find.blackboards;
  }

}

export default RunesHelper;