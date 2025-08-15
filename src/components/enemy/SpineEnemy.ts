import { GC_Add } from "../game/GC";
import Enemy from "./Enemy";
import spine from "@/assets/script/spine-threejs.js";
import { getSpineScale, checkEnemyMotion, getAnimationSpeed, getSkelOffset } from "@/components/utilities/SpineHelper";
import * as THREE from "three";
import GameConfig from "../utilities/GameConfig";
import { gameCanvas } from "../game/GameCanvas";
import Global from "../utilities/Global";

class SpineEnemy extends Enemy{
  private skeletonData: any;     //骨架数据
  public skeletonMesh: any;

  constructor(action: ActionData){
    super(action);
  }
  //初始化spine小人
  public initMesh(){
    super.initMesh();
    //显示相关的数据为异步加载数据，会晚于构造函数调用
    const {skeletonData} = this.enemyData;
    if(!skeletonData) return;

    this.skeletonData = skeletonData;

    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData, function(parameters) {
      //不再进行深度检测，避免skel骨架和其他物体重叠时导致渲染异常的现象
      //重叠时显示哪个用mesh的renderOrder属性控制
      parameters.depthWrite = false;
    }); 

    this.object.add(this.skeletonMesh);
    
    const offsetY = this.motion === "WALK"? -1/4 : 0;
    const coordinateOffset = Global.gameManager.getCoordinate(0, offsetY)
    
    this.skeletonMesh.position.x = coordinateOffset.x;
    this.skeletonMesh.position.y = coordinateOffset.y;

    const spineScale = getSpineScale(this);
    this.object.scale.set(spineScale,spineScale,1);

    this.idle();

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;
    this.skeletonMesh.position.z = this.motion === "WALK"? 
      Global.gameManager.getPixelSize( 1/7 + this.ZOffset) : Global.gameManager.getPixelSize( 10/7);

    this.getSkelSize();

    this.changeAnimation();
    //初始不可见的
    this.hide();
  }

  public setObjectPosition(x: number, y: number){
    super.setObjectPosition(x, y);
    if(Global.gameManager.isSimulate || !this.skeletonMesh) return;
    this.skeletonMesh.renderOrder = -y;
  }

  //获取skel的大小，是实时运算出来的
  public getSkelSize(){ 
    this.meshOffset = getSkelOffset(this);
    const meshSize = new THREE.Vector2();
    const meshOffset = new THREE.Vector2();

    this.skeletonMesh.skeleton.updateWorldTransform();
    this.changeAnimation();
    this.skeletonMesh.update(1)
    this.skeletonMesh.state.apply(this.skeletonMesh.skeleton);
    this.skeletonMesh.skeleton.getBounds(meshOffset, meshSize, [])

    const offsetX = -(meshOffset.x + meshSize.x / 2);
    const offsetY = -(meshOffset.y + meshSize.y / 2);

    this.meshOffset.y += offsetY * 6;
    this.meshSize = meshSize.multiplyScalar(getSpineScale(this));

    //恢复track的动画帧
    const track = this.skeletonMesh.state.getCurrent(0);
    track.trackTime = 0;

    // console.log(this.name)
    // console.log(`动态边界尺寸: ${this.meshSize.x} x ${this.meshSize.y}`);
    // console.log(`边界偏移量: (${offsetX}, ${offsetY})`);

  }

  //视图相关的更新
  public render(delta: number){
    super.render(delta);

    if(!Global.gameManager.isSimulate && this.object){
      this.handleGradient();
      
      if(this.isStarted && !this.isFinished){
        //锁定spine朝向向相机，防止梯形畸变
        this.skeletonMesh.lookAt(gameCanvas.camera.position);

        if(this.isStarted && !this.isFinished){
          //todo 多次拖动后卡顿
          this.skeletonMesh.update(
            this.deltaTrackTime(delta)
          )
        }

      }

    }

  }

  private handleGradient(){
    const color = this.skeletonMesh.skeleton.color;

    if(this.exit){
      //退出渐变处理
      if(this.exitCountDown > 0){
        color.r = 0;
        color.g = 0;
        color.b = 0;
        color.a = this.exitCountDown;
        this.exitCountDown -= 0.1;
        
        this.skeletonMesh.update(0)
      }else{
        this.hide();
        color.r = 1;
        color.g = 1;
        color.b = 1;
        color.a = 1;
      }
    }else{
      color.r = 1;
      color.g = 1;
      color.b = 1;
      color.a = 1;
    }
  }

  //根据速度方向更换spine方向
  protected changeFaceToward(){
    super.changeFaceToward();
  
    if(!Global.gameManager.isSimulate && this.object) this.skeletonMesh.scale.x = this.faceToward;
  }

  protected handleTrackTime(trackTime: number){
    if(this.skeletonMesh){
      //恢复当前动画帧
      const track = this.skeletonMesh.state.getCurrent(0);
      track.trackTime = trackTime;
      
    }
  }

  //更改动画
  public changeAnimation(){
    super.changeAnimation();
    if(Global.gameManager.isSimulate) return;

    const animate = this.animateState === "idle"? this.idleAnimate : this.moveAnimate;
    const isLoop = this.countdown.getCountdownTime("waitAnimationTrans") === -1 &&
      this.countdown.getCountdownTime("animationTrans") === -1;
    
    if(animate && this.skeletonMesh){
      this.skeletonMesh.state.setAnimation(
        0, 
        animate, 
        isLoop
      );
    }else{
      console.error(`${this.key}动画名获取失败！`)
    }

  }

  public destroy() {
    super.destroy();
    this.skeletonData = null;
  }
}

export default SpineEnemy;