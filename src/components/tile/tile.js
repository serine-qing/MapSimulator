import {Object3D,BoxGeometry,BoxHelper,Mesh} from "three"

/** 
 *   this.object：带边框tile
 *   this.cube：不带边框tile
 * 
*/
class Tile{
  /** 
   * @param {
   *   x:x轴位移 
   *   y:y轴位移 
   * } 
  */
  constructor(params = {}){
    this.width = 1;
    this.height = 1;
    this.margin = 0; //tile之间的间隔
    this.x = params.x ? params.x : 0;
    this.y = params.y ? params.y : 0;
    this.z = 0;
  }
  //单元格按一定比例转化为实际长宽
  cellChangetoNum (num){
    return num * 7;
  }
  render(){
    const geometry = new BoxGeometry( 
      this.cellChangetoNum(this.width)-this.margin,
      this.cellChangetoNum(this.width)-this.margin,
      this.cellChangetoNum(this.height),
    ); 
    this.cube = new Mesh( geometry, [
      this.sideMaterial,this.sideMaterial,this.sideMaterial,this.sideMaterial,this.topMaterial,this.topMaterial
    ]); 
    this.cube.position.x = this.cellChangetoNum(this.x);
    this.cube.position.y = this.cellChangetoNum(this.y);
    this.cube.position.z = this.z;

    this.object = new Object3D();
    this.object.add(this.cube);
  }
  //添加边框
  addBorder(color){
    this.border = new BoxHelper( this.cube, color);
    this.object.add(this.border);
  }
}

export default Tile;