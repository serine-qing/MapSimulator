import {Object3D, BoxGeometry, BoxHelper, Mesh, Material, MeshBasicMaterial, TextureLoader, Vector2} from "three"
import * as THREE from "three"
import { getTexture, getTile } from "./TextureHelper";
import Trap from "./Trap";
import { GC_Add } from "./GC";
import GameConfig from "../utilities/GameConfig";
import Global from "../utilities/Global";
import { getPixelSize } from "../utilities/utilities";
import DataObject from "../enemy/DataObject";

interface DynamicTexture{
  key: string,
  textureName: string,
  visible: boolean,
  texture?: Mesh
}

class Tile extends DataObject{
  static boxGeos = [];
  static bottomMat = new MeshBasicMaterial({
    color: "#000000"
  });

  tileData: any;
  blackboard: any[];

  width: number;
  height: number;
  margin: number;
  position: THREE.Vector2;

  visible: boolean = true;

  passableMask: string;
  buildableType: string;  //可供部署类型
  tileKey: string;
  heightType: string;

  textureObj: THREE.Mesh;
  previewTexture: THREE.Mesh = null;
  cube: Mesh;
  object: Object3D;
  border: BoxHelper;

  textures = new THREE.Group();
  dynamicTextures: DynamicTexture[] = [];

  sideMaterial: Material;
  topMaterial: Material;

  isBanned: boolean = false;    //该格子是否被ban了

  trap: Trap = null;   //当前地块上的装置
  constructor(tileData: TileData , position: Vec2){
    super();
    this.tileData = tileData;

    const {tileKey, heightType, buildableType, passableMask, blackboard} = tileData;

    this.passableMask = passableMask;
    this.buildableType = buildableType;
    this.blackboard = blackboard;

    this.width = 1;
    this.height = 0;
    this.margin = 0; //tile之间的间隔
    this.position = new THREE.Vector2(0, 0);

    this.position.x = position.x ? position.x : 0;
    this.position.y = position.y ? position.y : 0;


    this.tileKey = tileKey;
    this.heightType = heightType;

    this.initSize();
  }

  public initMeshs(){
    this.createMesh();
    this.createTexture();
    this.addBorder();
  }

  private initSize(){
    
    switch (this.tileKey) {
      case "tile_start":
      case "tile_end":
        this.height = 1;
        break;

      case "tile_fence":
      case "tile_fence_bound":
        this.height = 0;
        break;
      case "tile_passable_wall":
        this.height = GameConfig.TILE_HEIGHT;
        this.margin = 0.15; //高台有间隔
        break;
      default:
        if(this.heightType === "HIGHLAND"){
          this.height = GameConfig.TILE_HEIGHT;
          this.margin = 0.15; //高台有间隔

        }else if(this.heightType === "LOWLAND"){
          this.height = 0;
          
        }
        break;
    }
  }
  private createMesh(){

    const tileTexture = getTile(this.tileKey, this.buildableType, this.heightType);
    let {top : topMaterial, side : sideMaterial} = tileTexture;
    
    this.object = new Object3D();
    this.object.add(this.textures);
    
    GC_Add(this.object);
    this.object.position.x = getPixelSize(this.position.x);
    this.object.position.y = getPixelSize(this.position.y);
    this.object.position.z = getPixelSize(this.height / 2);

    switch (this.tileKey) {
      //给红蓝门添加地面，因为没有设置默认材质所以红蓝门本身是透明的
      case "tile_start":
      case "tile_end":
        const groundGe0 = this.getBoxGeo(this.width, 0, 0);
        const { ground } = tileTexture;
        const groundMesh = new Mesh( groundGe0, [
          null, null, null, null, ground, ground
        ]); 
        groundMesh.position.z = getPixelSize(- this.height / 2)
        this.object.add(groundMesh);
        break;
      //围栏
      case "tile_fence":
      case "tile_fence_bound":
        const fenceWidth = this.width / 10;
        const sideGeometry = new BoxGeometry( 
          getPixelSize(fenceWidth),
          getPixelSize(this.width),
          getPixelSize(2/7),
        );

        const fenceTop = tileTexture.fenceTop;
        const fenceMaterials = [
          sideMaterial, sideMaterial, sideMaterial, sideMaterial, fenceTop, fenceTop
        ];
        const left = new Mesh( sideGeometry, fenceMaterials); 
        const right = new Mesh( sideGeometry, fenceMaterials); 
        const up = new Mesh( sideGeometry, fenceMaterials); 
        const down = new Mesh( sideGeometry, fenceMaterials); 

        left.position.x = getPixelSize(-this.width/2 + fenceWidth / 2);
        right.position.x = getPixelSize(this.width/2 - fenceWidth / 2);
        up.position.y = getPixelSize(this.width/2 - fenceWidth / 2);
        down.position.y = getPixelSize(-this.width/2 + fenceWidth / 2);

        up.rotation.z = Math.PI / 2;
        down.rotation.z = Math.PI / 2;

        this.object.add(left);
        this.object.add(right);
        this.object.add(up);
        this.object.add(down);
        break;
        
      case "tile_yinyang_road":
      case "tile_yinyang_wall":
        const geometry = new THREE.CircleGeometry( getPixelSize(this.width / 8),64);

        const {yin, yang}  = tileTexture;
        const dynamic = this.blackboard?.find(arr => arr.key === "dynamic");
        const huimingMat = dynamic?.value === 0? yin : yang;
        const huiming = new THREE.Mesh( geometry, huimingMat );

        huiming.position.z = getPixelSize(this.height/2) + 0.1;
        this.object.add(huiming);
        break;
      default:
        break;
      case "tile_hole":
        const hole = tileTexture.hole;
        const size = getPixelSize(hole.scale * this.width);
        const holeGeo = new THREE.PlaneGeometry( size, size );
        const holeMesh = new THREE.Mesh( holeGeo, hole.material );
        holeMesh.position.z = 0.1;
        this.object.add(holeMesh);
        break;
    }

    const geometry = this.getBoxGeo(this.width, this.height, this.margin);

    this.cube = new Mesh( geometry, [
      sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, topMaterial
    ]); 

    this.object.userData.tile = this;

    this.object.add(this.cube);
  }

  public createBottom(){
    if(this.margin > 0){
      const geometry = this.getBoxGeo(this.width, 0, 0);

      const bottom = new Mesh( geometry, Tile.bottomMat); 
      bottom.position.z = getPixelSize( -this.height / 2);
      this.object.add(bottom);
    }
  }

  //生成地块上的图像
  private createTexture(){

    this.addTexture(this.tileKey);

    if(this.isBanned){
      this.addTexture("tile_banned");
    }

    this.dynamicTextures.forEach(dynamicText => {
      dynamicText.texture = this.addTexture(dynamicText.textureName);
    })
  }

  public addDynamicTexture(textureName: string, dynamicName: string){

    const findTexture = this.getDynamicTexture(dynamicName);
    
    if(findTexture){
      findTexture.visible = true;
      if(findTexture.texture) findTexture.texture.visible = true;
      
    }else{
      this.dynamicTextures.push({
        key: dynamicName,
        textureName,
        visible: true,
        texture: null
      })
    }
    
  }

  public removeDynamicTexture(dynamicName: string){
    const findTexture = this.getDynamicTexture(dynamicName);

    if(findTexture){
      findTexture.visible = false;

      if(findTexture.texture) findTexture.texture.visible = false;
    }
  }

  //isDynamic: 是否是动态Texture，动态需要缓存
  public addTexture(textureName: string): Mesh{

    const texture = getTexture(textureName);
    if(!texture) return;

    let textureScale;
    let opacity = 1;
    switch (textureName) {
      case "tile_floor":
        textureScale = 0.85;
        break;
      case "tile_ristar_road":
      case "tile_ristar_road_forbidden":
      case "gem":
      case "gemdark":
        opacity = 0.7;
        textureScale = 1;
        break;
      case "moonlight_shadow":
        opacity = 0.5;
        textureScale = 1;
        break;
      default:
        opacity = 1;
        textureScale = 0.9;
        break;
    }

    const material = texture.material as MeshBasicMaterial;
    material.opacity = opacity;
    
    const textureSize = getPixelSize(this.width * textureScale);

    texture.scale.set(textureSize, textureSize, 1);
    this.textures.add(texture);
    
    const num = this.textures.children.length;

    texture.position.setZ(getPixelSize(this.height / 2) + 0.07 * num);

    return texture;
  }

  //获取已添加的动态textrue
  public getDynamicTexture(key: string){
    const find = this.dynamicTextures.find(dynamicTexture => dynamicTexture.key === key);
    return find;
  }

  public initPreviewTexture(){
    //没有装置、并且没有ban格子的话，就生成一个占位符texture
    if(!this.trap && !this.isBanned && this.buildableType === "MELEE"){
      const textureSize = getPixelSize(this.width * 0.9);
      const textureGeo = new THREE.PlaneGeometry( textureSize, textureSize );
      const textureMat = new THREE.MeshBasicMaterial({
        map: null,
        transparent: true
      });
      this.previewTexture = new THREE.Mesh( textureGeo, textureMat );
      this.previewTexture.position.setZ(getPixelSize(this.height / 2) + 0.15);
      this.previewTexture.visible = false;

      this.object.add(this.previewTexture);
    }
  }

  public updatePreviewImage(texture: THREE.Texture){
    if(this.previewTexture){
      const material = this.previewTexture.material as THREE.MeshBasicMaterial;
      material.map = texture;
    }
  }

  public hiddenPreviewTexture(){
    if(this.previewTexture){
      this.previewTexture.visible = false;
    }
  }

  //重复的geo直接读取缓存
  private getBoxGeo(width:number, height:number, margin:number):BoxGeometry {
    let boxGeo: BoxGeometry;

    boxGeo = Tile.boxGeos.find(item => {
      return item.width === width && 
      item.height === height && 
      item.margin === margin;
    })?.geo

    if(!boxGeo){
      boxGeo = new BoxGeometry( 
        getPixelSize(width) - margin,
        getPixelSize(width) - margin,
        getPixelSize(height),
      );
      Tile.boxGeos.push({
        width, height, margin,
        geo: boxGeo
      })
    }
    return boxGeo;
  }

  //添加边框
  private addBorder(){
    let borderColor;
    switch (this.tileKey) {
      case "tile_start":
      case "tile_end":
        borderColor = this.tileKey === "tile_end"? "#359dde":"#e03253";
        break;
      case "tile_passable_wall":
        break;
      default:
        if(this.heightType === "LOWLAND"){

          borderColor = "#0d0d0d";
        }
        break;
    }

    if(borderColor){
      this.border = new BoxHelper( this.cube, borderColor);
      (this.border.material as THREE.MeshBasicMaterial).color.convertSRGBToLinear();
      this.object.add(this.border);
    }

  }

  public getPixelHeight(){
    return getPixelSize(this.height)
  }

  public bindTrap(trap: Trap){
    this.trap = trap;
    this.trap.start();
  }

  public removeTrap(){
    this.trap = null;
  }

  //是否可通过。检测不可通行或为障碍物
  public isPassable(){
    let passable = this.passableMask !== "FLY_ONLY";
    const trapKey = this.trap?.key;

    // console.log(trapKey)
    switch (trapKey) {
      case "trap_001_crate":
      case "trap_002_emp":
      case "trap_005_sensor":
      case "trap_008_farm":
      case "trap_020_roadblock":
      case "trap_027_stone":
      case "trap_032_mound":
      case "trap_043_dupilr":
      case "trap_044_duruin":
      case "trap_075_bgarmn":
      case "trap_076_bgarms":
      case "trap_077_rmtarmn":
      case "trap_078_rmtarms":
      case "trap_080_garage":
      case "trap_111_wdfarm":
      case "trap_156_dsshell":
      case "trap_163_foolcrate":
      case "trap_405_xbroadblock":
      case "trap_480_roadblockxb":
        passable = false;
        break;
    }
    
    return passable;
  }

  public setVisible(visible: boolean){
    this.visible = visible;
    if(this.object) this.object.visible = visible;
  }

  public destroy() {
    //释放内存
    this.object = null;
    Global.gameManager = null;
    
  }

  public get(){
    const states = {
      visible: this.visible,
      trapStates: this.trap,
      textureStates: this.dynamicTextures.map(dynamicTexture => {
        return {
          key: dynamicTexture.key,
          visible: dynamicTexture.visible
        }
      })
    };

    return states;
  }

  public set(states){
    const {visible, trapStates, textureStates} = states;
    this.setVisible(visible);
    this.trap = trapStates;

    !Global.gameManager.isSimulate && this.dynamicTextures.forEach(dynamicTexture => {
      const { key } = dynamicTexture;
      const find = textureStates.find(textureState => textureState.key === key);
      if(find && find.visible){
        dynamicTexture.texture.visible = true;
      }else{
        dynamicTexture.texture.visible = false;
      }
    })
  }
}

export default Tile;