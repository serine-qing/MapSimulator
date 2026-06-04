<template>
  <div class="crisis-contract-page">
    <!-- 主地图区域 -->
    <div class="map-scroll-container">
      <div class="map-content" :style="mapContentStyle">
        <!-- SVG 连线层 -->
        <svg class="svg-layer" :width="canvasWidth" :height="canvasHeight">
          <!-- 绘制道路 -->
          <path
            v-for="(road, index) in displayRoads"
            :key="`road-${index}`"
            :d="road.path"
            :class="['road-line', { active: road.isActive }]"
            fill="none"
            :stroke="road.isActive ? '#e74c3c' : '#666'"
            :stroke-width="road.isActive ? 3 : 2"
          />
        </svg>

        <!-- 指标集指示器层 -->
        <div
          v-for="pack in packIndicators"
          :key="`pack-${pack.id}`"
          class="pack-indicator"
          :class="{ active: pack.isActive }"
          :style="{ left: `${pack.x}px`, top: `${pack.y}px` }"
          @click="handlePackClick(pack)"
        >
          <div class="pack-name">{{ pack.name }}</div>
        </div>

        <!-- 节点层 -->
        <div
          v-for="node in displayNodes"
          :key="node.id"
          class="node-item"
          :style="{ left: `${node.x}px`, top: `${node.y}px` }"
          :class="[
            node.type,
            {
              selected: isNodeActive(node.id),
              selectable: node.selectable,
              locked: node.locked
            }
          ]"
          @click="handleNodeClick(node)"
        >
          <!-- START 节点 -->
          <template v-if="node.type === 'start'">
            <div class="start-dot"></div>
          </template>

          <!-- NORMAL 词条节点 -->
          <template v-else-if="node.type === 'rune'">
            <div class="rune-card">
              <div class="rune-content">
                <div class="rune-name">{{ node.runeName }}</div>
              </div>
              <div class="rune-score-bar">
                <div class="rune-score-triangle"></div>
                <div class="rune-score-text">{{ node.score }}</div>
              </div>
            </div>
            <div v-if="node.hasConflict" class="conflict-badge">OR</div>
          </template>

          <!-- KEYPOINT 节点 - 样式与START相同 -->
          <template v-else-if="node.type === 'keypoint'">
            <div class="start-dot"></div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue'
import { getMapData } from '@/api/stages'

// ==================== 后端 API 数据获取 ====================

// 从后端获取处理后的地图数据
async function fetchMapData(mapId: string) {
  const { data } = await getMapData(mapId)
  return data
}

// 类型定义
interface NodeItem {
  id: string
  type: 'start' | 'rune' | 'keypoint' | 'treasure'
  x: number
  y: number
  runeName: string
  score: number
  targetScore: number
  hasConflict: boolean
  claimable: boolean
  selectable: boolean
  locked: boolean
  runeId: string | null
  slotPackId?: string | null  // 所属指标集ID
}

interface RoadItem {
  path: string
  isActive: boolean
}

// 指标集（pack）数据类型
interface PackData {
  slotPackId: string
  slotPackType: string
  slotPackName: string
  slotPackFullName: string
  rewardScore: number  // 完成该指标集的奖励分数
  isDaily: boolean
  sortId: number
}

// 指标集指示器类型
interface PackIndicator {
  id: string
  name: string
  x: number
  y: number
  isActive: boolean
  nodeIds: string[]
}

// 大型数据结构使用 shallowRef 提升性能（不会深层监听）
const mapData = shallowRef<any>(null)
const nodePosMap = shallowRef<Map<string, {x: number, y: number}>>(new Map())
const roadPosMap = shallowRef<Map<string, any>>(new Map())
const nodes = shallowRef<Map<string, any>>(new Map())
const roads = shallowRef<any[]>([])
const packDataMap = shallowRef<Map<string, PackData>>(new Map())  // 指标集数据
const selectedRuneNodes = shallowRef<Set<string>>(new Set())

// 基础类型使用 ref
const currentScore = defineModel<number>({ default: 0 })
const packBonusScore = ref(0)  // 指标集奖励分数
const globalYOffset = ref(0)  // 全局 Y 轴偏移（让所有内容向上移动）

// ==================== 画布和布局常量 ====================
const canvasWidth = ref(3000)      // Canvas 宽度（像素），会根据内容自动调整
const canvasHeight = ref(1500)     // Canvas 高度（像素），会根据内容自动调整
const offsetX = 10                 // 水平偏移量（像素）：所有节点/道路/指示器的基准 X 偏移
const offsetY = 800                // 垂直偏移量（像素）：JSON 坐标系原点在屏幕上的 Y 位置
const scale = 1.5                  // 缩放比例：JSON 坐标到屏幕像素的转换比例

// ==================== 缩放控制 ====================
const zoomLevel = defineModel<number>('zoom', { default: 1.0 })

// 当前地图ID
const CURRENT_MAP_ID = 'crisis_v2_04-01'  // 当前显示的地图标识符，用于从 JSON 获取对应数据

// 地图内容样式（包含缩放变换）
const mapContentStyle = computed(() => ({
  width: `${canvasWidth.value}px`,
  height: `${canvasHeight.value}px`,
  transform: `scale(${zoomLevel.value})`,
  transformOrigin: 'top left',  // 以左上角为缩放基准点
  transition: 'transform 0.2s ease'  // 平滑过渡动画
}))


// ==================== RuneData 类型定义 ====================

// Blackboard 项
interface BlackboardItem {
  key: string
  value?: number
  valueStr?: string
}

// Rune 配置项（在 packedRune.runes 数组中）
interface RuneConfig {
  key: string
  blackboard: BlackboardItem[]
}

// PackedRune 数据
interface PackedRune {
  id: string
  points: number
  mutexGroupKey: string | null
  description: string[]  // 包含占位符如 {atk:0%}
  runes: RuneConfig[]
}

// 完整的 RuneData（来自 runeDataMap）
interface RuneData {
  runeId: string
  runeGroupId: string
  runeIcon: string
  runeName: string
  score: number
  dimension: number
  packedRune: PackedRune
  sortId: number
}

// 获取所有选中节点对应的 runeDataMap 数据
function getSelectedRunesData(): RuneData[] {
  const selectedRunes: RuneData[] = []
  
  selectedRuneNodes.value.forEach(nodeId => {
    const nodeData = nodes.value.get(nodeId)
    if (nodeData?.runeId) {
      const runeData = mapData.value?.runeDataMap?.[nodeData.runeId]
      if (runeData) {
        selectedRunes.push(runeData as RuneData)
      }
    }
  })
  
  return selectedRunes
}

// Y 轴压缩偏移量（由后端预计算）
const packOffsets = ref<Record<string, number>>({})
const maxOffset = ref(0)
const sortedPacks = ref<Array<{ packId: string, minY: number, maxY: number }>>([])

// 计算所有活跃的节点（包括START、选中的RUNE、以及自动激活的KEYPOINT）
const activeNodes = computed(() => {
  const active = new Set<string>()
  
  // 1. 添加所有START节点
  nodes.value.forEach((nodeData: any, id: string) => {
    if (nodeData.nodeType === 'START') {
      active.add(id)
    }
  })
  
  // 2. 添加用户选中的RUNE节点
  selectedRuneNodes.value.forEach(id => active.add(id))
  
  // 3. 自动激活所有可达的KEYPOINT
  let changed = true
  while (changed) {
    changed = false
    nodes.value.forEach((nodeData: any, id: string) => {
      if (nodeData.nodeType !== 'KEYPOINT') return
      if (active.has(id)) return
      
      const incomingRoads = roads.value.filter((r: any) => 
        r.end.type === 'NODE' && r.end.id === id
      )
      
      const shouldActivate = incomingRoads.some((r: any) => 
        r.start.type === 'NODE' && active.has(r.start.id)
      )
      
      if (shouldActivate) {
        active.add(id)
        changed = true
      }
    })
  }
  
  return active
})

function isNodeActive(nodeId: string): boolean {
  return activeNodes.value.has(nodeId)
}

// 获取节点的压缩后 Y 坐标
function getCompressedY(originalY: number, packId: string | null = null): number {
  // 如果有 pack，直接使用该 pack 的偏移量（确保 pack 内所有节点使用相同偏移）
  if (packId !== null) {
    return originalY - (packOffsets.value[packId] || 0)
  }

  // 无 pack 的节点（如 START）：找到它上方最近的 pack，应用该 pack 的偏移量
  let offset = 0
  for (const pack of sortedPacks.value) {
    if (originalY >= pack.minY) {
      offset = Math.max(offset, packOffsets.value[pack.packId] || 0)
    }
  }
  return originalY - offset
}

const displayNodes = computed(() => {
  const result: NodeItem[] = []
  const actives = activeNodes.value
  
  // 卡片尺寸（用于居中偏移）- 必须与 CSS 中的 .rune-card 尺寸一致
  const cardWidth = 80
  const cardHeight = 80
  // KEYPOINT/START 圆点尺寸
  const dotSize = 24
  
  nodes.value.forEach((nodeData: any, id: string) => {
    const pos = nodePosMap.value.get(id)
    if (!pos) return

    const type = getNodeType(nodeData.nodeType)
    const isActive = actives.has(id)
    const isSelectable = checkSelectable(id, nodeData, actives)
    const runeInfo = getRuneInfo(nodeData.runeId)
    
    // 计算位置：节点坐标对应中心点，应用 Y 轴压缩（传入 packId）
    const centerX = pos.x * scale + offsetX
    const originalCenterY = -pos.y * scale + offsetY
    const compressedY = getCompressedY(originalCenterY, nodeData.slotPackId || null)
    
    // 根据节点类型使用不同的偏移
    const offsetX_val = type === 'start' || type === 'keypoint' ? dotSize / 2 : cardWidth / 2
    const offsetY_val = type === 'start' || type === 'keypoint' ? dotSize / 2 : cardHeight / 2
    
    // 应用全局 Y 轴偏移（让内容从顶部开始）
    const finalY = compressedY + globalYOffset.value
    
    result.push({
      id,
      type,
      x: centerX - offsetX_val,
      y: finalY - offsetY_val,
      runeName: runeInfo.name,
      score: runeInfo.score,
      targetScore: getKeypointScore(id),
      hasConflict: !!nodeData.mutualExclusionGroup,
      claimable: type === 'treasure' && currentScore.value >= getKeypointScore(id),
      selectable: isSelectable,
      locked: !isActive && !isSelectable,
      runeId: nodeData.runeId,
      slotPackId: nodeData.slotPackId || null
    })
  })
  return result
})

// 计算指标集指示器位置和状态
const packIndicators = computed(() => {
  const result: PackIndicator[] = []
  const actives = activeNodes.value
  
  packDataMap.value.forEach((packData, packId) => {
    // 获取该 pack 下的所有节点（使用压缩后的 Y 坐标）
    const packNodeIds: string[] = []
    const packNodePositions: Array<{x: number, y: number}> = []
    
    nodes.value.forEach((nodeData, nodeId) => {
      if (nodeData.slotPackId === packId) {
        packNodeIds.push(nodeId)
        const pos = nodePosMap.value.get(nodeId)
        if (pos) {
          const originalY = -pos.y * scale + offsetY
          const compressedY = getCompressedY(originalY, packId)
          packNodePositions.push({
            x: pos.x * scale + offsetX,
            y: compressedY
          })
        }
      }
    })
    
    if (packNodeIds.length === 0) return
    
    // 计算平均位置（中心点）
    const avgX = packNodePositions.reduce((sum, p) => sum + p.x, 0) / packNodePositions.length
    const minY = Math.min(...packNodePositions.map(p => p.y))
    
    // 检查该 pack 是否已激活
    let isActive = true
    
    // 按互斥组分组检查
    const groupMap = new Map<string | null, string[]>()
    packNodeIds.forEach(nodeId => {
      const nodeData = nodes.value.get(nodeId)
      if (nodeData?.nodeType === 'NORMAL') {
        const group = nodeData.mutualExclusionGroup || null
        if (!groupMap.has(group)) {
          groupMap.set(group, [])
        }
        groupMap.get(group)!.push(nodeId)
      }
    })
    
    groupMap.forEach((nodeIds, groupKey) => {
      if (groupKey === null) {
        // 非互斥节点：必须全部激活
        const allActive = nodeIds.every(id => actives.has(id))
        if (!allActive) isActive = false
      } else {
        // 互斥节点：只需最高分的一个激活
        const scoredNodes = nodeIds.map(id => ({
          id,
          score: getRuneInfo(nodes.value.get(id)?.runeId).score
        }))
        const maxScore = Math.max(...scoredNodes.map(n => n.score))
        const highestNodes = scoredNodes.filter(n => n.score === maxScore)
        const hasHighestSelected = highestNodes.some(n => actives.has(n.id))
        if (!hasHighestSelected) isActive = false
      }
    })
    
    // 指示器放在最上方节点上方（留出足够空间：指示器高度28 + 间距62 = 90px）
    // 应用全局 Y 轴偏移
    result.push({
      id: packId,
      name: packData.slotPackFullName || packData.slotPackName,
      x: avgX - 180,
      y: minY - 90 + globalYOffset.value, // 指示器高度28 + 间距62 + 全局偏移
      isActive,
      nodeIds: packNodeIds
    })
  })
  
  return result
})

// 获取道路点的压缩后 Y 坐标（需要知道该点属于哪个节点来应用偏移）
function getRoadCompressedY(y: number, nodeId: string): number {
  const nodeData = nodes.value.get(nodeId)
  if (!nodeData) return y

  const packId = nodeData.slotPackId || null
  if (packId !== null) {
    return y - (packOffsets.value[packId] || 0)
  }

  // 无 pack 的节点：找到它上方最近的 pack，应用该 pack 的偏移量
  let offset = 0
  for (const pack of sortedPacks.value) {
    if (y >= pack.minY) {
      offset = Math.max(offset, packOffsets.value[pack.packId] || 0)
    }
  }
  return y - offset
}

const displayRoads = computed(() => {
  const result: RoadItem[] = []
  const actives = activeNodes.value
  
  // 使用 roadPosMap 中的预计算道路坐标
  roadPosMap.value.forEach((roadPos: any, roadId: string) => {
    // 找到对应的 roadRelationData
    const road = roads.value.find((r: any) => r.id === roadId || r.roadId === roadId)
    if (!road) return
    if (road.start?.type !== 'NODE' || road.end?.type !== 'NODE') return
    
    // 检查 roadPos 是否有效
    if (!roadPos || !roadPos.centerPos || !roadPos.startPos || !roadPos.endPos) {
      return
    }
    
    const isActive = actives.has(road.start.id) && actives.has(road.end.id)
    
    // 计算道路起点和终点的绝对坐标（应用 Y 轴压缩 + 全局偏移）
    const sx = (roadPos.centerPos.x + roadPos.startPos.x) * scale + offsetX
    const originalSy = -(roadPos.centerPos.y + roadPos.startPos.y) * scale + offsetY
    const sy = getRoadCompressedY(originalSy, road.start.id) + globalYOffset.value
    
    const ex = (roadPos.centerPos.x + roadPos.endPos.x) * scale + offsetX
    const originalEy = -(roadPos.centerPos.y + roadPos.endPos.y) * scale + offsetY
    const ey = getRoadCompressedY(originalEy, road.end.id) + globalYOffset.value
    
    // 构建路径：如果有拐点，使用拐点
    let path = `M ${sx} ${sy}`
    
    // 如果有拐点，添加拐点
    if (roadPos.inflectionList && roadPos.inflectionList.length > 0) {
      roadPos.inflectionList.forEach((inflection: any) => {
        const ix = (roadPos.centerPos.x + inflection.cornerPos.x) * scale + offsetX
        const originalIy = -(roadPos.centerPos.y + inflection.cornerPos.y) * scale + offsetY
        // 拐点属于起点节点
        const iy = getRoadCompressedY(originalIy, road.start.id) + globalYOffset.value
        path += ` L ${ix} ${iy}`
      })
    }
    
    path += ` L ${ex} ${ey}`
    
    result.push({ path, isActive })
  })
  
  return result
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  try {
    // 调用 API 获取处理后的数据（模拟前后端分离）
    const apiData = await fetchMapData(CURRENT_MAP_ID)
    
    // 使用临时变量构建数据，最后一次性赋值给 shallowRef
    const newNodePosMap = new Map<string, {x: number, y: number}>()
    const newRoadPosMap = new Map<string, any>()
    const newNodes = new Map<string, any>()
    const newRoads: any[] = []
    const newPackDataMap = new Map<string, PackData>()

    // 加载节点数据
    apiData.nodes.forEach(node => {
      newNodes.set(node.id, {
        nodeType: node.nodeType,
        runeId: node.runeId,
        slotPackId: node.slotPackId,
        mutualExclusionGroup: node.mutualExclusionGroup
      })
      newNodePosMap.set(node.id, node.position)
    })

    // 加载道路数据
    apiData.roads.forEach(road => {
      newRoads.push({
        id: road.id,
        start: { type: 'NODE', id: road.startId },
        end: { type: 'NODE', id: road.endId }
      })
      newRoadPosMap.set(road.id, road.positions)
    })

    // 加载指标集（pack）数据
    apiData.packs.forEach(pack => {
      newPackDataMap.set(pack.id, {
        slotPackId: pack.id,
        slotPackType: pack.slotPackType,
        slotPackName: pack.slotPackName,
        slotPackFullName: pack.slotPackFullName,
        rewardScore: pack.rewardScore,
        isDaily: pack.isDaily,
        sortId: pack.sortId
      })
    })

    // 构建 mapData 结构（包含 runes）
    const runeDataMap: Record<string, any> = {}
    apiData.runes.forEach(rune => {
      runeDataMap[rune.runeId] = {
        runeId: rune.runeId,
        runeGroupId: rune.runeGroupId,
        runeIcon: rune.runeIcon,
        runeName: rune.runeName,
        score: rune.score,
        packedRune: rune.packedRune
      }
    })

    // 一次性赋值给 shallowRef，触发更新
    mapData.value = {
      mapId: apiData.mapId,
      mapName: apiData.mapName,
      mapCode: apiData.mapCode,
      runeDataMap
    }
    nodePosMap.value = newNodePosMap
    roadPosMap.value = newRoadPosMap
    nodes.value = newNodes
    roads.value = newRoads
    packDataMap.value = newPackDataMap
    packOffsets.value = apiData.packOffsets || {}
    maxOffset.value = apiData.maxOffset || 0
    sortedPacks.value = apiData.sortedPacks || []

    calculateCanvasSize()
  } catch (error) {
    console.error('Failed to load map data:', error)
  }
}

function calculateCanvasSize() {
  // 计算所有节点压缩后的位置范围
  let minX = Infinity, maxX = -Infinity

  nodes.value.forEach((nodeData, nodeId) => {
    const pos = nodePosMap.value.get(nodeId)
    if (!pos) return
    
    // 计算 X 坐标（CSS left）
    const centerX = pos.x * scale + offsetX
    const type = getNodeType(nodeData.nodeType)
    const isSmall = type === 'start' || type === 'keypoint'
    const offsetX_val = isSmall ? 12 : 40
    const cssLeft = centerX - offsetX_val
    const cssRight = cssLeft + (isSmall ? 24 : 80)
    
    minX = Math.min(minX, cssLeft)
    maxX = Math.max(maxX, cssRight)
  })
  
  // 考虑道路的端点
  roadPosMap.value.forEach((roadPos: any, roadId: string) => {
    const road = roads.value.find((r: any) => r.id === roadId || r.roadId === roadId)
    if (!road || road.start?.type !== 'NODE' || road.end?.type !== 'NODE') return
    
    // 检查 roadPos 是否有效
    if (!roadPos || !roadPos.centerPos || !roadPos.startPos || !roadPos.endPos) {
      return
    }
    
    const sx = (roadPos.centerPos.x + roadPos.startPos.x) * scale + offsetX
    const ex = (roadPos.centerPos.x + roadPos.endPos.x) * scale + offsetX
    
    minX = Math.min(minX, sx, ex)
    maxX = Math.max(maxX, sx, ex)
    
    if (roadPos.inflectionList && roadPos.inflectionList.length > 0) {
      roadPos.inflectionList.forEach((inflection: any) => {
        const ix = (roadPos.centerPos.x + inflection.cornerPos.x) * scale + offsetX
        minX = Math.min(minX, ix)
        maxX = Math.max(maxX, ix)
      })
    }
  })
  
  // 计算压缩后的 canvas 高度
  let minY = Infinity
  let maxY = -Infinity
  
  // 1. 计算所有节点压缩后的位置（CSS left/top 是左上角，所以节点 y 就是左上角）
  nodes.value.forEach((nodeData, nodeId) => {
    const pos = nodePosMap.value.get(nodeId)
    if (!pos) return
    
    // 计算压缩后的中心 Y
    const originalCenterY = -pos.y * scale + offsetY
    const compressedCenterY = getCompressedY(originalCenterY)
    
    // 根据节点类型计算实际的 CSS top 值
    const type = getNodeType(nodeData.nodeType)
    const isSmall = type === 'start' || type === 'keypoint'
    const offsetY_val = isSmall ? 12 : 40 // 圆点/卡片高度的一半
    
    // CSS top 值
    const cssTop = compressedCenterY - offsetY_val
    const cssBottom = cssTop + (isSmall ? 24 : 80) // 实际高度
    
    minY = Math.min(minY, cssTop)
    maxY = Math.max(maxY, cssBottom)
  })
  
  // 2. 考虑指标集指示器的位置（与 packIndicators 计算一致）
  packDataMap.value.forEach((packData, packId) => {
    let packMinY = Infinity
    
    nodes.value.forEach((nodeData, nodeId) => {
      if (nodeData.slotPackId === packId) {
        const pos = nodePosMap.value.get(nodeId)
        if (pos) {
          const originalY = -pos.y * scale + offsetY
          const compressedY = getCompressedY(originalY)
          packMinY = Math.min(packMinY, compressedY)
        }
      }
    })
    
    if (packMinY !== Infinity) {
      // 指示器在节点上方 38px（与 packIndicators 一致）
      const indicatorTop = packMinY - 38
      minY = Math.min(minY, indicatorTop)
    }
  })
  
  // 3. 考虑道路的端点（道路的坐标是 SVG 坐标）
  roadPosMap.value.forEach((roadPos: any, roadId: string) => {
    const road = roads.value.find((r: any) => r.id === roadId || r.roadId === roadId)
    if (!road || road.start?.type !== 'NODE' || road.end?.type !== 'NODE') return
    
    // 检查 roadPos 是否有效
    if (!roadPos || !roadPos.centerPos || !roadPos.startPos || !roadPos.endPos) {
      return
    }
    
    // 起点
    const startOriginalY = -(roadPos.centerPos.y + roadPos.startPos.y) * scale + offsetY
    const startCompressedY = getRoadCompressedY(startOriginalY, road.start.id)
    
    // 终点
    const endOriginalY = -(roadPos.centerPos.y + roadPos.endPos.y) * scale + offsetY
    const endCompressedY = getRoadCompressedY(endOriginalY, road.end.id)
    
    minY = Math.min(minY, startCompressedY, endCompressedY)
    maxY = Math.max(maxY, startCompressedY, endCompressedY)
    
    // 拐点
    if (roadPos.inflectionList && roadPos.inflectionList.length > 0) {
      roadPos.inflectionList.forEach((inflection: any) => {
        if (!inflection || !inflection.cornerPos) return
        const inflectionOriginalY = -(roadPos.centerPos.y + inflection.cornerPos.y) * scale + offsetY
        const inflectionCompressedY = getRoadCompressedY(inflectionOriginalY, road.start.id)
        minY = Math.min(minY, inflectionCompressedY)
        maxY = Math.max(maxY, inflectionCompressedY)
      })
    }
  })
  
  // 目标：让所有内容顶部对齐到 40px
  // 计算需要额外减去的偏移量（使 minY 变成 40）
  const targetTop = 40
  const extraOffset = minY - targetTop
  
  // console.log('Canvas size calc:', { minY, maxY, extraOffset, targetTop })
  
  // 总是应用偏移，让内容从顶部开始（对于没有pack的地图，minY可能很大）
  // 更新全局偏移量，让所有内容向上移动
  globalYOffset.value = -extraOffset
  
  // 重新计算调整后的 maxY
  const adjustedMaxY = maxY + globalYOffset.value
  const bottomMargin = 50 // 减小底部间距，从 500 改为 50
  const finalHeight = (adjustedMaxY - targetTop) + bottomMargin

  // console.log('Final canvas size:', { adjustedMaxY, finalHeight })
  
  // 添加边距
  const leftMargin = 20
  const rightMargin = 20
  canvasWidth.value = (maxX - minX) + leftMargin + rightMargin
  canvasHeight.value = Math.max(finalHeight, 2500)
  
  // console.log('Final canvas size:', canvasWidth.value, canvasHeight.value)
}

function getNodeType(nodeType: string): 'start' | 'rune' | 'keypoint' | 'treasure' {
  switch (nodeType) {
    case 'START': return 'start'
    case 'KEYPOINT': return 'keypoint'
    case 'TREASURE': return 'treasure'
    default: return 'rune'
  }
}

function getRuneInfo(runeId: string | null): { name: string; score: number } {
  if (!runeId) return { name: '', score: 0 }
  const runeData = mapData.value?.runeDataMap?.[runeId]
  return {
    name: runeData?.runeName || runeId,
    score: runeData?.score || 0
  }
}

function getKeypointScore(nodeId: string): number {
  const kpData = mapData.value?.challengeNodeDataMap?.[nodeId]
  return parseInt(kpData?.missionParamList?.[1]) || 0
}

function checkSelectable(nodeId: string, nodeData: any, actives: Set<string>): boolean {
  if (nodeData.nodeType === 'START') return false
  if (nodeData.nodeType === 'KEYPOINT') return false
  if (selectedRuneNodes.value.has(nodeId)) return true

  // 检查是否有激活的前置或连接的KEYPOINT
  const incomingRoads = roads.value.filter((r: any) => 
    r.end.type === 'NODE' && r.end.id === nodeId && r.start.type === 'NODE'
  )
  
  // 有直接前置激活
  for (const road of incomingRoads) {
    if (actives.has(road.start.id)) {
      return true
    }
  }
  
  // 或者与激活的KEYPOINT相连
  const connectedRoads = roads.value.filter((r: any) => 
    (r.start.type === 'NODE' && r.start.id === nodeId && r.end.type === 'NODE') ||
    (r.end.type === 'NODE' && r.end.id === nodeId && r.start.type === 'NODE')
  )
  
  for (const road of connectedRoads) {
    const otherId = road.start.id === nodeId ? road.end.id : road.start.id
    const otherNode = nodes.value.get(otherId)
    if (otherNode?.nodeType === 'KEYPOINT' && actives.has(otherId)) {
      return true
    }
  }
  
  return false
}

// 计算在指定选中状态下，哪些节点是有效的
// 规则：
// 1. START节点总是有效
// 2. 一个KEYPOINT有效，如果它至少有一个前置节点有效
// 3. 一个RUNE有效，如果：
//    - 它有直接的START前置，或
//    - 它有直接的KEYPOINT前置且该KEYPOINT有效，或
//    - 它与有效的KEYPOINT相连，或
//    - 它有直接的RUNE前置且该RUNE有效
function computeValidNodes(currentSelections: Set<string>): Set<string> {
  const valid = new Set<string>()
  
  // 初始化：所有START节点都有效
  nodes.value.forEach((nodeData: any, id: string) => {
    if (nodeData.nodeType === 'START') {
      valid.add(id)
    }
  })
  
  // 迭代直到收敛
  let changed = true
  while (changed) {
    changed = false
    
    nodes.value.forEach((nodeData: any, id: string) => {
      if (valid.has(id)) return // 已经有效
      
      // KEYPOINT：只要有至少一个前置有效，就有效
      if (nodeData.nodeType === 'KEYPOINT') {
        const incomingRoads = roads.value.filter((r: any) => 
          r.end.type === 'NODE' && r.end.id === id && r.start.type === 'NODE'
        )
        
        for (const road of incomingRoads) {
          if (valid.has(road.start.id)) {
            valid.add(id)
            changed = true
            return
          }
        }
      }
      
      // RUNE：必须在currentSelections中，且有有效前置
      if (nodeData.nodeType === 'NORMAL' && currentSelections.has(id)) {
        // 检查直接前置
        const incomingRoads = roads.value.filter((r: any) => 
          r.end.type === 'NODE' && r.end.id === id && r.start.type === 'NODE'
        )
        
        for (const road of incomingRoads) {
          const preId = road.start.id
          if (valid.has(preId)) {
            valid.add(id)
            changed = true
            return
          }
        }
        
        // 检查与KEYPOINT的连接（双向）
        const connectedRoads = roads.value.filter((r: any) => 
          (r.start.type === 'NODE' && r.start.id === id && r.end.type === 'NODE') ||
          (r.end.type === 'NODE' && r.end.id === id && r.start.type === 'NODE')
        )
        
        for (const road of connectedRoads) {
          const otherId = road.start.id === id ? road.end.id : road.start.id
          if (valid.has(otherId)) {
            const otherNode = nodes.value.get(otherId)
            if (otherNode?.nodeType === 'KEYPOINT') {
              valid.add(id)
              changed = true
              return
            }
          }
        }
      }
    })
  }
  
  return valid
}

function handleNodeClick(node: NodeItem) {
  if (node.type === 'start' || node.type === 'keypoint') return
  
  // 创建新的 Set 来触发 shallowRef 更新
  const newSelected = new Set(selectedRuneNodes.value)
  
  if (newSelected.has(node.id)) {
    // 取消选中
    newSelected.delete(node.id)
    
    // 先更新状态，再清理
    selectedRuneNodes.value = newSelected
    cleanupInvalidSelections()
  } else if (node.selectable) {
    // 选中
    newSelected.add(node.id)
    
    // 处理互斥组
    const nodeData = nodes.value.get(node.id)
    if (nodeData?.mutualExclusionGroup) {
      for (const id of Array.from(newSelected)) {
        if (id === node.id) continue
        const nd = nodes.value.get(id)
        if (nd?.mutualExclusionGroup === nodeData.mutualExclusionGroup) {
          newSelected.delete(id)
        }
      }
    }
    
    // 赋值新 Set 触发更新
    selectedRuneNodes.value = newSelected
  }
  
  updateScore()
}

// 清理无效的选中节点
function cleanupInvalidSelections() {
  const validNodes = computeValidNodes(selectedRuneNodes.value)
  const newSelected = new Set<string>()
  
  // 只保留有效的节点
  for (const nodeId of selectedRuneNodes.value) {
    if (validNodes.has(nodeId)) {
      newSelected.add(nodeId)
    }
  }
  
  // 赋值新 Set 触发更新
  selectedRuneNodes.value = newSelected
}

// 计算指标集（pack）奖励分数
// 当某个 pack 下的所有节点都被激活时，获得该 pack 的奖励分数
// 互斥组处理：互斥节点中只要选中最高分的一个（同分都算最高），视为整个组完成
function calculatePackBonusScore(): number {
  let bonus = 0
  
  // 遍历所有 pack
  packDataMap.value.forEach((packData, packId) => {
    // 如果没有奖励分数，跳过
    if (packData.rewardScore <= 0) return
    
    // 获取该 pack 下的所有节点
    const packNodes: Array<{ id: string; score: number; group: string | null }> = []
    nodes.value.forEach((nodeData, nodeId) => {
      if (nodeData.slotPackId === packId) {
        const runeInfo = getRuneInfo(nodeData.runeId)
        packNodes.push({
          id: nodeId,
          score: runeInfo.score,
          group: nodeData.mutualExclusionGroup || null
        })
      }
    })
    
    // 如果没有节点属于这个 pack，跳过
    if (packNodes.length === 0) return
    
    // 按互斥组分组
    const groupMap = new Map<string | null, Array<{ id: string; score: number }>>()
    packNodes.forEach(node => {
      const key = node.group
      if (!groupMap.has(key)) {
        groupMap.set(key, [])
      }
      groupMap.get(key)!.push({ id: node.id, score: node.score })
    })
    
    // 检查每个组是否完成
    const actives = activeNodes.value
    let allGroupsComplete = true
    
    groupMap.forEach((groupNodes, groupKey) => {
      if (groupKey === null) {
        // 无互斥组的节点：必须全部激活
        const allActive = groupNodes.every(n => actives.has(n.id))
        if (!allActive) {
          allGroupsComplete = false
        }
      } else {
        // 有互斥组的节点：只要选中最高分的一个（同分都算）即视为完成
        // 找出最高分
        const maxScore = Math.max(...groupNodes.map(n => n.score))
        // 找出所有最高分的节点
        const highestNodes = groupNodes.filter(n => n.score === maxScore)
        // 检查是否有任意一个最高分的节点被选中
        const hasHighestSelected = highestNodes.some(n => actives.has(n.id))
        if (!hasHighestSelected) {
          allGroupsComplete = false
        }
      }
    })
    
    if (allGroupsComplete) {
      bonus += packData.rewardScore
    }
  })
  
  return bonus
}

function updateScore() {
  let score = 0
  selectedRuneNodes.value.forEach(id => {
    const node = nodes.value.get(id)
    if (node?.runeId) {
      const runeInfo = getRuneInfo(node.runeId)
      score += runeInfo.score
    }
  })
  
  // 加上指标集奖励分数
  score += calculatePackBonusScore()
  
  currentScore.value = score
}

// 处理指标集点击 - 批量开关节点
function handlePackClick(pack: PackIndicator) {
  // 创建新的 Set 来触发 shallowRef 更新
  const newSelected = new Set(selectedRuneNodes.value)
  
  if (pack.isActive) {
    // 已激活：关闭该 pack 下的所有节点
    pack.nodeIds.forEach(nodeId => {
      newSelected.delete(nodeId)
    })
  } else {
    // 未激活：迭代激活该 pack 下的所有可达节点
    // 第一轮：按互斥组选择节点加入待选集
    const pendingNodes = new Set<string>()
    const groupMap = new Map<string | null, string[]>()
    
    pack.nodeIds.forEach(nodeId => {
      const nodeData = nodes.value.get(nodeId)
      if (nodeData?.nodeType === 'NORMAL') {
        const group = nodeData.mutualExclusionGroup || null
        if (!groupMap.has(group)) {
          groupMap.set(group, [])
        }
        groupMap.get(group)!.push(nodeId)
      }
    })
    
    // 选择节点：非互斥全部选，互斥选最高分最后一个
    groupMap.forEach((nodeIds, groupKey) => {
      if (groupKey === null) {
        nodeIds.forEach(id => pendingNodes.add(id))
      } else {
        const scoredNodes = nodeIds.map(id => ({
          id,
          score: getRuneInfo(nodes.value.get(id)?.runeId).score
        })).sort((a, b) => a.score - b.score)
        
        const maxScore = scoredNodes[scoredNodes.length - 1].score
        const highestNodes = scoredNodes.filter(n => n.score === maxScore)
        pendingNodes.add(highestNodes[highestNodes.length - 1].id)
      }
    })
    
    // 迭代激活：基于当前激活状态，不断尝试激活 pendingNodes 中的节点
    // 每次迭代后 KEYPOINT 会激活，可能开启新的通路
    let changed = true
    while (changed) {
      changed = false
      // 使用当前的 newSelected 计算 activeNodes
      const currentActives = new Set<string>()
      
      // 添加 START 节点
      nodes.value.forEach((nodeData: any, id: string) => {
        if (nodeData.nodeType === 'START') {
          currentActives.add(id)
        }
      })
      
      // 添加已选中的节点
      newSelected.forEach(id => currentActives.add(id))
      
      // 激活可达的 KEYPOINT
      let kpChanged = true
      while (kpChanged) {
        kpChanged = false
        nodes.value.forEach((nodeData: any, id: string) => {
          if (nodeData.nodeType !== 'KEYPOINT') return
          if (currentActives.has(id)) return
          
          const incomingRoads = roads.value.filter((r: any) => 
            r.end.type === 'NODE' && r.end.id === id
          )
          
          const shouldActivate = incomingRoads.some((r: any) => 
            r.start.type === 'NODE' && currentActives.has(r.start.id)
          )
          
          if (shouldActivate) {
            currentActives.add(id)
            kpChanged = true
          }
        })
      }
      
      pendingNodes.forEach(nodeId => {
        if (!newSelected.has(nodeId)) {
          const nodeData = nodes.value.get(nodeId)
          if (nodeData && checkSelectableWithActives(nodeId, nodeData, currentActives, newSelected)) {
            newSelected.add(nodeId)
            changed = true
          }
        }
      })
    }
  }
  
  // 赋值新 Set 触发更新
  selectedRuneNodes.value = newSelected
  cleanupInvalidSelections()
  updateScore()
}

// 辅助函数：检查节点是否可选（传入自定义的 actives 和 selected）
function checkSelectableWithActives(nodeId: string, nodeData: any, actives: Set<string>, selected: Set<string>): boolean {
  if (nodeData.nodeType === 'START') return false
  if (nodeData.nodeType === 'KEYPOINT') return false
  if (selected.has(nodeId)) return true

  // 检查是否有激活的前置
  const incomingRoads = roads.value.filter((r: any) => 
    r.end.type === 'NODE' && r.end.id === nodeId && r.start.type === 'NODE'
  )
  
  for (const road of incomingRoads) {
    if (actives.has(road.start.id)) {
      return true
    }
  }
  
  return false
}
</script>

<style scoped>
.crisis-contract-page {
  width: 100vw;
  height: 100vh;
  background: #3a3a3a;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-scroll-container {
  flex: 1;
  overflow: auto;
  background: radial-gradient(ellipse at center, #4a4a4a 0%, #2a2a2a 100%);
}

.map-content {
  position: relative;
  margin: 20px;
}

.svg-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.road-line {
  transition: all 0.3s;
}

.road-line.active {
  filter: drop-shadow(0 0 4px #e74c3c);
}

.node-item {
  position: absolute;
  z-index: 10;
  cursor: pointer;
  transition: all 0.2s;
}

/* START 和 KEYPOINT 节点共用样式 */
.start-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e74c3c;
  border: 3px solid #fff;
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.6);
}

/* RUNE 词条节点 - 游戏原图风格 */
.rune-card {
  width: 80px;
  height: 80px;
  background: #fff;
  border: 2px solid #333;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  overflow: hidden;
}

/* 未选中状态 */
.node-item:not(.selected) .rune-card {
  background: #fff;
  border-color: #333;
}

/* 选中状态 - 红色背景 */
.node-item.selected .rune-card {
  background: #c41e3a;
  border-color: #c41e3a;
}

/* 可选中但未选中状态的发光效果 */
.node-item.selectable:not(.selected) .rune-card {
  box-shadow: 0 0 10px rgba(196, 30, 58, 0.5);
}

/* 锁定状态 */
.node-item.locked .rune-card {
  opacity: 0.5;
}

/* 卡片内容区域 */
.rune-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.rune-name {
  font-size: 11px;
  font-weight: bold;
  color: #333;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 选中状态下的文字颜色 */
.node-item.selected .rune-name {
  color: #fff;
}

/* 底部分数条 */
.rune-score-bar {
  height: 20px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  position: relative;
}

/* 选中状态下的分数条背景 */
.node-item.selected .rune-score-bar {
  background: #8b0000;
}

/* 红色三角形 */
.rune-score-triangle {
  position: absolute;
  left: 6px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid #c41e3a;
}

/* 分数文字 */
.rune-score-text {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.conflict-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #666;
  color: white;
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: bold;
}

/* 指标集指示器 */
.pack-indicator {
  position: absolute;
  z-index: 15;
  cursor: pointer;
  width: 360px;
  height: 28px;
  background: #fff;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.pack-indicator.active {
  background: #c41e3a;
  border-color: #c41e3a;
}

.pack-name {
  font-size: 11px;
  font-weight: bold;
  color: #333;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  padding: 0 8px;
}

.pack-indicator.active .pack-name {
  color: #fff;
}

</style>