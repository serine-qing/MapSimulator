const GameConfig = {
  GAME_SPEED: 2, //游戏速度
  //地图倾斜角
  MAP_ROTATION : 0.5,
  FPS : 60,           
  //@ts-ignore
  BASE_URL : import.meta.env.VITE_API_URL,
  TILE_SIZE : 7,
  TILE_HEIGHT : 3/7, //高台地块的高度（按宽度为1计算）
  SIMULATE_STEP: 1,  //模拟数据间隔多少秒
  SPRITE_SIZE: [5, 5],   //雪碧图宽高
  OBJECT_SCALE: 0.012
}

GameConfig.OBJECT_SCALE =  GameConfig.TILE_SIZE / GameConfig.OBJECT_SCALE ;

export default GameConfig;