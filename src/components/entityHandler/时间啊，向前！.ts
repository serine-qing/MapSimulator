import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import RunesHelper from "../game/RunesHelper";
import type Handler from "./Handler";

class act55side implements Handler{
  //act55side_10 双战场的列范围，来自词条 fireball_col_ranges（如 "1-9|36-48"）
  private cameraRanges: { start: number, end: number }[] = [];
  private currentView: number = 0;

  //解析词条里的相机活动范围
  parseRunes(runesHelper: RunesHelper){
    const rune = runesHelper.getRunes("env_system_new", "env_050_act55side_boss")[0];
    const colRanges: string = rune && runesHelper.getBlackboard(rune, "fireball_col_ranges");
    if(!colRanges) return;

    this.cameraRanges = colRanges.split("|").map(range => {
      const [start, end] = range.split("-").map(Number);
      return { start, end };
    });
  }

  //切换到指定的面，视图中心对准该面的列中点
  private switchCameraView(view: number){
    const range = this.cameraRanges[view];
    if(!range) return;

    this.currentView = view;
    const { start, end } = range;
    Global.gameManager.setMapPosition({ x: (end - start) / 2 + start });
    Global.gameHandler.afterMoveCamera();
  }

  //开局把相机对准第一面（默认全图居中会落在中间的forbidden填充区）
  afterInitMapPosition(){
    if(this.cameraRanges.length > 1){
      this.switchCameraView(0);
    }
  }

  //wave2 两boss登场时切换到第二块战场
  handleSpawnEnemy(enemy: Enemy): boolean{
    if(
      this.cameraRanges.length > 1 &&
      (enemy.key === "enemy_1602_blksnk2" || enemy.key === "enemy_1603_hlystp2")
    ){
      this.switchCameraView(1);
    }
    return false;   //不劫持出怪
  }
}
export default act55side;
