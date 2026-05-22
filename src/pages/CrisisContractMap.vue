<template>
  <div class="crisis-contract-page">
    <!-- 顶部信息栏 -->
    <div class="header">
      <div class="left-section">
        <div class="back-btn">←</div>
        <div class="map-info">
          <div class="map-name">滞空焦点</div>
          <div class="map-code">哥伦比亚</div>
        </div>
      </div>
      <div class="right-section">
        <div class="best-record">
          <div class="record-label">Best Record</div>
          <div class="record-score">625</div>
        </div>
        <div class="missions">
          <div class="mission-label">Combat Missions</div>
          <div class="mission-count">7/14 >></div>
        </div>
      </div>
    </div>

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

    <!-- 底部栏 -->
    <div class="bottom-bar">
      <div class="current-score">
        <div class="score-value">{{ currentScore }}</div>
        <div class="score-label">Current Score</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import jsonData from './cc4.json'

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

const mapData = ref<any>(null)
const nodePosMap = ref<Map<string, {x: number, y: number}>>(new Map())
const roadPosMap = ref<Map<string, any>>(new Map())
const nodes = ref<Map<string, any>>(new Map())
const roads = ref<any[]>([])
const packDataMap = ref<Map<string, PackData>>(new Map())  // 指标集数据
const selectedRuneNodes = ref<Set<string>>(new Set())
const currentScore = ref(0)
const packBonusScore = ref(0)  // 指标集奖励分数
const globalYOffset = ref(0)  // 全局 Y 轴偏移（让所有内容向上移动）

const canvasWidth = ref(3000)
const canvasHeight = ref(1500)
const offsetX = 200
const offsetY = 800
const scale = 1.5

const mapContentStyle = computed(() => ({
  width: `${canvasWidth.value}px`,
  height: `${canvasHeight.value}px`
}))

// 节点高度（用于计算 Y 轴占据区间）
const NODE_HEIGHT = 80
const GAP_THRESHOLD = 40 // 小于此值的空隙不剪掉

// 计算 Y 轴压缩偏移量
// 正确方案：
// 1. 找出所有节点占据的区间（考虑 pack，同一个 pack 的节点区间合并）
//    注意：pack 的区间要包含指示器的高度（60px）
// 2. 找出区间之间的空隙（>40px 的）
// 3. 对每个 pack，根据它下方有多少个空隙来计算偏移量
// 4. 同一个 pack 内的所有节点使用相同的偏移量
const yAxisCompression = computed(() => {
  const PACK_INDICATOR_HEIGHT = 60 // 指示器占据的高度（包含间距）
  
  // 1. 收集所有节点，按 pack 分组计算区间
  const packIntervals = new Map<string | null, {minY: number, maxY: number}>()
  
  nodes.value.forEach((nodeData, nodeId) => {
    const pos = nodePosMap.value.get(nodeId)
    if (!pos) return
    
    const centerY = -pos.y * scale + offsetY
    const top = centerY - NODE_HEIGHT / 2
    const bottom = centerY + NODE_HEIGHT / 2
    const packId = nodeData.slotPackId || null
    
    if (!packIntervals.has(packId)) {
      // 对于有 pack 的节点，minY 要减去指示器的高度
      const adjustedMinY = packId !== null ? top - PACK_INDICATOR_HEIGHT : top
      packIntervals.set(packId, {minY: adjustedMinY, maxY: bottom})
    } else {
      const interval = packIntervals.get(packId)!
      // 更新 minY 时也要考虑指示器高度
      const adjustedTop = packId !== null ? top - PACK_INDICATOR_HEIGHT : top
      interval.minY = Math.min(interval.minY, adjustedTop)
      interval.maxY = Math.max(interval.maxY, bottom)
    }
  })
  
  // 2. 转换为数组并排序
  const sortedPacks = Array.from(packIntervals.entries())
    .map(([packId, interval]) => ({packId, ...interval}))
    .sort((a, b) => a.minY - b.minY)
  
  // 3. 找出所有空隙（>40px 的）
  const gaps: Array<{start: number, end: number, size: number}> = []
  for (let i = 1; i < sortedPacks.length; i++) {
    const prev = sortedPacks[i - 1]
    const curr = sortedPacks[i]
    const gap = curr.minY - prev.maxY
    
    if (gap > GAP_THRESHOLD) {
      gaps.push({
        start: prev.maxY,
        end: curr.minY,
        size: gap - GAP_THRESHOLD  // 要剪掉的部分（保留 40px）
      })
    }
  }
  
  // 4. 计算每个 pack 的偏移量
  // pack 的偏移量 = 它上方所有 gap 的 size 之和 + 第一个 pack 上方到目标位置的空隙
  const TARGET_TOP = 10 // 第一个 pack 顶部目标位置（从40改为10）
  const firstPackTop = sortedPacks[0]?.minY || 0
  const extraTopOffset = Math.max(0, firstPackTop - TARGET_TOP) // 第一个 pack 上方需要剪掉的空间
  
  const packOffsets = new Map<string | null, number>()
  
  sortedPacks.forEach(pack => {
    let offset = extraTopOffset // 所有 pack 都加上顶部偏移
    for (const gap of gaps) {
      if (pack.minY > gap.start) {
        // 这个 pack 在 gap 下方，需要向上移动
        offset += gap.size
      }
    }
    packOffsets.set(pack.packId, offset)
  })
  
  // 5. 创建 getOffset 函数
  // 对于有 pack 的节点，使用 pack 的偏移量
  // 对于无 pack 的节点（如 START），根据 Y 坐标判断应该应用哪个偏移量
  const getOffset = (y: number, packId: string | null): number => {
    if (packId !== null) {
      return packOffsets.get(packId) || 0
    }
    
    // 无 pack 的节点：找到它上方最近的 pack，应用该 pack 的偏移量
    // 这样可以确保 START 节点随着下方的 pack 一起移动
    let offset = 0
    for (const pack of sortedPacks) {
      if (pack.packId === null) continue
      if (y >= pack.minY) {
        // 该节点在这个 pack 的上方或同一水平，应用该 pack 的偏移
        offset = Math.max(offset, packOffsets.get(pack.packId) || 0)
      }
    }
    return offset
  }
  
  // 计算最大偏移量（用于 canvas 高度调整）
  const maxOffset = Math.max(...Array.from(packOffsets.values()))
  
  return {getOffset, maxOffset, gaps, sortedPacks, packOffsets}
})

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
  const compression = yAxisCompression.value
  
  // 如果有 pack，直接使用该 pack 的偏移量（确保 pack 内所有节点使用相同偏移）
  if (packId !== null) {
    const offset = compression.packOffsets.get(packId) || 0
    return originalY - offset
  }
  
  // 无 pack 的节点（如 START）使用 getOffset 逻辑
  const offset = compression.getOffset(originalY, packId)
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
    
    result.push({
      id,
      type,
      x: centerX - offsetX_val,
      y: compressedY - offsetY_val,
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
    result.push({
      id: packId,
      name: packData.slotPackFullName || packData.slotPackName,
      x: avgX - 180,
      y: minY - 90, // 指示器高度28 + 间距62（再加10px）
      isActive,
      nodeIds: packNodeIds
    })
  })
  
  return result
})

// 获取道路点的压缩后 Y 坐标（需要知道该点属于哪个节点来应用偏移）
function getRoadCompressedY(y: number, nodeId: string): number {
  // 获取该节点数据
  const nodeData = nodes.value.get(nodeId)
  if (!nodeData) return y
  
  // 使用 getOffset 函数，它会正确处理有 pack 和无 pack 的节点
  const compression = yAxisCompression.value
  const offset = compression.getOffset(y, nodeData.slotPackId || null)
  
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
    
    const isActive = actives.has(road.start.id) && actives.has(road.end.id)
    
    // 计算道路起点和终点的绝对坐标（应用 Y 轴压缩）
    const sx = (roadPos.centerPos.x + roadPos.startPos.x) * scale + offsetX
    const originalSy = -(roadPos.centerPos.y + roadPos.startPos.y) * scale + offsetY
    const sy = getRoadCompressedY(originalSy, road.start.id)
    
    const ex = (roadPos.centerPos.x + roadPos.endPos.x) * scale + offsetX
    const originalEy = -(roadPos.centerPos.y + roadPos.endPos.y) * scale + offsetY
    const ey = getRoadCompressedY(originalEy, road.end.id)
    
    // 构建路径：如果有拐点，使用拐点
    let path = `M ${sx} ${sy}`
    
    // 如果有拐点，添加拐点
    if (roadPos.inflectionList && roadPos.inflectionList.length > 0) {
      roadPos.inflectionList.forEach((inflection: any) => {
        const ix = (roadPos.centerPos.x + inflection.cornerPos.x) * scale + offsetX
        const originalIy = -(roadPos.centerPos.y + inflection.cornerPos.y) * scale + offsetY
        // 拐点属于起点节点
        const iy = getRoadCompressedY(originalIy, road.start.id)
        path += ` L ${ix} ${iy}`
      })
    }
    
    path += ` L ${ex} ${ey}`
    
    result.push({ path, isActive })
  })
  
  return result
})

onMounted(() => {
  loadData()
  
  // 添加调试函数到 window，方便在控制台调用
  ;(window as any).debugCompression = () => {
    const compression = yAxisCompression.value
    const debugData = collectDebugData()
    
    console.log('=== 完整调试数据 ===')
    console.log(JSON.stringify(debugData, null, 2))
    ;(window as any).fullDebugData = debugData
    return debugData
  }
  
  // 专门调试 pack_8（指标集：约束）
  ;(window as any).debugPack8 = () => {
    const pack8Data = collectPack8DebugData()
    console.log('=== PACK_8 详细调试数据 ===')
    console.log(JSON.stringify(pack8Data, null, 2))
    ;(window as any).pack8DebugData = pack8Data
    return pack8Data
  }
  
  // 专门调试 pack_9（指标集：应变）
  ;(window as any).debugPack9 = () => {
    const pack9Data = collectPack9DebugData()
    console.log('=== PACK_9 详细调试数据 ===')
    console.log(JSON.stringify(pack9Data, null, 2))
    ;(window as any).pack9DebugData = pack9Data
    return pack9Data
  }
  
  // 收集 pack_9 的详细调试数据
  function collectPack9DebugData() {
    const compression = yAxisCompression.value
    
    // 获取 pack_9 的所有节点（带详细信息）
    const pack9Nodes: Array<{
      id: string
      type: string
      runeName: string
      runeId: string | null
      originalY: number
      screenOriginalY: number
      screenCompressedY: number
      offset: number
      mutualExclusionGroup: string | null
    }> = []
    
    nodes.value.forEach((nodeData, nodeId) => {
      if (nodeData.slotPackId === 'pack_9') {
        const pos = nodePosMap.value.get(nodeId)
        if (pos) {
          const screenOriginalY = -pos.y * scale + offsetY
          const screenCompressedY = getCompressedY(screenOriginalY, 'pack_9')
          const runeInfo = getRuneInfo(nodeData.runeId)
          
          pack9Nodes.push({
            id: nodeId,
            type: nodeData.nodeType,
            runeName: runeInfo.name,
            runeId: nodeData.runeId,
            originalY: pos.y,
            screenOriginalY,
            screenCompressedY,
            offset: screenOriginalY - screenCompressedY,
            mutualExclusionGroup: nodeData.mutualExclusionGroup || null
          })
        }
      }
    })
    
    // 按原始 Y 坐标排序（从上往下）
    pack9Nodes.sort((a, b) => a.originalY - b.originalY)
    
    // 计算 pack_9 的偏移量
    const pack9Offset = compression.packOffsets.get('pack_9') || 0
    
    // 找出 pack_9 相关的道路
    const pack9Roads: Array<{
      id: string
      startNode: string
      endNode: string
      startOriginalY: number
      startCompressedY: number
      endOriginalY: number
      endCompressedY: number
    }> = []
    
    roadPosMap.value.forEach((roadPos: any, roadId: string) => {
      const road = roads.value.find((r: any) => r.id === roadId || r.roadId === roadId)
      if (!road || road.start?.type !== 'NODE' || road.end?.type !== 'NODE') return
      
      const startInPack9 = pack9Nodes.some(n => n.id === road.start.id)
      const endInPack9 = pack9Nodes.some(n => n.id === road.end.id)
      
      if (startInPack9 || endInPack9) {
        const startOriginalY = -(roadPos.centerPos.y + roadPos.startPos.y) * scale + offsetY
        const startCompressedY = getRoadCompressedY(startOriginalY, road.start.id)
        const endOriginalY = -(roadPos.centerPos.y + roadPos.endPos.y) * scale + offsetY
        const endCompressedY = getRoadCompressedY(endOriginalY, road.end.id)
        
        pack9Roads.push({
          id: roadId,
          startNode: road.start.id,
          endNode: road.end.id,
          startOriginalY,
          startCompressedY,
          endOriginalY,
          endCompressedY
        })
      }
    })
    
    return {
      packId: 'pack_9',
      packName: '指标集：应变',
      packOffset: pack9Offset,
      totalNodes: pack9Nodes.length,
      nodes: pack9Nodes.map(n => ({
        id: n.id,
        type: n.type,
        runeName: n.runeName,
        runeId: n.runeId,
        originalY: n.originalY,
        screenOriginalY: Math.round(n.screenOriginalY * 10) / 10,
        screenCompressedY: Math.round(n.screenCompressedY * 10) / 10,
        offset: Math.round(n.offset * 10) / 10,
        mutualExclusionGroup: n.mutualExclusionGroup
      })),
      roads: pack9Roads.map(r => ({
        id: r.id,
        startNode: r.startNode,
        endNode: r.endNode,
        startOriginalY: Math.round(r.startOriginalY * 10) / 10,
        startCompressedY: Math.round(r.startCompressedY * 10) / 10,
        endOriginalY: Math.round(r.endOriginalY * 10) / 10,
        endCompressedY: Math.round(r.endCompressedY * 10) / 10
      }))
    }
  }
  
  // 收集 pack_8 的详细调试数据
  function collectPack8DebugData() {
    const compression = yAxisCompression.value
    
    // 获取 pack_8 的所有节点（带详细信息）
    const pack8Nodes: Array<{
      id: string
      type: string
      runeName: string
      runeId: string | null
      originalY: number
      screenOriginalY: number
      screenCompressedY: number
      offset: number
      mutualExclusionGroup: string | null
    }> = []
    
    nodes.value.forEach((nodeData, nodeId) => {
      if (nodeData.slotPackId === 'pack_8') {
        const pos = nodePosMap.value.get(nodeId)
        if (pos) {
          const screenOriginalY = -pos.y * scale + offsetY
          const screenCompressedY = getCompressedY(screenOriginalY, 'pack_8')
          const runeInfo = getRuneInfo(nodeData.runeId)
          
          pack8Nodes.push({
            id: nodeId,
            type: nodeData.nodeType,
            runeName: runeInfo.name,
            runeId: nodeData.runeId,
            originalY: pos.y,
            screenOriginalY,
            screenCompressedY,
            offset: screenOriginalY - screenCompressedY,
            mutualExclusionGroup: nodeData.mutualExclusionGroup || null
          })
        }
      }
    })
    
    // 按原始 Y 坐标排序（从上往下）
    pack8Nodes.sort((a, b) => a.originalY - b.originalY)
    
    // 计算 pack_8 的偏移量
    const pack8Offset = compression.packOffsets.get('pack_8') || 0
    
    // 找出 pack_8 相关的道路
    const pack8Roads: Array<{
      id: string
      startNode: string
      endNode: string
      startOriginalY: number
      startCompressedY: number
      endOriginalY: number
      endCompressedY: number
    }> = []
    
    roadPosMap.value.forEach((roadPos: any, roadId: string) => {
      const road = roads.value.find((r: any) => r.id === roadId || r.roadId === roadId)
      if (!road || road.start?.type !== 'NODE' || road.end?.type !== 'NODE') return
      
      const startInPack8 = pack8Nodes.some(n => n.id === road.start.id)
      const endInPack8 = pack8Nodes.some(n => n.id === road.end.id)
      
      if (startInPack8 || endInPack8) {
        const startOriginalY = -(roadPos.centerPos.y + roadPos.startPos.y) * scale + offsetY
        const startCompressedY = getRoadCompressedY(startOriginalY, road.start.id)
        const endOriginalY = -(roadPos.centerPos.y + roadPos.endPos.y) * scale + offsetY
        const endCompressedY = getRoadCompressedY(endOriginalY, road.end.id)
        
        pack8Roads.push({
          id: roadId,
          startNode: road.start.id,
          endNode: road.end.id,
          startOriginalY,
          startCompressedY,
          endOriginalY,
          endCompressedY
        })
      }
    })
    
    return {
      packId: 'pack_8',
      packName: '指标集：约束',
      packOffset: pack8Offset,
      totalNodes: pack8Nodes.length,
      nodes: pack8Nodes.map(n => ({
        id: n.id,
        type: n.type,
        runeName: n.runeName,
        runeId: n.runeId,
        originalY: n.originalY,
        screenOriginalY: Math.round(n.screenOriginalY * 10) / 10,
        screenCompressedY: Math.round(n.screenCompressedY * 10) / 10,
        offset: Math.round(n.offset * 10) / 10,
        mutualExclusionGroup: n.mutualExclusionGroup
      })),
      roads: pack8Roads.map(r => ({
        id: r.id,
        startNode: r.startNode,
        endNode: r.endNode,
        startOriginalY: Math.round(r.startOriginalY * 10) / 10,
        startCompressedY: Math.round(r.startCompressedY * 10) / 10,
        endOriginalY: Math.round(r.endOriginalY * 10) / 10,
        endCompressedY: Math.round(r.endCompressedY * 10) / 10
      }))
    }
  }
  
  // 收集完整的调试数据
  function collectDebugData() {
    const compression = yAxisCompression.value
    
    // 1. 收集所有节点的数据
    const nodeData: Array<{
      id: string
      type: string
      packId: string | null
      originalX: number
      originalY: number
      screenOriginalX: number
      screenOriginalY: number
      screenCompressedX: number
      screenCompressedY: number
      offsetX: number
      offsetY: number
      cssLeft: number
      cssTop: number
    }> = []
    
    nodes.value.forEach((nodeDataItem, id) => {
      const pos = nodePosMap.value.get(id)
      if (!pos) return
      
      // 原始屏幕坐标（偏移前）
      const screenOriginalX = pos.x * scale + offsetX
      const screenOriginalY = -pos.y * scale + offsetY
      
      // 压缩后的坐标
      const screenCompressedX = screenOriginalX
      const screenCompressedY = getCompressedY(screenOriginalY, nodeDataItem.slotPackId || null)
      
      // CSS 位置（左上角）
      const type = getNodeType(nodeDataItem.nodeType)
      const isSmall = type === 'start' || type === 'keypoint'
      const offsetX_val = isSmall ? 12 : 40
      const offsetY_val = isSmall ? 12 : 40
      
      nodeData.push({
        id,
        type: nodeDataItem.nodeType,
        packId: nodeDataItem.slotPackId || null,
        originalX: pos.x,
        originalY: pos.y,
        screenOriginalX,
        screenOriginalY,
        screenCompressedX,
        screenCompressedY,
        offsetX: 0,
        offsetY: screenOriginalY - screenCompressedY,
        cssLeft: screenCompressedX - offsetX_val,
        cssTop: screenCompressedY - offsetY_val
      })
    })
    
    // 2. 收集所有道路的数据
    const roadData: Array<{
      id: string
      startNode: string
      endNode: string
      startOriginalX: number
      startOriginalY: number
      startCompressedX: number
      startCompressedY: number
      endOriginalX: number
      endOriginalY: number
      endCompressedX: number
      endCompressedY: number
      inflections: Array<{
        originalX: number
        originalY: number
        compressedX: number
        compressedY: number
      }>
    }> = []
    
    roadPosMap.value.forEach((roadPos: any, roadId: string) => {
      const road = roads.value.find((r: any) => r.id === roadId || r.roadId === roadId)
      if (!road || road.start?.type !== 'NODE' || road.end?.type !== 'NODE') return
      
      // 起点
      const startOriginalX = (roadPos.centerPos.x + roadPos.startPos.x) * scale + offsetX
      const startOriginalY = -(roadPos.centerPos.y + roadPos.startPos.y) * scale + offsetY
      const startCompressedX = startOriginalX
      const startCompressedY = getRoadCompressedY(startOriginalY, road.start.id)
      
      // 终点
      const endOriginalX = (roadPos.centerPos.x + roadPos.endPos.x) * scale + offsetX
      const endOriginalY = -(roadPos.centerPos.y + roadPos.endPos.y) * scale + offsetY
      const endCompressedX = endOriginalX
      const endCompressedY = getRoadCompressedY(endOriginalY, road.end.id)
      
      // 拐点
      const inflections: Array<any> = []
      if (roadPos.inflectionList && roadPos.inflectionList.length > 0) {
        roadPos.inflectionList.forEach((inflection: any) => {
          const originalX = (roadPos.centerPos.x + inflection.cornerPos.x) * scale + offsetX
          const originalY = -(roadPos.centerPos.y + inflection.cornerPos.y) * scale + offsetY
          inflections.push({
            originalX,
            originalY,
            compressedX: originalX,
            compressedY: getRoadCompressedY(originalY, road.start.id)
          })
        })
      }
      
      roadData.push({
        id: roadId,
        startNode: road.start.id,
        endNode: road.end.id,
        startOriginalX,
        startOriginalY,
        startCompressedX,
        startCompressedY,
        endOriginalX,
        endOriginalY,
        endCompressedX,
        endCompressedY,
        inflections
      })
    })
    
    // 3. 收集指标集数据
    const packData: Array<{
      id: string
      name: string
      offset: number
      nodeIds: string[]
      originalMinY: number
      originalMaxY: number
      compressedMinY: number
      compressedMaxY: number
    }> = []
    
    compression.sortedPacks.forEach(pack => {
      if (pack.packId === null) return // 跳过无 pack 的节点
      
      const packInfo = packDataMap.value.get(pack.packId)
      const offset = compression.packOffsets.get(pack.packId) || 0
      
      // 找出该 pack 的所有节点
      const packNodeIds: string[] = []
      let originalMinY = Infinity
      let originalMaxY = -Infinity
      
      nodes.value.forEach((nodeData, nodeId) => {
        if (nodeData.slotPackId === pack.packId) {
          packNodeIds.push(nodeId)
          const pos = nodePosMap.value.get(nodeId)
          if (pos) {
            const screenY = -pos.y * scale + offsetY
            originalMinY = Math.min(originalMinY, screenY)
            originalMaxY = Math.max(originalMaxY, screenY)
          }
        }
      })
      
      packData.push({
        id: pack.packId,
        name: packInfo?.slotPackFullName || packInfo?.slotPackName || pack.packId,
        offset,
        nodeIds: packNodeIds,
        originalMinY,
        originalMaxY,
        compressedMinY: originalMinY - offset,
        compressedMaxY: originalMaxY - offset
      })
    })
    
    // 4. 计算统计信息
    const originalHeight = Math.max(...nodeData.map(n => n.screenOriginalY)) - Math.min(...nodeData.map(n => n.screenOriginalY))
    const compressedHeight = Math.max(...nodeData.map(n => n.screenCompressedY)) - Math.min(...nodeData.map(n => n.screenCompressedY))
    
    return {
      summary: {
        totalNodes: nodeData.length,
        totalRoads: roadData.length,
        totalPacks: packData.length,
        originalHeight: Math.round(originalHeight),
        compressedHeight: Math.round(compressedHeight),
        compressionRatio: Math.round((compressedHeight / originalHeight) * 100) + '%'
      },
      nodes: nodeData,
      roads: roadData,
      packs: packData,
      packOffsets: Object.fromEntries(compression.packOffsets),
      sortedPacks: compression.sortedPacks.map(r => ({
        packId: r.packId,
        minY: r.minY,
        maxY: r.maxY
      }))
    }
  }
  
  // 专门调试 pack_8（指标集：约束）
  setTimeout(() => {
    // 获取 pack_8 的所有节点
    const pack8Nodes: Array<{id: string, originalY: number, compressedY: number, type: string}> = []
    nodes.value.forEach((nodeData, nodeId) => {
      if (nodeData.slotPackId === 'pack_8') {
        const pos = nodePosMap.value.get(nodeId)
        if (pos) {
          const originalY = -pos.y * scale + offsetY
          const compressedY = getCompressedY(originalY)
          pack8Nodes.push({
            id: nodeId,
            originalY: pos.y,
            compressedY,
            type: nodeData.nodeType
          })
        }
      }
    })
    
    // 按压缩后的 Y 坐标排序（与 yAxisCompression 一致）
    pack8Nodes.sort((a, b) => a.compressedY - b.compressedY)
    
    // 计算相对位置（原始）
    const originalDiffs: Array<{from: string, to: string, diff: number}> = []
    for (let i = 1; i < pack8Nodes.length; i++) {
      const diff = (pack8Nodes[i].originalY - pack8Nodes[i-1].originalY) * scale
      originalDiffs.push({
        from: pack8Nodes[i-1].id,
        to: pack8Nodes[i].id,
        diff
      })
    }
    
    // 计算相对位置（压缩后）
    const compressedDiffs: Array<{from: string, to: string, diff: number}> = []
    for (let i = 1; i < pack8Nodes.length; i++) {
      const diff = pack8Nodes[i].compressedY - pack8Nodes[i-1].compressedY
      compressedDiffs.push({
        from: pack8Nodes[i-1].id,
        to: pack8Nodes[i].id,
        diff
      })
    }
    
    // 找出 pack_8 相关的道路
    const pack8Roads: Array<{id: string, start: string, end: string, startY: number|string, endY: number|string}> = []
    roads.value.forEach((road: any) => {
      const startInPack8 = pack8Nodes.some(n => n.id === road.start?.id)
      const endInPack8 = pack8Nodes.some(n => n.id === road.end?.id)
      
      if (startInPack8 || endInPack8) {
        const startNode = pack8Nodes.find(n => n.id === road.start?.id)
        const endNode = pack8Nodes.find(n => n.id === road.end?.id)
        pack8Roads.push({
          id: road.id,
          start: road.start?.id || 'N/A',
          end: road.end?.id || 'N/A',
          startY: startNode ? startNode.compressedY : 'N/A',
          endY: endNode ? endNode.compressedY : 'N/A'
        })
      }
    })
    
    // 组装完整调试对象
    const debugData = {
      packId: 'pack_8',
      packName: '指标集：约束',
      nodes: pack8Nodes.map(n => ({
        id: n.id,
        type: n.type,
        originalY: n.originalY,
        compressedY: Math.round(n.compressedY * 10) / 10
      })),
      relativePositions: {
        original: originalDiffs,
        compressed: compressedDiffs.map(d => ({
          from: d.from,
          to: d.to,
          diff: Math.round(d.diff * 10) / 10
        }))
      },
      roads: pack8Roads,
      comparison: originalDiffs.map((orig, i) => ({
        pair: `${orig.from} -> ${orig.to}`,
        originalDiff: Math.round(orig.diff * 10) / 10,
        compressedDiff: compressedDiffs[i] ? Math.round(compressedDiffs[i].diff * 10) / 10 : null,
        isEqual: compressedDiffs[i] ? Math.abs(orig.diff - compressedDiffs[i].diff) < 1 : false
      }))
    }
    
    console.log('=== PACK_8 (指标集：约束) 完整调试数据 ===')
    console.log(JSON.stringify(debugData, null, 2))
    ;(window as any).pack8DebugData = debugData
  }, 1000)
})

function loadData() {
  const detail = (jsonData as any).info.mapDetailDataMap['crisis_v2_04-01']
  if (!detail) {
    console.error('Map data not found')
    return
  }

  mapData.value = detail

  // 加载节点位置
  const nvm = detail.nodeViewData?.nodePosMap || {}
  Object.entries(nvm).forEach(([id, data]: [string, any]) => {
    nodePosMap.value.set(id, data.position)
  })

  // 加载道路位置
  const rpm = detail.nodeViewData?.roadPosMap || {}
  Object.entries(rpm).forEach(([id, data]: [string, any]) => {
    roadPosMap.value.set(id, data)
  })

  // 加载指标集（pack）数据 - 仅当存在时
  const bdm = detail.bagDataMap || {}
  Object.entries(bdm).forEach(([id, data]: [string, any]) => {
    packDataMap.value.set(id, {
      slotPackId: data.slotPackId || id,
      slotPackType: data.slotPackType || '',
      slotPackName: data.slotPackName || '',
      slotPackFullName: data.slotPackFullName || '',
      rewardScore: data.rewardScore || 0,
      isDaily: data.isDaily || false,
      sortId: data.sortId || 0
    })
  })

  Object.entries(detail.nodeDataMap || {}).forEach(([id, data]: [string, any]) => {
    nodes.value.set(id, data)
  })

  // 加载道路，并给每个道路对象添加id属性
  roads.value = Object.entries(detail.roadRelationDataMap || {}).map(([id, data]: [string, any]) => ({
    id,
    ...data
  }))
  calculateCanvasSize()
}

function calculateCanvasSize() {
  let minX = Infinity, maxX = -Infinity

  nodePosMap.value.forEach((pos) => {
    minX = Math.min(minX, pos.x)
    maxX = Math.max(maxX, pos.x)
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
        const inflectionOriginalY = -(roadPos.centerPos.y + inflection.cornerPos.y) * scale + offsetY
        const inflectionCompressedY = getRoadCompressedY(inflectionOriginalY, road.start.id)
        minY = Math.min(minY, inflectionCompressedY)
        maxY = Math.max(maxY, inflectionCompressedY)
      })
    }
  })
  
  // 目标：让第一个指标集顶部对齐到 40px
  // 计算需要额外减去的偏移量（使 minY 变成 40）
  const targetTop = 40
  const extraOffset = minY - targetTop
  
  console.log('Canvas size calc:', { minY, maxY, extraOffset, targetTop })
  
  // 如果有额外偏移，需要调整所有元素的 Y 坐标
  if (extraOffset > 0) {
    // 更新全局偏移量，让所有内容向上移动
    globalYOffset.value = -extraOffset
  } else {
    globalYOffset.value = 0
  }
  
  // 重新计算调整后的 maxY
  const adjustedMaxY = maxY + globalYOffset.value
  const bottomMargin = 50 // 减小底部间距，从 500 改为 50
  const finalHeight = (adjustedMaxY - targetTop) + bottomMargin

  console.log('Final canvas size:', { adjustedMaxY, finalHeight })
  
  canvasWidth.value = (maxX - minX) * scale + offsetX * 2 + 400
  canvasHeight.value = Math.max(finalHeight, 2500)
  
  console.log('Final canvas size:', canvasWidth.value, canvasHeight.value)
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
  
  if (selectedRuneNodes.value.has(node.id)) {
    // 取消选中
    selectedRuneNodes.value.delete(node.id)
    
    // 清理无效的选中节点
    cleanupInvalidSelections()
  } else if (node.selectable) {
    // 选中
    selectedRuneNodes.value.add(node.id)
    
    // 处理互斥组
    const nodeData = nodes.value.get(node.id)
    if (nodeData?.mutualExclusionGroup) {
      for (const id of Array.from(selectedRuneNodes.value)) {
        if (id === node.id) continue
        const nd = nodes.value.get(id)
        if (nd?.mutualExclusionGroup === nodeData.mutualExclusionGroup) {
          selectedRuneNodes.value.delete(id)
        }
      }
    }
  }
  
  updateScore()
}

// 清理无效的选中节点
function cleanupInvalidSelections() {
  let changed = true
  while (changed) {
    const validNodes = computeValidNodes(selectedRuneNodes.value)
    
    changed = false
    for (const nodeId of Array.from(selectedRuneNodes.value)) {
      if (!validNodes.has(nodeId)) {
        selectedRuneNodes.value.delete(nodeId)
        changed = true
      }
    }
  }
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
  if (pack.isActive) {
    // 已激活：关闭该 pack 下的所有节点
    pack.nodeIds.forEach(nodeId => {
      selectedRuneNodes.value.delete(nodeId)
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
      const currentActives = activeNodes.value
      
      pendingNodes.forEach(nodeId => {
        if (!selectedRuneNodes.value.has(nodeId)) {
          const nodeData = nodes.value.get(nodeId)
          if (nodeData && checkSelectable(nodeId, nodeData, currentActives)) {
            selectedRuneNodes.value.add(nodeId)
            changed = true
          }
        }
      })
    }
  }
  
  cleanupInvalidSelections()
  updateScore()
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #555;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  font-size: 24px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.map-info {
  display: flex;
  flex-direction: column;
}

.map-name {
  font-size: 20px;
  font-weight: bold;
}

.map-code {
  font-size: 12px;
  color: #aaa;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.best-record, .missions {
  text-align: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.record-label, .mission-label {
  font-size: 10px;
  color: #aaa;
}

.record-score, .mission-count {
  font-size: 20px;
  font-weight: bold;
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

/* 底部栏 */
.bottom-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid #555;
}

.current-score {
  text-align: center;
}

.score-value {
  font-size: 48px;
  font-weight: bold;
  color: #e74c3c;
  text-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
}

.score-label {
  font-size: 11px;
  color: #aaa;
}
</style>