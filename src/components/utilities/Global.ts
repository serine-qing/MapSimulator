import WaveManager from "../enemy/WaveManager";
import { CountdownManager } from "../game/CountdownManager";
import GameBuff from "../game/GameBuff";
import GameManager from "../game/GameManager";
import GameView from "../game/GameView";
import SPFA from "../game/SPFA";
import TileManager from "../game/TileManager";
import TrapManager from "../game/TrapManager";

interface Global_Type{
  gameManager: GameManager,
  waveManager: WaveManager,
  trapManager: TrapManager,
  countdownManager: CountdownManager,
  SPFA: SPFA,
  gameBuff: GameBuff,
  tileManager: TileManager,
  gameView: GameView,
  [key: string]: any
}

const Global: Global_Type = {
  gameManager: null,
  waveManager: null,
  trapManager: null,
  countdownManager: null,
  SPFA: null,
  gameBuff: null,
  tileManager: null,
  gameView: null,

  reset: () => {
    Global.gameManager = null;
    Global.waveManager = null;
    Global.trapManager = null;
    Global.countdownManager = null;
    Global.SPFA = null;
    Global.gameBuff = null;
    Global.tileManager = null;
    Global.gameView = null;
  }
}



export default Global;