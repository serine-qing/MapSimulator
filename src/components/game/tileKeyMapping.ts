/**
 *
 *  将解析后的tile数据与tile类进行绑定
 */

import Tile_Forbidden from "@/components/tile/tile_forbidden.js"
import Tile_Wall from "@/components/tile/tile_wall.js"
import Tile_Road from "@/components/tile/tile_road.js"
import Tile_Floor from "@/components/tile/tile_floor.js"
import Tile_Start from "@/components/tile/tile_start.js"
import Tile_End from "@/components/tile/tile_end.js"

const tileKeyMapping = {
  "tile_forbidden":Tile_Forbidden,
  "tile_wall":Tile_Wall,
  "tile_road":Tile_Road,                 //普通地面
  "tile_floor":Tile_Floor,
  "tile_start":Tile_Start,
  "tile_end":Tile_End,

  "tile_fence_bound":Tile_Forbidden,     //地面围栏
  "tile_rcm_crate":Tile_Road             //推荐障碍放置点
}

export default tileKeyMapping;