import WaveManager from "../enemy/WaveManager";
import { CountdownManager } from "../game/CountdownManager";
import BuffManager from "../game/BuffManager";
import GameManager from "../game/GameManager";
import GameView from "../game/GameView";
import MapModel from "../game/MapModel";
import SPFA from "../game/SPFA";
import TileManager from "../game/TileManager";
import TrapManager from "../game/TrapManager";
import SeededRandom from "./Random";

interface Global_Type{
  mapModel: MapModel,
  gameManager: GameManager,
  waveManager: WaveManager,
  trapManager: TrapManager,
  countdownManager: CountdownManager,
  SPFA: SPFA,
  buffManager: BuffManager,
  tileManager: TileManager,
  gameView: GameView,
  seededRandom: SeededRandom,
  [key: string]: any
}

const Global: Global_Type = {
  mapModel: null,
  gameManager: null,
  waveManager: null,
  trapManager: null,
  countdownManager: null,
  SPFA: null,
  buffManager: null,
  tileManager: null,
  gameView: null,
  seededRandom: null,

  reset: () => {
    Global.mapModel = null;
    Global.gameManager = null;
    Global.waveManager = null;
    Global.trapManager = null;
    Global.countdownManager = null;
    Global.SPFA = null;
    Global.buffManager = null;
    Global.tileManager = null;
    Global.gameView = null;
    Global.seededRandom = null;
  }
}



export default Global;