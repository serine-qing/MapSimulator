import { Vector2 } from "three";
import AliasHelper from "./AliasHelper";
import Tile from "./Tile";
import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import * as THREE from "three";

import act35side from "../entityHandler/太阳甩在身后";
import { getPixelSize } from "../utilities/utilities";
import GameConfig from "../utilities/GameConfig";

interface TileEvent{
  key: string,
  type: string,
  x: number,
  y: number,
  enemy: string[],
  trap: string[],
  isMerge: boolean,   //是否是合并地块事件，默认false。靠近的合并地块会视为一个事件，同一片合并地块上进出不会触发事件
  callback: Function
}

interface TileEventOption{
  key: string,
  type: string,      // in:入 out:出
  x: number,
  y: number,
  enemy?: string[],
  trap?: string[],
  isMerge?: boolean,
  callback: Function
}

//矩形区域添加事件
interface RectEventsOption{
  key: string,
  type: string,      // in:入 out:出
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  enemy?: string[],
  trap?: string[],
  isMerge?: boolean,
  callback: Function
}

class TileManager{
  public tiles: Tile[][] = [];
  public flatTiles: Tile[] = [];
  public startTiles: Tile[] = [];   //红门
  public endTiles: Tile[] = [];     //蓝门
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
        
        if(tile.tileKey === "tile_start" || tile.tileKey === "tile_flystart"){
          this.startTiles.push(tile);
        }else if(tile.tileKey === "tile_end"){
          this.endTiles.push(tile);
        }
        
      })
    })

    this.flatTiles = this.tiles.flat();

    Global.gameHandler.afterTilesInit(this.flatTiles);

    this.initEvents();
  }

  //根据xy坐标获取地图tile（x：朝右坐标轴 y：朝上坐标轴）
  public getTile(x: number | Vec2 | Vector2, y?: number): Tile | null{
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

  //获取一个矩形范围内的tile
  public getRect(x1, x2, y1, y2): Tile[]{
    const minX = Math.clamp( Math.min(x1, x2), 0, this.width - 1 );
    const maxX = Math.clamp( Math.max(x1, x2), 0, this.width - 1 );
    const minY = Math.clamp( Math.min(y1, y2), 0, this.height - 1 );
    const maxY = Math.clamp( Math.max(y1, y2), 0, this.height - 1 );

    const rect = [];
    for(let x = minX; x <= maxX; x++){
      for(let y = minY; y <= maxY; y++){
      
        rect.push(this.getTile(x, y));
      }
    }

    return rect;
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

      switch (tile.tileKey) {
        case "tile_hole":
          this.addEvent({
            key: "hole",
            type: "in",
            x: tile.position.x,
            y: tile.position.y,
            callback: (enemy: Enemy) => {
              if(enemy.motion === "WALK" && !enemy.nearFly) enemy.hp = 0;
            }
          })
          break;
        case "tile_passable_wall":    //云梯
          this.addEvent({
            key: "stairs",
            type: "in",
            isMerge: true,
            x: tile.position.x,
            y: tile.position.y,
            callback: (enemy: Enemy) => {
              if(enemy.motion === "WALK" && !enemy.nearFly){
                enemy.setZOffset( getPixelSize(GameConfig.TILE_HEIGHT) );
              }
            }
          });

          this.addEvent({
            key: "stairs",
            type: "out",
            x: tile.position.x,
            y: tile.position.y,
            callback: (enemy: Enemy) => {
              if(enemy.motion === "WALK" && !enemy.nearFly){
                enemy.setZOffset( 0 );
              }
            }
          });
          break;
      
      }
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
      trap: option.trap,
      isMerge: option.isMerge? true : false,
      callback: option.callback
    })

    //事件添加时就在地块上的敌人，需要进行一次判断
    if(option.type === "in"){
      Global.waveManager?.enemiesInMap?.forEach(enemy => {
        if(
          option.x === enemy.tilePosition.x &&
          option.y === enemy.tilePosition.y &&
          (!option.enemy || option.enemy.includes(enemy.key))
        ){

          option.callback(enemy);
        }
      })

      //事件添加时就在地块上的装置，需要进行一次判断
      //因为装置通常都很少，所以绑定的事件必须指定trap key
      const trap = this.getTile(option.x, option.y)?.trap;
      if(
        trap && trap.visible &&
        (option.trap && option.trap.includes(trap.key))
      ){
        option.callback(trap);
      }

    }
    
  }

  removeEvent(option){
    const findIndex = this.events.findIndex(event => {
      return event.key === option.key && 
        event.type === option.type && 
        event.x === option.x &&
        event.y === option.y
    });

    if(findIndex > -1){
      const eventToRemove = this.events[findIndex];

      //事件移除时还在地块上的敌人，需要进行一次判断
      if(eventToRemove.type === "out"){
        Global.waveManager?.enemiesInMap?.forEach(enemy => {
          if(
            eventToRemove.x === enemy.tilePosition.x &&
            eventToRemove.y === enemy.tilePosition.y &&
            (!eventToRemove.enemy || eventToRemove.enemy.includes(enemy.key))
          ){
            eventToRemove.callback(enemy);
          }
        })

        //事件添加时就在地块上的装置，需要进行一次判断
        //因为装置通常都很少，所以绑定的事件必须指定trap key
        const trap = this.getTile(eventToRemove.x, eventToRemove.y)?.trap;
        if(
          trap && trap.visible &&
          (eventToRemove.trap && eventToRemove.trap.includes(trap.key))
        ){
          eventToRemove.callback(trap);
        }

      }
      
      this.events.splice(findIndex, 1);
    }
  }

  //给某个矩形区域添加事件，默认是组合事件(isMerge)
  addRectEvents(option: RectEventsOption){
    const rect = this.getRect(option.x1, option.x2, option.y1, option.y2);
    rect.forEach(tile => {
      this.addEvent({
        key: option.key,
        type: option.type,
        x: tile.position.x,
        y: tile.position.y,
        enemy: option.enemy,
        trap: option.trap,
        isMerge: option.isMerge === undefined? true : option.isMerge,
        callback: option.callback
      })
    })
  }

  changeTile(outPos: Vector2, inPos: Vector2, enemy: Enemy){
    const newEvents = this.getEvents(inPos, "in", enemy);
    const oldEvents = outPos ? this.getEvents(outPos, "in", enemy) : null;
    const outEvents = this.getEvents(outPos, "out", enemy);
    
    for(let newIndex = 0; newIndex < newEvents.length; newIndex++){
      
      const newEvent = newEvents[newIndex];
      const oldIndex = oldEvents?.findIndex(oldEvent => oldEvent?.key === newEvent.key);
      
      if(newEvent?.isMerge && oldIndex!== null && oldIndex > -1 ){
        //合并事件，不重复触发
        const key = newEvent.key;

        newEvents.splice(newIndex, 1);
        const outIndex = outEvents.findIndex(outEvent => outEvent.key === key);
        outIndex > -1 && outEvents.splice(outIndex, 1);

        newIndex --;
      }
    }

    outEvents.forEach(outEvent => outEvent.callback(enemy));
    newEvents.forEach(newEvent => newEvent.callback(enemy));

  }

  exitTile(outPos: Vector2, enemy: Enemy){
    const events = this.getEvents(outPos, "out", enemy);
    events.forEach(event => event.callback(enemy));
  }

  enterTile(inPos: Vector2, enemy: Enemy){
    const events = this.getEvents(inPos, "in", enemy);
    events.forEach(event => event.callback(enemy));
  }

  getEvents(position: Vector2, type: string, enemy): TileEvent[]{
    const finds = [];
    
    position && this.events.forEach(event => {
      if(event.x === position.x &&
        event.y === position.y &&
        event.type === type &&
        (!event.enemy || event.enemy.includes(enemy.key))
      ){
        finds.push(event);
      }
    })

    return finds;
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