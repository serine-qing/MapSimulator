
import {TileData} from "@/components/utilities/Interface.ts"

class MapTiles{
  private matrix: TileData[][]

  constructor(mapData:any){
    this.matrix = mapData.map.map((row, rowIndex)=>{
      //row是一行tile的数组,rowIndex为坐标轴中的y值
      return row.map((item, index)=>{

        const tile = mapData.tiles[item];
        const tileData: TileData = {
          tileKey: tile.tileKey,
          passableMask: tile.passableMask
        }

        //index为坐标轴中的x值
        return tileData;
      })
    }).reverse();
  }

  //根据xy坐标获取地图tile（x：朝右坐标轴 y：朝上坐标轴）
  public get(x: number, y: number): TileData{
    const column = this.matrix[y];
    if(column && column[x]){
      return column[x];
    }
    else{
      return null;
    }  
  }

  //获取矩阵高度(y)
  public height(): number{
    return this.matrix.length;
  }

  //获取矩阵宽度(x)
  public width(): number{
    return this.matrix[0]?.length
  }

  public getMatrix(): TileData[][]{
    return this.matrix;
  }

  //获取某个地板是否可地面通行
  isTilePassable(x: number, y: number): boolean{
    const tile = this.get(x, y);
    return tile !== null && tile.passableMask === "ALL";
  }

  //获取某个地板是否可飞行
  isTileFlyable(x: number, y: number): boolean{
    const tile = this.get(x, y);
    return tile !== null && (tile.passableMask === "FLY_ONLY" || tile.passableMask === "ALL");
  }
}

export default MapTiles;