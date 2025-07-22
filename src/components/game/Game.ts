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
    
    const simData = this.startSimulate(mapModel);
    this.gameManager = new GameManager(mapModel);
    this.gameManager.setSimulateData(simData);
  }

  //获取模拟数据
  startSimulate(mapModel: MapModel){
    //模拟环境禁用console.log
    const cacheFunc = console.log;
    
    // console.log = ()=>{
    //   return;
    // }
    const simulateGame = new GameManager(mapModel, true);

    const simData = {
      byEnemy: [],
      byTime: []  
    };
    const fuc = () => {
      simData.byEnemy.push(simulateGame.get());
    };
    eventBus.on("enemy_index_change", fuc);

    let time = 0;
    while( !simulateGame.isFinished ){
      if(simulateGame.currentSecond >= time){
        simData.byTime.push(simulateGame.get());
        time += GameConfig.SIMULATE_STEP;
      }
      simulateGame.gameLoop();
    }

    this.maxSecond = simData.byTime.length - 1;
    
    eventBus.remove("enemy_index_change", fuc);
    simulateGame.destroy();

    console.log = cacheFunc;
    return simData;
  }
}

export default Game;