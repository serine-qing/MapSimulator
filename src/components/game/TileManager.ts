import { Vector2 } from "three";
import AliasHelper from "./AliasHelper";
import Tile from "./Tile";
import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

import act35side from "../entityHandler/太阳甩在身后";

interface TileEvent{
  key: string,
  type: string,
  x: number,
  y: number,
  enemy: string[],
  isMerge: boolean,   //是否是合并地块事件，默认false。靠近的合并地块会视为一个事件，同一片合并地块上进出不会触发事件
  callback: Function
}

interface TileEventOption{
  key: string,
  type: string,      // in:入 out:出
  x: number,
  y: number,
  enemy?: string[],
  isMerge?: boolean,
  callback: Function
}

class TileManager{
  public tiles: Tile[][] = [];
  public flatTiles: Tile[] = [];
  public height: number;    //矩阵高度(y)
  public width: number;    //矩阵宽度(x)
  public events: TileEvent[] = [];
  constructor(mapData:any){
    Global.tileManager = this;
    
    const matrix = mapData.map.map((row: any)=>{
      //row是一行tile的数组,rowIndex为坐标轴中的y值
      return row.map((item: any)=>{

        const tile = mapData.tiles[item];
        let tileKey = tile.tileKey;

        if(tile.tileKey === "tile_grvtybtn"){
          //重力感应机关
          const direction = tile.blackboard.find(blackboard => 
            blackboard.key === "source_direction"
          )?.value;

          if(direction === 0){
            tileKey = "tile_grvtybtn_up"
          }else if(direction === 2){
            tileKey = "tile_grvtybtn_down"
          }
        }

        const tileData: TileData = {
          tileKey,
          passableMask: AliasHelper(tile.passableMask, "passableMask"),
          heightType: AliasHelper(tile.heightType, "heightType"),
          playerSideMask: tile.playerSideMask,
          blackboard: tile.blackboard,  
          buildableType: AliasHelper(tile.buildableType, "buildableType"),  
          effects: tile.effects,  
        }

        //index为坐标轴中的x值
        return tileData;
      })
    }).reverse();

    this.height = matrix.length;
    this.width = matrix[0]?.length;

    matrix.forEach((arr, y) => {
      arr.forEach((tileData: TileData, x) => {

        const tile = new Tile(tileData, {x, y});
        if(!this.tiles[y]){
          this.tiles[y] = [];
        }
        this.tiles[y][x] = tile;
        
      })
    })

    this.flatTiles = this.tiles.flat();

    this.initEvents();
  }

  //根据xy坐标获取地图tile（x：朝右坐标轴 y：朝上坐标轴）
  public getTile(x: number | Vec2, y?: number): Tile | null{
    const _x = typeof x === "number"? x : x.x; 
    const _y = typeof x === "number"? y : x.y; 

    const column = this.tiles[_y];
    if(column && column[_x]){
      return column[_x];
    }
    else{
      return null;
    }  
  }

  //获取某个地板是否可地面通行
  isTilePassable(x: number, y: number): boolean{
    const tile = this.getTile(x, y);
    return tile !== null && tile.passableMask === "ALL";
  }

  //获取某个地板是否可飞行
  isTileFlyable(x: number, y: number): boolean{
    const tile = this.getTile(x, y);
    return tile !== null && (tile.passableMask === "FLY_ONLY" || tile.passableMask === "ALL");
  }

  initPreviewTextures(){
    this.tiles.flat().forEach(tile => {
      //生成预览texture
      tile.initPreviewTexture();
    })
  }

  updatePreviewImage(texture: THREE.Texture){
    this.tiles.flat().forEach(tile => {
      //生成预览texture
      tile.updatePreviewImage(texture);
    })
  }

  hiddenPreviewTextures(){
    this.tiles.flat().forEach(tile => {
      //生成预览texture
      tile.hiddenPreviewTexture();
    })
  }

  private initEvents(){
    this.flatTiles.forEach(tile => {
      act35side.initTileEvents(tile);
    });

  }

  addEvent(option: TileEventOption){
    const find = this.events.find(event => {
      return event.key === option.key && 
        event.type === option.type && 
        event.x === option.x &&
        event.y === option.y
    });
    if(find) return;

    this.events.push({
      key: option.key,
      type: option.type,
      x: option.x,
      y: option.y,
      enemy: option.enemy,
      isMerge: option.isMerge? true : false,
      callback: option.callback
    })

    //事件添加时就在地块上的敌人，需要进行一次判断
    option.type === "in" && Global.waveManager?.enemiesInMap?.forEach(enemy => {
      if(
        option.x === enemy.tilePosition.x &&
        option.y === enemy.tilePosition.y &&
        (!option.enemy || option.enemy.includes(enemy.key))
      ){

        option.callback(enemy);
      }
    })
  }

  changeTile(outPos: Vector2, inPos: Vector2, enemy: Enemy){
    const newEvent = this.getEvent(inPos, "in", enemy);
    const oldEvent = outPos ? this.getEvent(outPos, "in", enemy) : null;
    if(newEvent?.isMerge && oldEvent?.key === newEvent.key){
      //合并事件，不重复触发
      return;
    } 
    outPos && this.getEvent(outPos, "out", enemy)?.callback(enemy);
    newEvent && newEvent.callback(enemy);
  }

  //todo 目前只有单个事件，需要做成兼容多个
  getEvent(position: Vector2, type: string, enemy): TileEvent{
    const find = this.events.find(event => {
      return event.x === position.x &&
        event.y === position.y &&
        event.type === type &&
        (!event.enemy || event.enemy.includes(enemy.key)
      )
    })

    return find;
  }

  get(){
    const state = {
      tileStates: this.flatTiles.map(tile => tile.get()),
      eventStates: [...this.events]
    };

    return state;
  }

  set(state){
    const {
      tileStates,
      eventStates
    } = state;

    for(let i = 0; i < this.flatTiles.length; i++){
      const tile = this.flatTiles[i];
      tile.set(tileStates[i]);
    }

    this.events = [...eventStates];
  }
}

export default TileManager;