import { Vector2 } from "three";
import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

const addMoonLight = () => {
  
}

const addShadows = (position: Vector2, direction: string) => {
  const x1 = position.x;
  const y1 = position.y;
  let x2, y2;

  switch (direction) {
    case "left":
      x2 = -Infinity;
      y2 = y1;
      break;
    case "right":
      x2 = Infinity;
      y2 = y1;
      break;
    case "up":
      x2 = x1;
      y2 = Infinity;
      break;
    case "down":
      x2 = x1;
      y2 = -Infinity;
      break;
  }

  const rect = Global.tileManager.getRect(x1, x2, y1, y2);

  rect.forEach(tile => {
    if(tile.tileKey !== "tile_end" && tile.tileKey !== "tile_start" ){
      tile.addDynamicTexture("moonlight_shadow", "moonlight_shadow");
    }
  })
}

const Handler = {
  handleGameInit: () => {

    // addShadows(new Vector2(1,1), "right");
    // addShadows(new Vector2(5,4), "down");
    
  },

  handleEnemyStart: (enemy: Enemy) => {

  },

  handleTalent: (enemy: Enemy, talent: any) => {

  },

  handleSkill: (enemy: Enemy, skill: any) => {

  }
};

export default Handler;