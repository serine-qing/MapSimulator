import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import RunesHelper from "../game/RunesHelper";
import type Handler from "./Handler";
import type { BlackBoard, Vec2 } from "@/type";
import { getBlackBoardItem } from "../utilities/utilities";

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

    // // 添加活动说明
    // Global.mapModel.addExtraDescription({
    //   text: `活字印章拓印间隔：${this.sealInterval}秒`,
    //   color: "#FF9900"
    // });
  }

  afterGameViewInit() {
    const runesHelper = Global.mapModel.runesHelper;
    const blackboards: BlackBoard[] = runesHelper.getRunes("env_system_new", "env_040_act49side_boss_manager")[0]?.blackboard;
    if(blackboards && blackboards.length > 0){
      const up = this.parseCoordinates(getBlackBoardItem("head_room_offset", blackboards));
      const down = this.parseCoordinates(getBlackBoardItem("tail_room_offset", blackboards));
      const left = this.parseCoordinates(getBlackBoardItem("left_hand_room_offset", blackboards));
      const right = this.parseCoordinates(getBlackBoardItem("right_hand_room_offset", blackboards));


      console.log(up, down, left, right )
      // Global.gameView.setMapOffset(left)
    }
  }

	handleTileInit(tile: Tile) {
		const zi_type = getBlackBoardItem("zi_tile_type", tile.blackboard);
		if(zi_type){
			if(zi_type !== "Empty") tile.addTexture("Empty");
			tile.addTexture(zi_type);
		}
	}

  /**
   * 游戏初始化后，设置定时器和特殊地块
   */
  afterGameInit() {
    // 启动活字印章定时器
    // Global.gameManager.countdown.addCountdown({
    //   name: "sealStamping",
    //   initCountdown: this.sealInterval,
    //   countdown: this.sealInterval,
    //   callback: () => {
    //     this.handleStamping();
    //   }
    // });
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


}

export default act49side;
