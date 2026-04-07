import * as THREE from "three";
import { Vec2, KeyValue } from "./Base";
import { ActionData } from "./Action";

// ==========================================
// 地图数据
// ==========================================

export interface TileData {
  tileKey: string;
  passableMask: string;
  playerSideMask?: string;
  blackboard?: any;
  buildableType?: string;
  effects?: any;
  heightType?: string;
}

export interface PathNode {
  position: Vec2;
  distance: number;
  nextNode: PathNode | null;
}

export interface PathMap {
  map: PathNode[][];
  motionMode: string;
  targetPoint: Vec2;
}

// ==========================================
// 装置数据
// ==========================================

export interface trapData {
  isTokenCard: boolean;
  key: string;
  alias: string;
  direction: string;
  position: Vec2;
  skills: KeyValue[];
  mainSkillLvl: number;
  hidden: boolean;
  idleAnimate?: string;
  mesh?: THREE.Mesh;
  skeletonData?: any;
  textureMat?: THREE.MeshBasicMaterial;
  extraWaveKey?: string;
}


export interface ExtraWaveData{
  key: string,
  actionDatas: ActionData[][]
}