import Enemy from "../enemy/Enemy";
import Trap from "../game/Trap";
import Global from "../utilities/Global";
import * as THREE from "three"
import { getBlackBoardItem, getPixelSize } from "../utilities/utilities";
import type Handler from "./Handler";
import Tile from "../game/Tile";
import RunesHelper from "../game/RunesHelper";

interface avalancheZone{
  x1: number, x2: number, y1: number, y2: number,
  trap: Trap
}

class act46side implements Handler{
  private currentTrapId: number = 0; 
  private avalancheDamage: number = 0;
  private avalancheZones: avalancheZone[] = [];    //雪崩区数组
  private prayTiles: {[key: number]: Tile} = {};   //初雪祈祷tile
  private prayDuration: number;                    //祈祷时间
  private prayDamageRate: number;                  //祈祷伤害倍率

  private xdagt: Enemy;                            //披挂冰雪的少女
  private xdmon: Enemy;                            //耶拉冈德

  //初始化雪崩区
  private initAvalancheZone (trap: Trap ,x1: number, x2: number, y1: number, y2: number) {
    Global.tileManager.addRectEvents({
      key: "AvalancheZone",
      type: "in",
      x1, x2, y1, y2,
      callback: (enemy: Enemy) => {
        if(enemy.isFly()) return;
        trap.addSPForSkill("Avalanche", enemy.attributes.massLevel);
      }
    })

    this.drawRect(x1, x2, y1, y2);

    this.avalancheZones.push({
      x1, x2, y1, y2, trap
    })
  }

  private drawRect (x1: number, x2: number, y1: number, y2: number) {
    const minX = Math.min(x1, x2) - 0.5;
    const maxX = Math.max(x1, x2) + 0.5;
    const minY = Math.min(y1, y2) - 0.5;
    const maxY = Math.max(y1, y2) + 0.5;

    const points = [
      new THREE.Vector3(getPixelSize(minX) , getPixelSize(minY), 0 ),
      new THREE.Vector3(getPixelSize(minX) , getPixelSize(maxY), 0 ),

      new THREE.Vector3(getPixelSize(minX) , getPixelSize(maxY), 0 ),
      new THREE.Vector3(getPixelSize(maxX) , getPixelSize(maxY), 0 ),

      new THREE.Vector3(getPixelSize(maxX) , getPixelSize(maxY), 0 ),
      new THREE.Vector3(getPixelSize(maxX) , getPixelSize(minY), 0 ),

      new THREE.Vector3(getPixelSize(maxX) , getPixelSize(minY), 0 ),
      new THREE.Vector3(getPixelSize(minX) , getPixelSize(minY), 0 )
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.MeshBasicMaterial( {
      color: "#ffffff",
      transparent: true,
      depthTest: false,
      depthWrite: false,
    } );
    const plane = new THREE.LineSegments( geometry, material );

    if(!Global.gameManager.isSimulate){
      Global.gameView.addDrawObject(plane);
    }
  }

  //获取小雪伞挡住的格子
  private getAuraTiles(x1, x2, y1, y2): THREE.Vector2[]{
    const auraTiles = [];
    const auraEnemys = Global.waveManager.getEnemysInRect({
      x1, x2, y1, y2, 
      enemyIncludes: ["enemy_10143_xdmush", "enemy_10143_xdmush_2"]
    });

    auraEnemys.forEach(enemy => {
      if(enemy.customData.isAura){
        auraTiles.push(enemy.tilePosition);
      }
    })
    return auraTiles;
  }

  //执行雪崩
  private avalanche(x1, x2, y1, y2, direction: THREE.Vector2) {
    const auraTiles = this.getAuraTiles(x1, x2, y1, y2);
    const enemys = Global.waveManager.getEnemysInRect({
      x1, x2, y1, y2
    });
    const traps = Global.trapManager.getTrapsInRect(x1, x2, y1, y2);

    enemys.forEach(enemy => {
      const position = enemy.tilePosition;
      if(enemy.motion !== "WALK") return;
      if(enemy.key === "enemy_1576_spbell") return;   //暂时不考虑圣女
      if(direction.x !== 0){
        //左右向
        const findIndex = auraTiles.findIndex(vec2 => {
          return position.y === vec2.y && (position.x - vec2.x) * direction.x  >= 0
        })
        if( findIndex > -1) return;
      }else if(direction.y !== 0){
        //上下向
        const findIndex = auraTiles.findIndex(vec2 => {
          return position.x === vec2.x && (position.y - vec2.y) * direction.y  >= 0
        })
        if( findIndex > -1) return;
      }

      enemy.changeHP(-this.avalancheDamage);
      if(!enemy.key.includes("enemy_10143_xdmush")){ //小雪伞免疫失衡
        enemy.push(5, direction)
      }
      
    })

    traps.forEach(trap => {
      if(trap.key === "trap_264_xdplat" && trap.extraWaveKey){
        trap.hide();
        Global.waveManager.startExtraAction({
          key: trap.extraWaveKey
        })
      }
    })
  }

  //小鸟降落高台
  private landBird(enemy: Enemy, duration: number, sp: number){
    enemy.animationStateTransition({
      idleAnimate: "Idle_2",
      transAnimation: "Landing",
      isWaitTrans: true
    })
    enemy.unableMove();

    enemy.countdown.addCountdown({
      name: "Takeoff",
      initCountdown: duration,
      callback: () => {
        enemy.animationStateTransition({
          idleAnimate: "Idle",
          transAnimation: "Takeoff",
          isWaitTrans: true
        })
        enemy.enableMove();
        tile.customData.birdsCount -= 1;
      }
    })

    //给雪崩区加sp
    const find = this.avalancheZones.find(avalancheZone => {
      return (
        avalancheZone.x1 <= enemy.tilePosition.x &&
        avalancheZone.x2 >= enemy.tilePosition.x &&
        avalancheZone.y1 <= enemy.tilePosition.y &&
        avalancheZone.y2 >= enemy.tilePosition.y
      ) 
    })
    if(find && find.trap){
      find.trap.addSPForSkill("Avalanche", sp);
    }

    const tile = Global.tileManager.getTile(enemy.tilePosition);
    tile.customData.birdsCount = tile.customData.birdsCount?
      tile.customData.birdsCount + 1 : 1;
  }

  public handleTileInit(tile: Tile) {
    if(tile.blackboard){
      const check_point_index = getBlackBoardItem("check_point_index", tile.blackboard);
      if(check_point_index !== null){
        this.prayTiles[check_point_index] = tile;
      }
    }
  }

  public parseRunes(runesHelper: RunesHelper) {
    const blackboard = runesHelper.getRunes("env_system_new")[0]?.blackboard;
    if(blackboard){
      const avalancheDamage = getBlackBoardItem("enemy_avalanche_damage", blackboard);
      if(avalancheDamage) this.avalancheDamage = avalancheDamage;
    }
  }

  public handleTrapStart(trap: Trap){
    if(trap.key !== "trap_265_xdice1") return;
    this.currentTrapId += 1;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = 0;
    let maxY = 0;    //雪崩区四角坐标

    Global.tileManager.flatTiles.forEach(tile => {
      const avalanche_index = getBlackBoardItem("avalanche_index", tile.blackboard);
      let id = this.currentTrapId;

      //关底顺序有bug
      if(Global.mapModel.sourceData.levelId === "activities/act46side/level_act46side_10"){
        if(this.currentTrapId === 2) id = 3;
        else if(this.currentTrapId === 3) id = 2;
      }

      if(avalanche_index === id){
        
        minX = Math.min(tile.position.x, minX);
        minY = Math.min(tile.position.y, minY);
        maxX = Math.max(tile.position.x, maxX);
        maxY = Math.max(tile.position.y, maxY);
      }
    })

    let direction;
    
    switch (trap.direction) {
      case "LEFT":
        direction = new THREE.Vector2(-1, 0);
        break;
      case "RIGHT":
        direction = new THREE.Vector2(1, 0);
        break;
      case "DOWN":
        direction = new THREE.Vector2(0, -1);
        break;
      case "UP":
        direction = new THREE.Vector2(0, 1);
        break;
    }
    let initSp = 0;
    switch (trap.mainSkillLvl) {
      case 1:
        initSp = 5;
        break;
      case 2:
        initSp = 0;
        break;
      case 3:
        initSp = 8;
        break;
      case 4:
        initSp = 12;
        break;
    }

    trap.addSkill({
      name: "Avalanche",
      initSp,
      spCost: 15,
      spSpeed: 0,
      showSPBar: true,
      duration: 2,
      endCallback: () => {
        this.avalanche(minX, maxX, minY, maxY, direction);
      }
    })
    this.initAvalancheZone(trap, minX, maxX, minY, maxY);
  }

  public handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10139_xdseal":
      case "enemy_10139_xdseal_2":
        const growth = enemy.getTalent("growth");
        const {range_radius, max_stack_cnt, max_hp} = growth;
        enemy.addDetection({
          detectionRadius: range_radius,
          duration: 0.1,
          every: false,
          enemyKeys: ["enemy_10138_xdsnow", "enemy_10138_xdsnow_2"],
          callback: (obj: Enemy) => {
            if(enemy.customData.growthCount === undefined) enemy.customData.growthCount = 0;
            if(enemy.customData.growthCount < max_stack_cnt){
              enemy.customData.growthCount++;
              obj.finishedMap();
              enemy.animationStateTransition({
                idleAnimate: `Idle_${enemy.customData.growthCount + 1}`,
                moveAnimate: `Move_${enemy.customData.growthCount + 1}`,
                isWaitTrans: false
              })
            }
          }
        })
        break;
    
      case "enemy_10145_xdrock":             //伊斯贝塔
      case "enemy_10145_xdrock_2":
        enemy.startAnimate = "B_Start"
        break;

      case "enemy_10140_xdbird":             //洞栖雪灵
      case "enemy_10140_xdbird_2":
        const tileManager = Global.tileManager;
        const {initCooldown, cooldown} = enemy.getSkill("land");
        const {random_delay_min, random_delay_max, land_cnt_max} = enemy.getTalent("land_trigger");
        const {wait_duration, sp} = enemy.getTalent("wait");

        enemy.addSkill({
          name: "land",
          initCooldown,
          cooldown,
          duration: wait_duration,  
          autoTrigger: false,
          callback: () => {
            enemy.countdown.addCountdown({
              name: "landDelay",
              initCountdown: Global.seededRandom.nextFloat(random_delay_min, random_delay_max),
              callback: () => {
                this.landBird(enemy, wait_duration, sp);
              }
            })
          }
        })

        enemy.countdown.addCountdown({
          name: "landTrigger",
          initCountdown: 0.2,
          countdown: 0.2,
          callback: () => {
            if(enemy.isSkillInCd("land")) return;
            const tile = tileManager.getTile(enemy.tilePosition);
            if(!tile.isBuildableHighland()) return;
            if(tile.customData.birdsCount && tile.customData.birdsCount >= land_cnt_max) return;
            enemy.triggerSkill("land");
          }
        })
        break;
      case "enemy_1576_spbell":        //喀兰圣女
        enemy.dontBlockWave = true;
        enemy.cantFinished = true;
        enemy.customData.prayCount = 0;  //祈祷计数器
        const prayTime = enemy.getSkill("pray");
        this.prayDuration = prayTime.blackboard?.duration || 36;
        this.prayDamageRate = prayTime.blackboard?.hp_ratio || 0.25;
        break;
      case "enemy_1574_xdagt":       //披挂冰雪的少女
        enemy.ZOffset = 1;
        enemy.unableMove();
        this.xdagt = enemy;
        break;
      case "enemy_1575_xdmon":       //耶拉冈德
        enemy.hide();
        this.xdmon = enemy;
        break;
    }
  }

  public handleDie(enemy: Enemy) {
    //披挂冰雪的少女离场后再显示耶拉冈德
    if(enemy.key === "enemy_1574_xdagt"){
      this.xdmon?.show();
    }
  }

  //失衡移动
  public handleEnemyUnbalanceMove(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10141_xdpeng":      //抱蛋羽兽 
      case "enemy_10141_xdpeng_2":
        const move_speed = enemy.getTalent("speed").move_speed;
        enemy.countdown.addCountdown({
          name: "waitEgg",
          initCountdown: 0.5,
          callback: () => {
            enemy.animationStateTransition({
              idleAnimate: "Idle_2",
              moveAnimate: "Move_2",
              transAnimation: "Die_3",
              isWaitTrans: true
            });
          }
        })
        enemy.addBuff({
          id: "speed",
          key: "speed",
          overlay: false,
          effect: [{
            attrKey: "moveSpeed",
            method: "mul",
            value: move_speed
          }]
        })
        break;
    }
  }

  //撞墙
  public handleEnemyBoundCrash(enemy: Enemy, tile: Tile) {
    switch (enemy.key) {
      case "enemy_10138_xdsnow":      //雪孩子
      case "enemy_10138_xdsnow_2":
        const damage = enemy.getTalent("hitwall").value;
        enemy.changeHP(-damage)

        break;
      case "enemy_10139_xdseal":      //蓬松雪球
      case "enemy_10139_xdseal_2":
        enemy.animationStateTransition({
          idleAnimate: "Idle",
          moveAnimate: "Move",
          isWaitTrans: false
        })
        break;
      case "enemy_10142_xdturt":        //翻身甲
      case "enemy_10142_xdturt_2":
        const weak_duration = enemy.getTalent("weak").weak_duration;
        enemy.unMoveable = true;
        
        enemy.animationStateTransition({
          idleAnimate: "Idle_B",
          transAnimation: "Die_Begin",
          isWaitTrans: false
        });

        enemy.countdown.addCountdown({
          name: "turn",
          initCountdown: weak_duration,
          callback: () => {
            enemy.animationStateTransition({
              idleAnimate: "Idle_A",
              transAnimation: "Die_End",
              isWaitTrans: true
            });
            enemy.unMoveable = false;
          }
        })
        break;
    }
  }

  public handleEnemyWait(enemy: Enemy, waitTime: number) {
    if(enemy.key === "enemy_10143_xdmush" || enemy.key === "enemy_10143_xdmush_2"){  //小雪伞
      enemy.animationStateTransition({
        idleAnimate: "Idle_B",
        transAnimation: "Skill_Begin",
        isWaitTrans: true,
      })
      enemy.customData.isAura = true;
    }
  }

  public handleEnemyWaitFinish(enemy: Enemy, waitTime: number) {
    if(enemy.key === "enemy_10143_xdmush" || enemy.key === "enemy_10143_xdmush_2"){  //小雪伞
      enemy.animationStateTransition({
        idleAnimate: "Idle_A",
        transAnimation: "Skill_End",
        isWaitTrans: true,
      })
      enemy.customData.isAura = false;
    }  
    
  }

  public handleChangeCheckPoint(enemy: Enemy, oldCP: CheckPoint) {
    if(enemy.key === "enemy_1576_spbell" && oldCP){
      //喀兰圣女

      const position = oldCP.position;
      const prayTile = this.prayTiles[enemy.customData.prayCount];
      if(prayTile && prayTile.position && prayTile.position.x === position.x && prayTile.position.y === position.y){
        
        enemy.animationStateTransition({
          idleAnimate: "Skill_Loop",
          transAnimation: "Skill_Begin",
          isWaitTrans: true
        });
        enemy.unableMove();
        enemy.countdown.addCountdown({
          name: "prayFinish",
          initCountdown: this.prayDuration,
          callback: () => {
            enemy.animationStateTransition({
              idleAnimate: "Idle",
              transAnimation: "Skill_End",
              isWaitTrans: true
            });
            enemy.enableMove();
            enemy.customData.prayCount ++;
            this.xdagt.changeHP( -this.xdagt.getAttr("maxHp") * this.prayDamageRate );
          }
        })
      }
      
    }
  }
}
export default act46side;