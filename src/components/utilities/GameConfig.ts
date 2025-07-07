const GameConfig = {
  GAME_SPEED: 2, //游戏速度
  //地图倾斜角
  MAP_ROTATION : 0.5,
  FPS : 60,
  //@ts-ignore
  BASE_URL : import.meta.env.VITE_API_URL,
  TILE_SIZE : 7,
  SIMULATE_STEP: 1,  //模拟数据间隔多少秒
  SPRITE_SIZE: [5, 3],   //雪碧图宽高

}

export default GameConfig;