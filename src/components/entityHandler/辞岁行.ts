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
  // 活字印章配置
  private sealInterval: number = 5;        // 拓印间隔（秒）
  private sealDamage: number = 500;        // 印章伤害

  // 字格状态管理
  private stampGroups: StampGroup[] = [];     // 拓印字格（活字印章全图触发）
  private specialTiles: {
    tile: Tile;
    type: "bing" | "shan" | "yin";
  }[] = [];

  // <印>地块独立冷却
  private yinCooldown: number = 10;              // <印>地块冷却时间（秒）
  private yinTileCooldowns: Map<string, number> = new Map(); // 字格位置 -> 冷却结束时间

  private active: boolean = false;

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

  /**
   * 从符文读取配置
   */
  parseRunes(runesHelper: RunesHelper) {
    // 读取活字印章配置
    // const sealRune = runesHelper.getRunes("env_system_new", "env_act46side_seal")[0];
    // if(sealRune){
    //   this.sealInterval = runesHelper.getBlackboard(sealRune, "interval") || this.sealInterval;
    //   this.sealDamage = runesHelper.getBlackboard(sealRune, "damage") || this.sealDamage;
    // }

    // // 读取<印>地块冷却配置
    // const yinRune = runesHelper.getRunes("env_system_new", "env_act46side_yin")[0];
    // if(yinRune){
    //   this.yinCooldown = runesHelper.getBlackboard(yinRune, "cooldown") || this.yinCooldown;
    // }

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
		const zi_type = getBlackBoardItem("zi_tile_type", tile.blackboard);
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
      case "enemy_1583_suizzh": //岁·左爪
      case "enemy_1584_suiyzh": //岁·右爪
      case "enemy_1585_suiwei": //岁·尾
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
   * 初始化活字印章覆盖的字格
   */
  private initStampTiles() {
    // 活字印章全图触发，获取所有字格
  }

  /**
   * 注册特殊地块
   */
  private registerSpecialTile(tile: Tile, type: "bing" | "shan" | "yin") {

    this.specialTiles.push({
      tile,
      type
    });

		switch(type){
			case "yin":
				this.handleYinTileEvent(tile);
				break;
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

  /**
   * 执行一次活字印章拓印
   */
  private handleStamping() {
    // 对所有覆盖字格上的敌人造成伤害	
    this.stampGroups.forEach(tile => {
      // // 获取字格上的敌人并造成伤害
      // const enemies: Enemy[] = [];

      // enemies.forEach(enemy => {
      //   // 拔山伤害减免
      //   if(enemy.key.includes("bashan")){
      //     enemy.hp -= this.sealDamage * 0.3; //拔山只受30%伤害
      //   }else{
      //     enemy.hp -= this.sealDamage;
      //   }
      // });

			// // 检查是否有拔山阻止
      // if(this.isBlockedByBaShan(tile.position)) return;
      // // 触发特殊地块效果
      // this.checkSpecialTileEffect(tile);
    });
  }

  /**
   * 检查并触发特殊地块效果
   */
  private checkSpecialTileEffect(tile: Tile) {
    const special = this.specialTiles.find(s => s.tile === tile);
    if(!special) return;

    // 检查是否被拔山阻止
    if(this.isBlockedByBaShan(tile.position)) return;

    switch(special.type){
      case "bing":
        // <兵>地块：生成敌人
        this.spawnEnemyFromBingTile();
        break;
      case "shan":
        // <山>地块：生成高台
        this.spawnHighlandFromShanTile();
        break;
      case "yin":
        // <印>地块已在bindYinTileEvents中处理
        break;
    }
  }

  /**
   * <兵>地块生成敌人
   */
  private spawnEnemyFromBingTile() {
    // 通过waveManager生成敌人
    Global.waveManager.startExtraAction({
      key: "bing_spawn"
    });
  }

  /**
   * <山>地块生成高台
   */
  private spawnHighlandFromShanTile() {
    // 将当前字格设为可部署高台
  }

  /**
   * 检查指定位置是否被拔山阻止
   */
  private isBlockedByBaShan(position: Vec2): boolean {
    return false;
  }

  get() {
    if(!this.active) return;
    return {
      currentSubStage: this.currentSubStage,
      bossSummonStep: this.bossSummonStep
    }
  }

  set(state: any) {
    if(!this.active) return;
    this.currentSubStage = state.currentSubStage;
    this.bossSummonStep = state.bossSummonStep;
  }

}

export default act49side;
