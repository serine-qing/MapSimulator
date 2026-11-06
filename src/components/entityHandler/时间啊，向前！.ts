import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import RunesHelper from "../game/RunesHelper";
import type Handler from "./Handler";

//「时间啊，向前！」活动（act55side）的关卡机制
//act55side_10 双战场相机：50格宽的地图被拆成左右两块战场，
//开局看左块，wave2双boss登场时切到右块
class act55side implements Handler{

  //词条 env_050_act55side_boss 里的 fireball_col_ranges = "1-9|36-48"
  //含义是两块战场各占的列范围，"|"分隔多个战场，每段是"起始列-结束列"
  private cameraRanges: { start: number, end: number }[] = [];
  private currentView: number = 0;   //当前看第几块战场（0起），仅作状态记录

  //关卡数据初始化时由 GameHandler 触发一次，负责把词条配置解析进本实例
  parseRunes(runesHelper: RunesHelper){
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
}
export default act55side;
