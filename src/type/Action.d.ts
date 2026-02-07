import { EnemyData, EnemyRoute } from "./Enemy";
import { trapData } from "./Map";

// ==========================================
// 行动数据
// ==========================================

export interface ActionData {
  enemyId?: number;
  actionType: string;
  key: string;
  routeIndex: number;
  startTime: number;
  fragmentTime: number;
  hiddenGroup: string;
  dontBlockWave: boolean;
  blockFragment: boolean;
  prtsSpawn?: boolean;
  route?: EnemyRoute;
  enemyData?: EnemyData;
  trapData?: trapData;
}
