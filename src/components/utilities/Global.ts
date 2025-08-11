import GameManager from "../game/GameManager";

const Global = {
  gameManager: null,
  _waveManager: null,
  _trapManager: null,
  _countdownManager: null,
  _SPFA: null,
  _gameBuff: null,
  _tileManager: null,
  _gameView: null,

  waveManager: null,
  trapManager: null,
  countdownManager: null,
  SPFA: null,
  gameBuff: null,
  tileManager: null,
  gameView: null,

  changeGameManager: (gameManager: GameManager) => {
    Global.gameManager = gameManager;
  },

  reset: () => {
    Global.gameManager = null;
    Global._waveManager = null;
    Global._trapManager = null;
    Global._countdownManager = null;
    Global._SPFA = null;
    Global._gameBuff = null;
    Global._tileManager = null;
    Global._gameView = null;
  }
}

Object.defineProperties(Global, {
  waveManager: {
    get:() => {
      if(!Global._waveManager) Global._waveManager = Global.gameManager.waveManager;
      return Global._waveManager;
    }
  },
  trapManager: {
    get:() => {
      if(!Global._trapManager) Global._trapManager = Global.gameManager.trapManager;
      return Global._trapManager;
    }
  },
  countdownManager: {
    get:() => {
      if(!Global._countdownManager) Global._countdownManager = Global.gameManager.countdownManager;
      return Global._countdownManager;
    }
  },
  SPFA: {
    get:() => {
      if(!Global._SPFA) Global._SPFA = Global.gameManager.SPFA;
      return Global._SPFA;
    }
  },
  gameBuff: {
    get:() => {
      if(!Global._gameBuff) Global._gameBuff = Global.gameManager.gameBuff;
      return Global._gameBuff;
    }
  },
  tileManager: {
    get:() => {
      if(!Global._tileManager) Global._tileManager = Global.gameManager.tileManager;
      return Global._tileManager;
    }
  },
  gameView: {
    get:() => {
      if(!Global._gameView) Global._gameView = Global.gameManager.gameView;
      return Global._gameView;
    }
  },
})

export default Global;