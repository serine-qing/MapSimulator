import Enemy from "../enemy/Enemy";
import SpineEnemy from "../enemy/SpineEnemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import RunesHelper from "../game/RunesHelper";
import { getPixelSize } from "../utilities/utilities";
import type Handler from "./Handler";

//进入战壕到结算晕眩的延迟（秒）：游戏内同款延迟，地图数据里没有，硬编码
const TRENCH_STUN_DELAY = 0.2;

//甲虫/坚壳甲虫同地块停留多久触发压垮翻板（秒）：talentBlackboard Passive.interval
const BEETLE_CRUSH_INTERVAL = 1.5;

//「时间啊，向前！」活动（act55side）的关卡机制
//act55side_10 双战场相机：50格宽的地图被拆成左右两块战场，
//开局看左块，wave2双boss登场时切到右块
class act55side implements Handler{

  //词条 env_050_act55side_boss 里的 fireball_col_ranges = "1-9|36-48"
  //含义是两块战场各占的列范围，"|"分隔多个战场，每段是"起始列-结束列"
  private cameraRanges: { start: number, end: number }[] = [];
  private currentView: number = 0;   //当前看第几块战场（0起），仅作状态记录

  //spine事件时间点缓存：同一敌人的所有个体共用一个骨架，时间点必然相同，读一次即可
  //key = 敌人key:动画名:事件名（_2变体是另一份骨架，分开缓存）
  private eventTimeCache: { [key: string]: number | null } = {};

  //战壕晕眩时长（秒）：env_048_act55side_trench词条的tile.stun，0=本关无该机制
  private tileStunTime: number = 0;

  //运行时动态部署、地图可能没预置实例的装置key：MapModel会按key预加载资源
  //（06/09等关没有预置翻板实例，不声明的话资源不加载、投掷盖板clone不到模型）
  //parseRunes先于MapModel.getTrapDatas执行，这里读tileStunTime是安全的
  extraTrapKeys(): string[]{
    return this.tileStunTime > 0 ? ["trap_342_dsjhye"] : [];
  }

  //关卡数据初始化时由 GameHandler 触发一次，负责把词条配置解析进本实例
  parseRunes(runesHelper: RunesHelper){
    //—— 战壕进入晕眩（env_048_act55side_trench，活动全部关卡自带）——
    //先清零再读，防止handler复用时沿用上一张图的值；
    //必须在下面env_050的提前return之前读，否则没有双战场词条的关卡读不到
    this.tileStunTime = 0;
    const trenchRune = runesHelper.getRunes("env_system_new", "env_048_act55side_trench")[0];
    if(trenchRune){
      this.tileStunTime = runesHelper.getBlackboard(trenchRune, "tile.stun") || 0;
    }

    const rune = runesHelper.getRunes("env_system_new", "env_050_act55side_boss")[0];
    const colRanges: string = rune && runesHelper.getBlackboard(rune, "fireball_col_ranges");
    if(!colRanges) return;

    this.cameraRanges = colRanges.split("|").map(range => {
      const [start, end] = range.split("-").map(Number);
      return { start, end };
    });
  }

  //把相机切到第view块战场：视图中心对准该块列范围的中点
  //例：范围1-9 → 中心列5，范围36-48 → 中心列42
  //走 gameManager.setMapPosition 存坐标，GameView每帧渲染时应用到地图容器
  private switchCameraView(view: number){
    const range = this.cameraRanges[view];
    if(!range) return;

    this.currentView = view;
    const { start, end } = range;
    Global.gameManager.setMapPosition({ x: (end - start) / 2 + start });
    //广播相机移动事件，通知血条等跟随物重新定位
    Global.gameHandler.afterMoveCamera();
  }

  //地图初始化完成后、模拟开始前，GameManager.initMapPosition 会触发此钩子
  //默认行为是把整张图居中，但50格宽的地图居中会落在中间的forbidden填充区（两块战场之间什么都看不到），
  //所以开局强制对准第一块战场
  afterInitMapPosition(){
    if(this.cameraRanges.length > 1){
      this.switchCameraView(0);
    }
  }

  //wave2的双boss（不死的黑蛇 enemy_1602_blksnk2 / 主教 enemy_1603_hlystp2）刷在右块战场，
  //登场时把相机从左块切过去
  //handleSpawnEnemy 在每个敌人出生前由 GameHandler 调用；返回false表示不劫持出生流程，敌人正常生成
  handleSpawnEnemy(enemy: Enemy): boolean{
    if(
      this.cameraRanges.length > 1 &&
      (enemy.key === "enemy_1602_blksnk2" || enemy.key === "enemy_1603_hlystp2")
    ){
      this.switchCameraView(1);
    }
    return false;
  }

  //每个敌人入场时注册战壕进入事件；甲虫的压垮翻板也在此注册
  //模拟/回放两pass都会走handleStart，注册逻辑同一份；addChangeTileEvent按名字去重，重复注册无副作用
  //stun=0即本关无战壕机制（高度覆写同属该词条、甲虫也只出现在带词条的关卡），整段不注册
  handleEnemyStart(enemy: Enemy){
    if(!this.tileStunTime) return;
    enemy.customData.trenchArmed = true;   //出生武装：首次进裸战壕即可触发
    enemy.addChangeTileEvent({
      name: "trenchStun",
      callback: (outTile: Tile, inTile: Tile) => {
        if(!inTile) return;
        //裸战壕才算效果格：<暗阱>是翻板盖住的战壕，tileKey仍是tile_trench，只多绑了一个装置
        const onBareTrench = inTile.tileKey === "tile_trench" && !inTile.trap;

        this.applyTrenchHeight(enemy, onBareTrench);

        //出生帧updatePositions只初始化tilePosition（outTile为空），不算"进入"，不触发晕眩
        if(!outTile) return;
        if(enemy.isFinished || enemy.isDisappear) return;

        //重复触发条件：进过<暗阱>或非战壕的其他地块后重新武装，才可再次触发
        if(!onBareTrench){
          enemy.customData.trenchArmed = true;
          return;
        }
        this.triggerTrenchStun(enemy);
      },
    });

    //—— 甲虫/坚壳甲虫压垮翻板 ——
    //手册：移动至<暗阱>后破坏<翻板>将其变为<战壕>；
    //同一地块连续待满1.5秒（Passive.interval）才触发，中途离块重新计时；
    //每次落脚都挂周期倒计时（无板的格子触发了也只是空转，
    //停留期间补铺的翻板也能在下一周期被压掉）
    if(
      enemy.key === "enemy_10256_dsjsld" ||
      enemy.key === "enemy_10256_dsjsld_2"
    ){
      enemy.addChangeTileEvent({
        name: "beetleCrush",
        callback: (outTile: Tile, inTile: Tile) => {
          if(!inTile) return;   //出生帧初始化tilePosition，也算落脚开始计时
          enemy.countdown.removeCountdown("beetleCrush");
          enemy.countdown.addCountdown({
            name: "beetleCrush",
            initCountdown: BEETLE_CRUSH_INTERVAL,
            countdown: BEETLE_CRUSH_INTERVAL,
            callback: () => {
              if(enemy.isFinished || enemy.isDisappear) return;
              this.crushPlank(inTile);
            },
          });
        },
      });
    }
  }

  //—— 高度覆写（纯视觉，只动object.position.z）——
  //裸战壕（onBareTrench=true）强制覆写为-0.4格，进<暗阱>或非战壕的其他地块回0；
  //门槛同云梯/坑洞事件：仅地面单位（空中、近地悬浮不跟着下陷）
  //回0前先比对当前值：中途经云梯等地块时tileManager的事件先跑、ZOffset已被改走，不能抢着清零
  //跨格进入 与 甲虫压垮翻板（滞留结算传true）两条路共用
  private applyTrenchHeight(enemy: Enemy, onBareTrench: boolean){
    if(onBareTrench && enemy.motion === "WALK" && !enemy.nearFly){
      enemy.setZOffset(getPixelSize(-0.4));
    }else if(enemy.ZOffset === getPixelSize(-0.4)){
      enemy.setZOffset(0);
    }
  }

  //裸战壕晕眩触发（跨格进入 与 甲虫压垮翻板 两条路共用）：
  //武装判定 → 空中/近地悬浮不触发 → 按delay延迟后结算
  //重复触发条件：进过<暗阱>或非战壕的其他地块后重新武装，才可再次触发（每轮一发）
  //delay=TRENCH_STUN_DELAY：跨格走进坑（游戏内同款0.2秒延迟）；
  //delay=0：木板垮塌掉下去，直接晕没有延迟
  private triggerTrenchStun(enemy: Enemy, delay: number = TRENCH_STUN_DELAY){
    if(enemy.isFinished || enemy.isDisappear) return;
    if(enemy.customData.trenchArmed === false) return;   //本轮已触发过，尚未离场重新武装
    enemy.customData.trenchArmed = false;

    //空中单位、近地悬浮单位不触发眩晕；
    //nearFly由GameHandler在handler派发之后才置位，注册时读不到，只能在这里判
    if(enemy.isFly() || enemy.nearFly) return;

    if(delay <= 0){
      enemy.applyStun(this.tileStunTime);
      return;
    }

    //触发后延迟0.2秒才结算晕眩；期间离场不撤销本发（离场只负责重新武装）
    enemy.countdown.removeCountdown("trenchStunDelay");
    enemy.countdown.addCountdown({
      name: "trenchStunDelay",
      initCountdown: delay,
      callback: () => {
        if(enemy.isFinished || enemy.isDisappear) return;
        enemy.applyStun(this.tileStunTime);
      },
    });
  }

  //甲虫压垮脚下的翻板：拆掉装置（暗阱变回战壕）+ 滞留敌人按踏上裸战壕结算 + 重算寻路
  //模拟pass预置装置没走initMesh（object不存在），destroy里判空处理
  private crushPlank(tile: Tile){
    const trap = tile.trap;
    if(!trap || trap.key !== "trap_342_dsjhye") return;   //只压翻板
    if(!Global.gameManager.isSimulate){
      Global.gameManager.gameView?.trapObjects?.remove(trap.object);
    }
    Global.trapManager.removeTrap(trap);   //tile.trap=null + traps[]移除 + 资源销毁

    //板垮瞬间地块变裸战壕：站在上面的敌人不会收到changeTile（没换块，只是trap没了），
    //按"掉进坑"补结算一次——下沉高度 + 直接晕（无0.2秒延迟，含压板的甲虫自己）
    tile.getEnemies().forEach(enemy => {
      this.applyTrenchHeight(enemy, true);
      this.triggerTrenchStun(enemy, 0);
    });

    Global.waveManager.updateSPFA();       //变回裸战壕，权重1000000需重写寻路
  }

  //蜘蛛 enemy_10261_dsjcmd / 烈毒蜘蛛 enemy_10261_dsjcmd_2 的 Summon 技能
  //enemyData：initCooldown 5（05关overwrite成3）/ cooldown 999 即只放一次 /
  //loop_duration 2.1 / cnt 2（05关overwrite成0即不召唤）/ enemy_key 召唤的蚯蚓
  //效果：释放时2.1秒内以自身路径召唤cnt只"蚯蚓"；
  //施法表现：Skill_Begin 播完直接接 Skill_End（中间没有Skill_Loop），期间用 isWaitTrans 停步
  //
  //卸石苦力 enemy_10257_dsjtsz / _2 的 ThrowSoil 技能
  //enemyData：initCooldown 3 / cooldown 10 /
  //range_radius 2（发动条件半径）/ token_key trap_342_dsjhye（翻板）
  //效果（只做战壕部分，伤害/晕眩不做）：半径2.0内存在<战壕>才可发动 →
  //投掷（Throw_Begin 播完直接接 Throw_End，没有Throw_Loop）→
  //Throw_End的OnAttack事件帧（0.567s，读骨架事件现算）在出手时的战壕盖上翻板（战壕→暗阱）→
  //技能结束转无石模式（Idle_B/Move_B；A=有石初始形态）；一块石头只投一次，之后不再发动
  //
  //战壕晕眩（env_048_act55side_trench，活动全部关卡自带）：词条tile.stun=5秒，
  //地面单位跨格进入裸战壕，0.2秒后晕眩tile.stun秒
  //（空中单位、近地悬浮单位不触发）
  //（停步+停攻击；不换动画，当前播放的动画原地定格）；出生帧只初始化tilePosition不算进入
  //重复触发条件：进过<暗阱>或非战壕的其他地块后重新武装，才可再次触发（每轮一发）
  //高度覆写（纯视觉）：裸战壕上强制-0.4格，进<暗阱>或非战壕的其他地块回0（仅地面单位）
  //甲虫压垮翻板的瞬间，滞留板上的敌人也走同一套结算（见crushPlank，没换块不发changeTile；掉坑直接晕无延迟）
  //handler只管触发时机（进格/压垮+0.2秒延迟）和时长数据（tileStunTime），
  //晕眩状态本身是Enemy类上的状态机：enemy.applyStun(duration)
  handleSkill(enemy: Enemy, skill: any){
    //—— 卸石苦力 ThrowSoil ——
    if(
      enemy.key === "enemy_10257_dsjtsz" ||
      enemy.key === "enemy_10257_dsjtsz_2"
    ){
      if(skill.prefabKey !== "throwsoil" || !skill.blackboard) return;

      const { initCooldown, cooldown, blackboard } = skill;
      const rangeRadius: number = blackboard.range_radius;   //发动条件半径2.0

      //出手瞬间选定的目标战壕：部署以出手时的目标为准
      let targetTile: Tile = null;

      //盖板时机 = Throw_End里OnAttack事件的帧（0.567s）：addSkill外读一次，同类敌人走类内缓存
      const eventTime = this.getCachedEventTime(enemy, "Throw_End", "OnAttack");

      //技能系统没有条件钩子：关掉autoTrigger，由下面的检查定时器在"半径内有战壕"时手动触发
      enemy.addSkill({
        name: "throwsoil",
        initCooldown,
        cooldown,
        maxCount: 1,        //一块石头只投一次，转无石模式后不再发动
        autoTrigger: false,
        animateTransition: {
          transAnimation: "Throw_Begin",
          isWaitTrans: true,   //转换期间 waitAnimationTrans 挡住移动，即施法停步
          //Throw_Begin播完直接接 Throw_End（没有Throw_Loop）
          callback: () => {
            //End起播时开一个和动画同源的倒计时，到事件帧就部署
            if(eventTime !== null){
              enemy.countdown.addCountdown({
                name: "throwsoilDeploy",
                initCountdown: eventTime,
                callback: () => {
                  //"该战壕未部署单位"恒真（模拟器无我方干员），
                  //已有翻板（预置暗阱等）则deployFlip内部跳过
                  this.deployFlip(enemy, targetTile);
                },
              });
            }

            enemy.animationStateTransition({
              transAnimation: "Throw_End",
              idleAnimate: "Idle_B",   //End收尾切无石模式（A=有石初始形态）
              moveAnimate: "Move_B",
              isWaitTrans: true,
              callback: () => {
                //兜底：骨架里没读到事件时间就维持原时机（End播完才盖）
                if(eventTime === null){
                  this.deployFlip(enemy, targetTile);
                }
              },
            });
          },
        },
        callback: () => {
          targetTile = this.findTrench(enemy, rangeRadius);
        },
      });

      //条件门：每0.1秒用专用的tile检测查一次半径内的裸战壕，有才真正释放
      //（triggerSkill要求技能倒计时归零，initCooldown内调用天然返回false，无需手动延迟；
      //every:true因为半径内第一块可能是暗阱，要逐块问到裸战壕为止；成功后停表）
      enemy.addDetectionByTile({
        key: "throwsoilReady",
        tileKeys: ["tile_trench"],
        detectionRadius: rangeRadius,
        duration: 0.1,
        every: true,
        callback: (tile: Tile) => {
          if(tile.trap) return false;   //翻板盖住的暗阱不算
          if(enemy.triggerSkill("throwsoil")){
            enemy.removeDetection("throwsoilReady");
            return true;
          }
          return false;
        },
      });
      return;
    }

    //—— 蜘蛛 Summon ——
    //Handler是全图广播的，只认这两个key，避免劫持其他活动的Summon技能
    if(
      enemy.key !== "enemy_10261_dsjcmd" &&
      enemy.key !== "enemy_10261_dsjcmd_2"
    ) return;
    if(skill.prefabKey !== "summon" || !skill.blackboard) return;

    const { initCooldown, cooldown, blackboard } = skill;
    const enemyKey: string = blackboard.enemy_key;         //召唤的蚯蚓key
    const cnt: number = blackboard.cnt;                    //召唤数量
    const loopDuration: number = blackboard.loop_duration; //召唤窗口2.1秒

    enemy.addSkill({
      name: "summon",
      initCooldown,
      cooldown,
      animateTransition: {
        transAnimation: "Skill_Begin",
        isWaitTrans: true,   //转换期间 waitAnimationTrans 挡住移动，即施法停步
        //Skill_Begin播完直接跟Skill_End（无Skill_Loop），End播完apply收尾恢复移动
        callback: () => {
          enemy.animationStateTransition({
            transAnimation: "Skill_End",
            isWaitTrans: true,
          });
        }
      },
      callback: () => {
        //在loopDuration窗口内均匀放出cnt只（cnt=2时第0只立即、第2.1秒放出第2只），
        //spawnExtraEnemy：出生在自己脚下，共用route与当前checkPointIndex，即"以自身路径"
        for(let i = 0; i < cnt; i++){
          enemy.countdown.addCountdown({
            name: `summon_${i}`,
            initCountdown: cnt > 1 ? (loopDuration * i) / (cnt - 1) : 0,
            callback: () => {
              if(enemyKey && Global.mapModel.getEnemyData(enemyKey)){
                enemy.spawnExtraEnemy(enemyKey);
              }
            }
          });
        }
      }
    });
  }

  //读spine事件时间点（走类内缓存）：同一敌人的所有个体骨架相同、时间点相同，只查一次
  private getCachedEventTime(enemy: Enemy, animationName: string, eventName: string): number | null{
    const key = `${enemy.key}:${animationName}:${eventName}`;
    if(!(key in this.eventTimeCache)){
      this.eventTimeCache[key] = (enemy as SpineEnemy).getEventTime(animationName, eventName);
    }
    return this.eventTimeCache[key];
  }

  //找敌人半径radius内最近的裸战壕地块（敌人position与tile.position同为格子坐标），没有则null
  //已有装置（翻板盖住的<暗阱>）的战壕不算：投石只对没有木板的战壕发动
  private findTrench(enemy: Enemy, radius: number): Tile{
    let nearest: Tile = null;
    let nearestDist = radius;

    Global.tileManager.tiles.forEach(row => {
      row.forEach(tile => {
        if(!tile || tile.tileKey !== "tile_trench" || tile.trap) return;
        const dx = tile.position.x - enemy.position.x;
        const dy = tile.position.y - enemy.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist <= nearestDist){
          nearest = tile;
          nearestDist = dist;
        }
      });
    });

    return nearest;
  }

  //在战壕上部署翻板trap_342_dsjhye：翻板盖住战壕即<暗阱>
  //地块类型仍是tile_trench（暗阱没有独立tileKey），只多绑定一个装置
  private deployFlip(enemy: Enemy, tile: Tile){
    //目标无效，或该战壕已有装置（含预置翻板）则不重复部署
    if(!tile || tile.trap) return;

    //按敌人id固定别名：同一敌人幂等，模拟/回放两个pass各自重建也不会重复
    const alias = `throwsoil#${enemy.id}`;
    let trap = Global.trapManager.getTrap(alias);

    if(!trap){
      //克隆模板：本关预置实例优先，没有实例的关（06/09等）用extraTrapKeys预加载的裸模板；
      //模板也没就绪（资源加载未完成）→ 退化成无模型空装置，状态仍生效
      const proto = Global.mapModel.getTrapProto("trap_342_dsjhye");
      const position = { x: tile.position.x, y: tile.position.y };
      const trapData = proto
        ? { ...proto, alias, position }
        : {
          isTokenCard: false, key: "trap_342_dsjhye", alias,
          hidden: false, direction: "UP", position, mainSkillLvl: 1, skills: [],
        };

      trap = Global.trapManager.createTrap(trapData);
      trap.bindTile(tile);
      trap.initMesh();
      //模拟pass不挂场景，回放pass手动挂上（同ACTIVATE_PREDEFINED的处理；
      //状态set会先清空trapObjects再按traps[]重建，不会重复添加）
      if(!Global.gameManager.isSimulate){
        Global.gameManager.gameView?.trapObjects?.add(trap.object);
      }
    }

    tile.bindTrap(trap);   //tile.trap置位 + trap.start()

    //翻板绑定会改战壕的寻路权重（SPFA.getDistanceWeight：裸战壕1000000和坑洞同级规避，
    //盖了板当平地1），权重变了要重写寻路；同ACTIVATE_PREDEFINED/Trap.hide走updateSPFA，
    //WaveManager.update里批量regenerate并刷新可视路线
    Global.waveManager.updateSPFA();
  }
}
export default act55side;
