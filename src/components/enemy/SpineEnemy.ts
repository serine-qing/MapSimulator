import { GC_Add } from "../game/GC";
import Enemy from "./Enemy";
import * as spine  from "@/spine";
import { getSpineScale } from "@/components/utilities/SpineHelper";
import * as THREE from "three";
import GameConfig from "../utilities/GameConfig";
import { gameCanvas } from "../game/GameCanvas";
import Global from "../utilities/Global";
import { getCoordinate, getPixelSize } from "../utilities/utilities";
import { SkeletonMesh } from "@/spine/SkeletonMesh";

class SpineEnemy extends Enemy{
  private skeletonData: any;     //骨架数据
  public skeletonMesh: SkeletonMesh;

  constructor(action: ActionData, enemyData: EnemyData){
    super(action, enemyData);
  }
  //初始化spine小人
  public initMesh(){
    super.initMesh();
    //显示相关的数据为异步加载数据，会晚于构造函数调用
    const {skeletonData} = this.enemyData;
    if(!skeletonData) return;

    this.skeletonData = skeletonData;
    const depthTest = this.key === "enemy_10072_mpprhd" ? false : true; //侵入式调用需要不被其他东西遮挡

    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = this.getMesh({depthTest});

    const motion = this.initialState?.motion || "WALK";
    let isGroundUnit = motion === "WALK"; //是否是地面单位
    if(this.key.includes("enemy_3005_lpeopl")) isGroundUnit = true;  //修道院居民在boss关是空中单位
    else if(this.key === "enemy_10072_mpprhd") isGroundUnit = true;  //侵入式调用从模型来说被视为地面单位

    const offsetY = isGroundUnit? -1/4 : 0;
    const coordinateOffset = getCoordinate(0, offsetY)
    
    this.skeletonMesh.position.x = coordinateOffset.x;
    this.skeletonMesh.position.y = coordinateOffset.y;

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;
    this.skeletonMesh.position.z = isGroundUnit? 
      getPixelSize( 1/7 + this.ZOffset) : getPixelSize( 10/7);

    this.mesh = this.skeletonMesh;
    this.meshContainer = new THREE.Object3D();
    this.meshContainer.add(this.skeletonMesh);
    const spineScale = getSpineScale(this);
    this.meshContainer.scale.set(spineScale.x, spineScale.y ,1);
    
    this.object.add(this.meshContainer);
    
    this.idle();

    this.getSkelSize();

    this.changeAnimation();
    //初始不可见的
    this.hide();

  }

  public getMesh(options?: any): SkeletonMesh{
    const { depthTest } = options || {};
    const skelmesh = new spine.SkeletonMesh(this.skeletonData, function(parameters) {
      //不再进行深度检测，避免skel骨架和其他物体重叠时导致渲染异常的现象
      //重叠时显示哪个用mesh的renderOrder属性控制
      // parameters.depthWrite = false;
      parameters.depthTest = depthTest !== undefined? depthTest : true;
    }); 

    return skelmesh;
  }

  public getMeshClone(): THREE.Object3D{
    if(!Global.gameManager.isSimulate){
      const clone = this.getMesh({
        depthTest: false
      });
      GC_Add(clone);

      clone.rotation.x = GameConfig.MAP_ROTATION;
      clone.state.setAnimation(
        0, 
        "Default", 
        false
      );

      clone.update(0.001)
      const meshContainer = new THREE.Object3D();
      meshContainer.add(clone);
      const spineScale = getSpineScale(this);
      meshContainer.scale.set(spineScale.x, spineScale.y ,1);

      return meshContainer;
    }
    return null;

  }

  public setObjectPosition(x: number, y: number){
    super.setObjectPosition(x, y);
    if(Global.gameManager.isSimulate || !this.skeletonMesh) return;
    this.skeletonMesh.renderOrder = -y;
  }

  //获取skel的大小，是实时运算出来的
  public getSkelSize(){ 
    this.skeletonMesh.skeleton.updateWorldTransform();
    this.changeAnimation();
    this.skeletonMesh.update(1)
    this.skeletonMesh.state.apply(this.skeletonMesh.skeleton);

    if(this.isFly()){
      //飞行单位使用box盒子直接检测
      const box3 = new THREE.Box3();
      box3.setFromObject(this.skeletonMesh); 

      const size = new THREE.Vector3();
      box3.getSize(size); 

      this.meshSize = size;

    }else{
      //地面单位预先计算大小和偏移
      this.meshOffset = {
        x: 0,
        y: 0
      };
      const meshSize = new THREE.Vector2();
      const meshOffset = new THREE.Vector2();
      
      this.skeletonMesh.skeleton.getBounds(new THREE.Vector2(), meshSize, [])

      // const offsetX = -(meshOffset.x + meshSize.x / 2);
      const offsetY = -(meshOffset.y + meshSize.y / 2);
      this.meshOffset.y += offsetY * 6;

      this.meshSize = meshSize.multiplyScalar( getSpineScale(this).y );
    }
    
    //恢复track的动画帧
    const track = this.skeletonMesh.state.getCurrent(0);
    track.trackTime = 0;

  }


  //视图相关的更新
  public render(delta: number){
    super.render(delta);

    if(!Global.gameManager.isSimulate && this.object){
      
      
      if(delta && this.isStarted && (!this.isFinished || this.exitCountDown > 0)){
        this.handleGradient();
        //锁定spine朝向向相机，防止梯形畸变
        this.skeletonMesh.lookAt(gameCanvas.camera.position);

        this.skeletonMesh.update(
          this.deltaTrackTime(this.exitCountDown > 0 && !this.die? 0.001 : delta)  //在退出动画中只更新死亡动画
        )

      }

    }

  }

  private handleGradient(){
    const color = this.skeletonMesh.skeleton.color;

    //退出渐变处理
    if(this.exitCountDown > 1){
      this.exitCountDown -= 0.05 * Global.gameManager.gameSpeed;
      
    }else if(this.exitCountDown > 0 ){
      color.r = 0;
      color.g = 0;
      color.b = 0;
      color.a = this.exitCountDown;
      this.exitCountDown -= 0.05 * Global.gameManager.gameSpeed;
      
      if(this.exitCountDown < 0){
        this.hide();
        color.r = 1;
        color.g = 1;
        color.b = 1;
        color.a = 1;

        this.exitCountDown = 0;
      }
    }
  }
  

  //根据速度方向更换spine方向
  protected updateFaceToward(){
    if(!Global.gameManager.isSimulate && this.object) this.skeletonMesh.scale.x = this.faceToward;
  }

  protected handleTrackTime(trackTime: number){
    if(this.skeletonMesh){
      //恢复当前动画帧
      const track = this.skeletonMesh.state.getCurrent(0);
      track.trackTime = trackTime;

      this.skeletonMesh.lookAt(gameCanvas.camera.position);

      // Spine 运行时在 deltaTime=0 时会触发特殊的非连续动画处理：
      // 需要重新计算骨骼的初始姿势（Initial Pose）
      // 强制进行完整的插值计算（即使没有时间推进）
      // 跳过动画缓存优化路径
      // 这会导致每次调用都执行完整的骨骼变换计算（而非增量更新），消耗大量 CPU。
      // 所以就算是手动设置trackTime，deltaTime参数也不能填0
      this.skeletonMesh.update(
        0.001
      )
    }
  }

  //更改动画
  public changeAnimation(){
    super.changeAnimation();
    if(Global.gameManager.isSimulate) return;
    this.setAnimation();
  }

  protected setAnimation(){
    const animate = this.animateState === "idle"? this.idleAnimate : this.moveAnimate;
    const isLoop = !this.transAnimationPlaying;

    if(!animate){
      console.error(`${this.key}动画名获取失败！`)
    }

    if(animate && this.currentAnimation !== animate){
      this.currentAnimation = animate;
      if(this.skeletonMesh){
        this.skeletonMesh.state.setAnimation(
          0, 
          animate, 
          isLoop
        );
      }

    }
  }

  public set(state){
    super.set(state);

    if(Global.gameManager.isSimulate) return;
    //模拟数据没有计算退出渐变，兼容下
    const color = this.skeletonMesh.skeleton.color;
    color.r = 1;
    color.g = 1;
    color.b = 1;
    color.a = 1;
  }

  public destroy() {
    super.destroy();
    this.skeletonData = null;
  }
}

export default SpineEnemy;