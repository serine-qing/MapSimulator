import GameManager from '@/components/game/GameManager';
import MapModel from '@/components/game/MapModel';
import eventBus from '@/components/utilities/EventBus';
import GameConfig from '@/components/utilities/GameConfig';

class Game{
  public gameManager: GameManager;
  public maxSecond: number;

  constructor(){
  }

  async startGame(mapModel: MapModel){
    if(this.gameManager){
      this.gameManager.destroy();
    }

    this.gameManager = new GameManager(mapModel);
    const simData = this.startSimulate(this.gameManager);
    this.gameManager.setSimulateData(simData);
    this.gameManager.start();
  }

  //获取模拟数据
  startSimulate(gameManager: GameManager){
    //模拟环境禁用console.log
    const cacheFunc = console.log;
    
    // console.log = ()=>{
    //   return;
    // }

    gameManager.isSimulate = true;
    const simData = {
      byAction: [],
      byTime: []  
    };
    const fuc = () => {
      simData.byAction.push(gameManager.get());
    };
    eventBus.on("action_index_change", fuc);

    let time = 0;
    while( !gameManager.isFinished ){
      if(gameManager.gameSecond >= time){
        simData.byTime.push(gameManager.get());
        time += GameConfig.SIMULATE_STEP;
      }
      gameManager.gameLoop();
    }

    this.maxSecond = simData.byTime.length - 1;
    
    eventBus.remove("action_index_change", fuc);

    gameManager.isSimulate = false;


    console.log = cacheFunc;
    return simData;
  }
}

export default Game;