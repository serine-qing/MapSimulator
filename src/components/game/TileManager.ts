import AliasHelper from "./AliasHelper";
import Tile from "./Tile";

class TileManager{
  public tiles: Tile[][] = [];
  public flatTiles: Tile[] = [];
  public height: number;    //矩阵高度(y)
  public width: number;    //矩阵宽度(x)
  constructor(mapData:any){
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

  get(){
    const state = {
      tileStates: this.flatTiles.map(tile => tile.get())
    };

    return state;
  }

  set(state){
    for(let i = 0; i < this.flatTiles.length; i++){
      const tile = this.flatTiles[i];
      tile.set(state.tileStates[i]);
    }
  }
}

export default TileManager;