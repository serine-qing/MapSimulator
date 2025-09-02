import act42side from "../entityHandler/众生行记";
import act45side from "../entityHandler/无忧梦呓";

const GameHandler = {
  //初始化全部Actions后执行
  handleGameInit: () => {
    act42side.handleGameInit();
    act45side.handleGameInit();
  }
}

export default GameHandler;