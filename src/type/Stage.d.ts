// 关卡信息
export interface Stage {
  operation: string;
  name: string;
  description: string;
  episode: string;
  levelId: string;
  hasChallenge: boolean;
  challenge?: string;
}
