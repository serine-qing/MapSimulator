import Enemy from "../enemy/Enemy";
import Trap from "../game/Trap";
import GameConfig from "../utilities/GameConfig";
import Global from "../utilities/Global";
import * as THREE from "three"
import { getPixelSize } from "../utilities/utilities";

//初始化雪崩区
const initAvalancheZone = (trap: Trap ,x1: number, x2: number, y1: number, y2: number) => {
  Global.tileManager.addRectEvents({
    key: "AvalancheZone",
    type: "in",
    x1, x2, y1, y2,
    callback: (enemy: Enemy) => {
      trap.addSPForSkill("Avalanche", 1);
    }
  })

  drawRect(x1, x2, y1, y2)
}

const drawRect = (x1: number, x2: number, y1: number, y2: number) => {
  const minX = Math.min(x1, x2) - 0.5;
  const maxX = Math.max(x1, x2) + 0.5;
  const minY = Math.min(y1, y2) - 0.5;
  const maxY = Math.max(y1, y2) + 0.5;

  const points = [
    new THREE.Vector3(getPixelSize(minX) , getPixelSize(minY), 0 ),
    new THREE.Vector3(getPixelSize(minX) , getPixelSize(maxY), 0 ),

    new THREE.Vector3(getPixelSize(minX) , getPixelSize(maxY), 0 ),
    new THREE.Vector3(getPixelSize(maxX) , getPixelSize(maxY), 0 ),

    new THREE.Vector3(getPixelSize(maxX) , getPixelSize(maxY), 0 ),
    new THREE.Vector3(getPixelSize(maxX) , getPixelSize(minY), 0 ),

    new THREE.Vector3(getPixelSize(maxX) , getPixelSize(minY), 0 ),
    new THREE.Vector3(getPixelSize(minX) , getPixelSize(minY), 0 )
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  const material = new THREE.MeshBasicMaterial( {
    color: "#ffffff",
    transparent: true,
    depthTest: false,
    depthWrite: false,
  } );
  const plane = new THREE.LineSegments( geometry, material );

  if(!Global.gameManager.isSimulate){
    Global.gameView.addDrawObject(plane);
  }
}

const Handler = {
  handleTrapStart:(trap: Trap) => {
    // if(trap.key === "trap_008_farm"){
    //   trap.addSkill({
    //     name: "Avalanche",
    //     initSp: 0,
    //     spCost: 10,
    //     spSpeed: 0,
    //     showSPBar: true,
    //     duration: 2,
    //     endCallback: () => {
    //       const enemys = Global.waveManager.getEnemysInRect(4, 7, 1, 6);
    //       enemys.forEach(enemy => {
    //         enemy.push(4, new THREE.Vector2(1, 0))
    //       })
    //     }
    //   })
    //   initAvalancheZone(trap, 4, 7, 1, 6);
    // }
  }
};

export default Handler;