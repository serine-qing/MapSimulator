import { ExtraWaveData } from "@/type/Map";
import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import type Handler from "./Handler";
import { Vector2 } from "three";
import { CheckPoint, EnemyRoute } from "@/type";

class act51side implements Handler{
	private boss: Enemy;
	private boss_reborn_tile: Vector2;
	private boss_reborn_route: EnemyRoute;
	private summonEnemys1: string[];
	private summonEnemys2: string[];
	private auraMovespeed: number;

	afterParseExtraWave(extraWaves: ExtraWaveData[]) {
		extraWaves.forEach(wave => {
			if(wave.key === "p2route"){
				const route = wave.actionDatas?.[0]?.[0]?.route;
				if(route){
					this.boss_reborn_route = route;
					this.boss_reborn_route.checkpoints.unshift({
						type: "MOVE",
						position: this.boss_reborn_tile,
						time: 0,
						reachOffset: {x: 0, y: 0},
						randomizeReachOffset: false
					})
				}
			}
		})
	}
	handleTileInit(tile: Tile) {
		if(tile.blackboard && tile.blackboard[0] && tile.blackboard[0].key === "boss_reborn_tile"){
			this.boss_reborn_tile = tile.position;
		}
	}
  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_1587_ubbplwq": //巴普洛维奇，枢密官
				this.boss = enemy;
				enemy.canReborn = true;
				//演讲
				const speech = enemy.getSkill("skill_speech");

				const {enemy_key_list, enemy_key_list_2} = speech.blackboard;
				this.summonEnemys1 = enemy_key_list.split("|");
				this.summonEnemys2 = enemy_key_list_2.split("|");
				
				this.addSpeechSkill();
				enemy.addHPDoT(enemy.hp * 0.006);

				const aura = enemy.getTalent("talentcrazeaura");
				this.auraMovespeed = 1 + aura.move_speed;
				break;
    }
  }

	addSpeechSkill() { 
		const speech = this.boss.getSkill("skill_speech");
		const prefix = this.boss.reborned ? "B" : "A";
		this.boss.addSkill({
			name: "speech",
			cooldown: speech.cooldown,
			autoTrigger: false,
			initCooldown: speech.initCooldown,
			duration: speech.blackboard.speech_duration,
			animateTransition: {
				idleAnimate: `${prefix}_Skill_2_Loop`,
				moveAnimate: `${prefix}_Skill_2_Loop`,
				transAnimation: `${prefix}_Skill_2_Begin`,
				isWaitTrans: true
			},
			endAnimateTransition: {
				idleAnimate: `${prefix}_Idle`,
				moveAnimate: `${prefix}_Move`,
				transAnimation: `${prefix}_Skill_2_End`,
				isWaitTrans: true,
				callback: () => { 
					this.boss.unMoveable = false;
					this.removeAura();
				}
			},
			callback: () => { 
				this.boss.unMoveable = true;
				this.addAura();
				this.summonEnemys();
			}
		});
	}

	/**
	 * boss技能位于停驻检查点上时才能触发；每个停驻检查点只能触发一次
	 */
	handleChangeCheckPoint(enemy: Enemy, oldCP: CheckPoint, newCP: CheckPoint | null) {
		if(enemy.key === "enemy_1587_ubbplwq"){
			if(newCP && newCP.type === "WAIT_FOR_SECONDS"){
				enemy.triggerSkill("speech");
			}
		}
	}

	handleReborn(enemy: Enemy) {
    if(enemy.key === "enemy_1587_ubbplwq"){
      enemy.canReborn = false;
			enemy.removeSkill("speech");
			enemy.removeHPDoT();

			//更换路径
			enemy.setRoute(this.boss_reborn_route);
			enemy.checkPointIndex = 0;

			//改编动画
			enemy.animationStateTransition({
        idleAnimate: "Revive_Idle",
        moveAnimate: "Revive_Move",
        transAnimation: "Revive_Begin",
        isWaitTrans: true,
      });

			enemy.countdown.addCountdown({
				name: "reborn_move",
				initCountdown: 0,
				countdown: 0,
				callback: () => {
					const offsetX = Math.abs(enemy.position.x - this.boss_reborn_tile.x);
					const offsetY = Math.abs(enemy.position.y - this.boss_reborn_tile.y);
					if(offsetX < 0.05 && offsetY < 0.05){
						this.bossReborn();
					}
				}
			})

    }
  }

	/**
	 * boss重生
	 */
	bossReborn() { 
		const talentreborn = this.boss.getTalent("talentreborn");
		const {duration, hp_ratio} = talentreborn;
		const maxHp = this.boss.getAttr("maxHp");
		this.boss.unMoveable = true;
		this.boss.countdown.addCountdown({
			name: "talentreborn",
			initCountdown: duration * 2,
			countdown: duration * 2,
			callback: () => {
				this.boss.changeHP(maxHp * hp_ratio * 2);
				if(this.boss.hp >= maxHp){
					this.boss.countdown.removeCountdown("talentreborn");
					this.boss.animationStateTransition({
						idleAnimate: "B_Idle",
						moveAnimate: "B_Move",
						transAnimation: "Revive_End",
						isWaitTrans: true,
					});
					this.boss.unMoveable = false;
					this.addSpeechSkill();
					this.startP2Enemy();
				}
			}
		})
		this.boss.countdown.removeCountdown("reborn_move");
	}

	//二阶段的额外出怪
	startP2Enemy() {
		const talentmode2_enemybranch = this.boss.getTalent("talentmode2_enemybranch");
		const branch_id = talentmode2_enemybranch.branch_id;
		Global.waveManager.startExtraAction({
			key: branch_id
		});
	}

	//召唤小怪
	summonEnemys(){
		const speech = this.boss.getSkill("skill_speech");
		const {speech_duration, interval} = speech.blackboard;

		const pos = this.boss.tilePosition;
		const tiles = Global.tileManager.getRect(pos.x -2, pos.x +2, pos.y -2, pos.y +2).filter(tile => tile.isPassable());

		//蓝门
		const tile_end = Global.tileManager.flatTiles.find(tile => tile.tileKey === "tile_end");
		const currentEnemyKeys = this.boss.reborned ? this.summonEnemys2 : this.summonEnemys1;

		this.boss.countdown.addCountdown({
			name: "summonEnemys",
			initCountdown: 0,
			countdown: interval,
			maxCount: Math.floor(speech_duration / interval),
			callback: (timer) => { 
				const randomInt = Global.seededRandom.nextInt(0, tiles.length - 1);
				const currentTile = tiles[randomInt];
				const enemyIndex = (timer.count - 1)  % currentEnemyKeys.length;
				const enemyKey = currentEnemyKeys[enemyIndex];
				
				Global.waveManager.spawnExtraEnemy(currentTile.position, tile_end.position, enemyKey);
			}
		})

	}

	//5X5加速buff
	addAura(){
		const pos = this.boss.tilePosition;
		Global.tileManager.addRectEvents({
			key: "talentcrazeaura",
			type: "in",
			x1: pos.x - 2,
			x2: pos.x + 2,
			y1: pos.y - 2,
			y2: pos.y + 2,
			callback: (enemy: Enemy) => { 
				enemy.addBuff({
					id: "speedup",
					key: "speedup",
					overlay: false,
					effect: [{
						attrKey: "moveSpeed",
						method: "mul",
						value: this.auraMovespeed
					}]
				})
			}
		});

		Global.tileManager.addRectEvents({
			key: "talentcrazeaura",
			type: "out",
			x1: pos.x - 2,
			x2: pos.x + 2,
			y1: pos.y - 2,
			y2: pos.y + 2,
			callback: (enemy: Enemy) => { 
				enemy.removeBuff("speedup");
			}
		})
	}

	removeAura(){
		const pos = this.boss.tilePosition;
		Global.tileManager.removeRectEvents({
			key: "talentcrazeaura",
			type: "in",
			x1: pos.x - 2,
			x2: pos.x + 2,
			y1: pos.y - 2,
			y2: pos.y + 2
		});

		Global.tileManager.removeRectEvents({
			key: "talentcrazeaura",
			type: "out",
			x1: pos.x - 2,
			x2: pos.x + 2,
			y1: pos.y - 2,
			y2: pos.y + 2
		});
	}
}

export default act51side;
