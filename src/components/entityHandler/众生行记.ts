import assetsManager from "../assetManager/assetsManager";
import Enemy from "../enemy/Enemy";
import RunesHelper from "../game/RunesHelper";
import Tile from "../game/Tile";
import Trap from "../game/Trap";
import Global from "../utilities/Global";
import Unrealshapes_BG from "@/assets/images/Unrealshapes_BG.png"

const Handler = {
  parseRunes: (runesHelper: RunesHelper) => {
    const levelCtrl = runesHelper.getRunes("env_system_new", "env_act42side_level_ctrl")[0];
    if(levelCtrl){
      const customData = Global.gameManager.customData;
      customData.hiddenRect = [];

      levelCtrl.blackboard.forEach(item => {
        if(item.key.includes("rect_")){
          customData.hiddenRect.push(item.valueStr.split("|"));
        }
      })
    }
  },

  parseExtraWave: (trapDatas: trapData[], branches: any, extraRoutes) => {
    trapDatas.forEach(trapData => {
      switch (trapData.key) {
        case "trap_250_hlctrl":
          const brancheData = branches?.popeRoute?.phases[0]?.actions;
          if(brancheData){
            let isFly = true;

            const customData = Global.gameManager.customData;
            customData.popeKeys = [];
            customData.popeIndex = 0;
            brancheData.forEach((branche, index) => {
              //YJ这乱填key 有的不是圣徒也填进去了
              branche.key = "enemy_1567_pope";
              //YJ乱填motionMode，还有人类吗，这游戏到底是怎么跑起来的
              extraRoutes[branche.routeIndex].motionMode = isFly? "FLY" : "WALK";
              isFly = !isFly;

              const key = `phase${index}`;
              customData.popeKeys.push(key);
              Global.mapModel.parseExtraActions(key ,[
                {
                  preDelay: 0,
                  actions: [branche]
                }
              ])
            })
          }

          break;
      }
    })
  },

  afterGameInit: () => {
    const customData = Global.gameManager.customData;

    if(customData.hiddenRect){
      assetsManager.loadTexture([Unrealshapes_BG]).then(res => {
        Global.gameView.setBgImage(res[0]);
      })

      customData.hiddenRect.forEach((rects, index) => {
        const hiddenRectTiles: Tile[] = [];
        rects.forEach(rect => {
          const vecs = rect.replace(/[()\s]/g, "").split(",");
          const x1 = parseInt(vecs[1]);
          const x2 = parseInt(vecs[3]);
          const y1 = parseInt(vecs[0]);
          const y2 = parseInt(vecs[2]);

          for(let x = x1; x <= x2; x++ ){
            for(let y = y1; y <= y2; y++ ){
              hiddenRectTiles.push(Global.tileManager.getTile(x, y));
            }
          }

        })
        customData.hiddenRect[index] = hiddenRectTiles;
        
        hiddenRectTiles.forEach(tile => {
          tile.setVisible(false);
        })

      })
    }
  },

  handleTrapStart: (trap: Trap) => {
    switch (trap.key) {
      //寻根圣事 绑定事件
      case "trap_250_hlctrl":
        //寻根圣事 开启下一boss波次
        trap.bindEvent("ShownNextTile", () => {
          const customData = Global.gameManager.customData;

          //显示隐藏的tile
          customData.hiddenRect[customData.popeIndex]?.forEach(tile => {
            tile.setVisible(true);
          })

          const popeKey = customData.popeKeys[customData.popeIndex];
          if(popeKey !== undefined){

            Global.waveManager.startExtraAction({
              key: popeKey
            });
            customData.popeIndex += 1; 
          }

        })

        break;
    }
  },

  handleEnemyStart: (enemy: Enemy) => {
    switch (enemy.key) {
      case "enemy_1567_pope":
        if(Global.gameManager.customData.popeIndex > 0){
          if(enemy.route.motionMode === "WALK"){
            enemy.motion = "WALK";
            enemy.animationStateTransition({
              idleAnimate: "B_Idle_1",
              moveAnimate: "B_Move_1",
              transAnimation: "B_Start_1",
              isWaitTrans: true,
            })

          }else if(enemy.route.motionMode === "FLY"){
            enemy.motion = "FLY";
            enemy.animationStateTransition({
              idleAnimate: "B_Idle_2",
              moveAnimate: "B_Move_2",
              transAnimation: "B_Start_2",
              isWaitTrans: true,
            })
          }
        }else{
          //一阶段移速150%
          enemy.addBuff({
            id: "speedup",
            key: "speedup",
            overlay: false,
            effect: [{
              attrKey: "moveSpeed",
              method: "mul",
              value: 1.5
            }]
          })
        }
        
        break;
    }
  },

  handleTalent: (enemy: Enemy, talent: any) => {

    const {duration, range_radius} = talent.value;
    // switch (talent.key) {
    //   case "":
    //     console.log(enemy)
    //     break;
    // }
  },

  handleSkill: (enemy: Enemy, skill: any) => {
    const { initCooldown, cooldown } =  skill;
    switch (skill.prefabKey) {
      case "foreverenhance":
        const skilltrigger = enemy.getTalent("skilltrigger");
        const move_speed_add = skill.blackboard.move_speed_add;
        const atk_add = skill.blackboard.atk_add;
        enemy.addSkill({
          name: "foreverenhance",
          animateTransition: {
            transAnimation: "Skill",
            isWaitTrans: true
          },
          initCooldown: skilltrigger.interval,
          cooldown: skilltrigger.interval,
          maxCount: skilltrigger.max_stack_cnt,
          cooldownStop: false,
          callback: (timer) => {
            enemy.addBuff({
              id: "attributestorage",
              key: "attributestorage",
              overlay: false,
              effect: [
                {
                  attrKey: "moveSpeed",
                  method: "mul",
                  value: 1 + timer.count * move_speed_add
                },
                {
                  attrKey: "atk",
                  method: "mul",
                  value: 1 + timer.count * atk_add
                }
              ]
            })
          }
        })
        break;
      
      case "rangeheal":

        enemy.addSkill({
          name: "rangeheal",
          animateTransition: {
            transAnimation: "Skill",
            isWaitTrans: true,
            animationScale: 1
          },
          initCooldown,
          cooldown
        })
        break;
    }
  }
};

export default Handler;