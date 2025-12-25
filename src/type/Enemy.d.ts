declare global {
	interface EnemySkill{
		cooldown: number
		initCooldown: number
		prefabKey: string
		priority: number
		spCost: number
		blackboard: Record<string, number>
	}	
}

export {};