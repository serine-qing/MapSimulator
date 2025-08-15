import { GC_Add } from "../game/GC";
import Enemy from "./Enemy";
import spine from "@/assets/script/spine-threejs.js";
import { getSpineScale, checkEnemyMotion, getAnimationSpeed, getSkelOffset } from "@/components/utilities/SpineHelper";
import * as THREE from "three";
import GameConfig from "../utilities/GameConfig";
import Global from "../utilities/Global";

class FbxEnemy extends Enemy{
  private fbxMesh: THREE.Mesh; 

  constructor(action: ActionData){
    super(action);

  }

  public initMesh(){
    super.initMesh();
    this.fbxMesh = this.enemyData.fbxMesh.clone();
    this.object.add(this.fbxMesh);

    switch (this.key) {
      //行星碎屑
      case "enemy_1334_ristar":
        const skin = this.fbxMesh.children[0];
        const shadow = this.fbxMesh.children[1];
        this.fbxMesh.remove(skin);
        this.fbxMesh.remove(shadow);
        GC_Add(skin);
        GC_Add(shadow);

        this.fbxMesh.position.z = -0.5;

        this.shadow.scale.x = 0.6;
        this.activeShadow.scale.x = 0.6;
        break;
    }
    
    const size = Global.gameManager.getPixelSize(GameConfig.TILE_SIZE);
    this.meshSize = {
      x: size, y: size
    }
    this.meshOffset = {
      x:0, y:0
    }
  }

  public setObjectPosition(x: number, y: number){
    super.setObjectPosition(x, y);
  }


  //视图相关的更新
  public render(delta: number){
    super.render(delta);

    if(!Global.gameManager.isSimulate && this.object){
      this.handleGradient();

    }

  }

  private handleGradient(){

  }

  //根据速度方向更换spine方向
  protected changeFaceToward(){
    super.changeFaceToward();

  }

  //更改动画
  public changeAnimation(){



  }

  public set(state){
    super.set(state);

  }

  public destroy() {
    super.destroy();
    this.fbxMesh = null;
  }
}

export default FbxEnemy;