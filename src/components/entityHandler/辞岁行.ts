import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import RunesHelper from "../game/RunesHelper";
import type Handler from "./Handler";
import type { BlackBoard, Vec2 } from "@/type";
import { getBlackBoardItem } from "../utilities/utilities";
import { Direction, Point } from "@/type/Base";

interface StampGroup{
	tiles: StampTile[]
	disabled: boolean
}

interface StampTile{
	tile: Tile
	position: Vec2
	disabled: boolean
}

class act49side implements Handler{
  //是否是boss关
  private active: boolean = false;
  //boss机制中已经添加的被封锁的区域数量
  private addedBossBlockAreaCount: number = 0;

  /**
   * 卡住主图的敌人：岁影
   */
  private mainEnemy: Enemy;

  private upPos: Point;
  private downPos: Point;
  private leftPos: Point;
  private rightPos: Point;

  //下一个关卡
  private currentSubStage: Direction;
  /**
   * boss召唤的阶段
   * 0：未开始
   * 1：开始第一个
   * 2：开始第二个
   */
  private bossSummonStep:  0 | 1 | 2 = 0;

  private parseCoordinates(str) {
    // 移除括号，按逗号分割
    const parts = str.slice(1, -1).split(',');
    
    return {
      x: parseFloat(parts[0]),  // 使用parseFloat可以处理负数和小数
      y: parseFloat(parts[1])   // 同样处理负数
    };
  }

  afterInitMapPosition() {
    const runesHelper = Global.mapModel.runesHelper;
    const blackboards: BlackBoard[] = runesHelper.getRunes("env_system_new", "env_040_act49side_boss_manager")[0]?.blackboard;
    if(blackboards && blackboards.length > 0){
      this.active = true;
      this.upPos = this.parseCoordinates(getBlackBoardItem("head_room_offset", blackboards));
      this.downPos = this.parseCoordinates(getBlackBoardItem("tail_room_offset", blackboards));
      this.leftPos = this.parseCoordinates(getBlackBoardItem("left_hand_room_offset", blackboards));
      this.rightPos = this.parseCoordinates(getBlackBoardItem("right_hand_room_offset", blackboards));

      //添加boss机制说明
      Global.mapModel.addExtraDescription({
        text: `BOSS地图会按左上右下顺序遍历出怪，然后回到中心地图。当地图常规出怪结束后，会释放2次BOSS生命值低于一定比例时召唤的额外敌人`,
        color: "#cb2b34"
      });
    }
  }

	handleTileInit(tile: Tile) {
		const zi_type = getBlackBoardItem("zi_tile_type", tile.blackboard) as string;
		if(zi_type){
			if(zi_type !== "Empty") tile.addTexture("Empty");
			tile.addTexture(zi_type);
		}
	}
  
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      //岁影
      case "enemy_1586_suiy":
        this.mainEnemy = enemy;
        break;
      case "enemy_1582_suisho": //岁
        //周围9格添加阻挡物，向下偏移一格
        this.addBlocksAroundHead(enemy.position);
        enemy.addEndCountdown(600);
        break;
      case "enemy_1583_suizzh": //岁·左爪
      case "enemy_1584_suiyzh": //岁·右爪
        //周围9格添加阻挡物
        this.addBlocksAroundHand(enemy.position);
        enemy.addEndCountdown(600);
        break;
      case "enemy_1585_suiwei": //岁·尾
        //周围4格添加阻挡物，中心在右下
        this.addBlocksAroundTail(enemy.position);
        enemy.addEndCountdown(600);
        break;
      case "enemy_10164_tjgxb":
      case "enemy_10164_tjgxb_2": //操戈
        const detection = enemy.getTalent("1");
        if(!detection) return;
        const maxCount = detection.max_stack_cnt;
        enemy.addDetection({
          key: "tjgxb",
          detectionRadius: detection.range_radius + 0.03, //修正下
          duration: 0,
          every: true,
          excludeEnemyKeys: ["enemy_10164_tjgxb", "enemy_10164_tjgxb_2"],
          callback: (detectionEnemy: Enemy) => {
            if(detectionEnemy.isFly()) return false;
            if(!detectionEnemy.customData.tjgxbCount || detectionEnemy.customData.tjgxbCount < maxCount){
              enemy.removeDetection("tjgxb");
              enemy.finishedMap();
              detectionEnemy.customData.tjgxbCount = detectionEnemy.customData.tjgxbCount ? 
                detectionEnemy.customData.tjgxbCount + 1 : 1;
              return true;
            }
          }
        })
        break;
    }
  }

  /**
   * 周围9格添加阻挡物
   */
  private addBlocksAroundHand(position: Vec2){
    const startX = position.x - 1;
    const startY = position.y - 1;
    const endX = position.x + 1;
    const endY = position.y + 1;
    for(let x = startX; x <= endX; x++){
      for(let y = startY; y <= endY; y++){
        Global.SPFA.addExtraBlocks({x, y});
      }
    }
    this.checkBossBlockAreaCount();
  }

  /**
   * 周围9格添加阻挡物，向下偏移一格
   */
  private addBlocksAroundHead(position: Vec2){
    const startX = position.x - 1;
    const startY = position.y - 2;
    const endX = position.x + 1;
    const endY = position.y;
    for(let x = startX; x <= endX; x++){
      for(let y = startY; y <= endY; y++){
        Global.SPFA.addExtraBlocks({x, y});
      }
    }
    this.checkBossBlockAreaCount();
  }

  /**
   * 周围4格添加阻挡物，中心在右下
   */
  private addBlocksAroundTail(position: Vec2){
    const startX = position.x - 1;
    const startY = position.y;
    const endX = position.x;
    const endY = position.y + 1;
    for(let x = startX; x <= endX; x++){
      for(let y = startY; y <= endY; y++){
        Global.SPFA.addExtraBlocks({x, y});
      }
    }
    this.checkBossBlockAreaCount();
  }

  //四个阻挡区域添加完成后再重新生成寻路
  private checkBossBlockAreaCount(){
    
    if(++this.addedBossBlockAreaCount >= 4){
      Global.SPFA.regenerate(false);
    }
  }

  /**
   * 开始副地图出怪
   */
  private startSubStage(key: Direction){
    const gameManager = Global.gameManager;
    const waveManager = Global.waveManager;
    this.currentSubStage = key;
    switch (key) {
      case "up":
        gameManager.setMapOffset(this.upPos);
        waveManager.startExtraAction({
          key: "head_room_branch"
        })
        break;
      case "down":
        gameManager.setMapOffset(this.downPos);
        waveManager.startExtraAction({
          key: "tail_room_branch"
        })
        break;
      case "left":
        gameManager.setMapOffset(this.leftPos);
        waveManager.startExtraAction({
          key: "left_hand_room_branch"
        })
        break;
      case "right":
        gameManager.setMapOffset(this.rightPos);
        waveManager.startExtraAction({
          key: "right_hand_room_branch"
        })
        break;
    }
  }

  /**
   * 开始主地图出怪
   */
  private startMainStage(){
    this.mainEnemy.finishedMap();
    Global.gameManager.setMapOffset({
      x: 0, y: 0
    });
  }

  /**
   * 游戏初始化后，切换到副地图
   */
  afterGameInit() {
    if(!this.active) return;
    this.startSubStage("left");
  }

  handleFinishedMap() {
    if(!this.active) return;
    const waveManager = Global.waveManager;
    const enemiesInMap = waveManager.enemiesInMap;
    if(enemiesInMap.length === 1 && enemiesInMap[0].key === "enemy_1586_suiy"){
      /**
       * 左上右下的顺序切换地图
       */
      switch (this.currentSubStage) {
        case "left":
          this.startSubStage("up");
          break;
        case "up":
          this.startSubStage("right");
          break;
        case "right":
          this.startSubStage("down");
          break;
        case "down":
          this.startMainStage();
          break;
      }
    }else if(enemiesInMap.length === 4 && waveManager.isSpawnFinished() && this.bossSummonStep < 2){
      /**
       * 出怪结束，只剩boss躯体的情况
       */
      this.bossSummonStep ++;
      waveManager.startExtraAction({
        key: `hp_ratio_branch_${this.bossSummonStep}`
      });
    }
  }


  /**
   * 注册<印>地块
   */
  private handleYinTileEvent(tile: Tile) {
    tile.countdown.addCountdown({
			name: "StampTrigger",
			initCountdown: 0,
			trigger: "manual"
		})
  }

  get() {
    if(!this.active) return;
    return {
      currentSubStage: this.currentSubStage,
      bossSummonStep: this.bossSummonStep,
      addedBossBlockAreaCount: this.addedBossBlockAreaCount
    }
  }

  set(state: any) {
    if(!this.active) return;
    this.currentSubStage = state.currentSubStage;
    this.bossSummonStep = state.bossSummonStep;
    this.addedBossBlockAreaCount = state.addedBossBlockAreaCount;
  }

}

export default act49side;
