<template>
  <div class="crisis-contract-page">
    <!-- 顶部信息栏 -->
    <div class="header">
      <div class="left-section">
        <div class="back-btn">←</div>
        <div class="map-info">
          <div class="map-name">{{ mapStageData?.name || '未知地图' }}</div>
          <div class="map-code">{{ mapStageData?.code || '' }}</div>
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
      <!-- 缩放控制 -->
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomOut" :disabled="zoomLevel <= MIN_ZOOM">-</button>
        <span class="zoom-level">{{ zoomPercentage }}</span>
        <button class="zoom-btn" @click="zoomIn" :disabled="zoomLevel >= MAX_ZOOM">+</button>
        <button class="zoom-btn reset" @click="resetZoom">重置</button>
      </div>
      
      <div class="current-score">
        <div class="score-value">{{ currentScore }}</div>
        <div class="score-label">Current Score</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue'

// ==================== 模拟后端数据处理 ====================
// 注意：实际项目中，这部分逻辑应该在后端完成

// 后端返回的数据结构
interface MapDataResponse {
  mapId: string
  mapName: string
  mapCode: string
  nodes: {
    id: string
    nodeType: 'START' | 'NORMAL' | 'KEYPOINT' | 'TREASURE'
    runeId: string | null
    slotPackId: string | null
    mutualExclusionGroup: string | null
    position: { x: number; y: number }
  }[]
  roads: {
    id: string
    startId: string
    endId: string
    positions: any // RoadPosition
  }[]
  packs: {
    id: string
    slotPackType: string
    slotPackName: string
    slotPackFullName: string
    rewardScore: number
    isDaily: boolean
    sortId: number
  }[]
  runes: {
    runeId: string
    runeGroupId: string
    runeIcon: string
    runeName: string
    score: number
    description: any // 已处理的字符串数组
    packedRune: {
      id: string
      points: number
      mutexGroupKey: string | null
      runes: {
        key: string
        blackboard: { key: string; value?: number; valueStr?: string }[]
      }[]
    }
  }[]
}

// 模拟后端处理 cc4.json（实际在后端完成）
async function processMapData(mapId: string): Promise<MapDataResponse> {
  // 实际项目中，这里从数据库或文件读取 cc4.json
  // 前端模拟：动态导入 cc4.json
  const rawData = await import('./cc4.json')
  const detail = (rawData as any).default?.info?.mapDetailDataMap?.[mapId]
  
  if (!detail) {
    throw new Error(`Map ${mapId} not found`)
  }

  // 处理节点数据
  const nodes = Object.entries(detail.nodeDataMap || {}).map(([id, data]: [string, any]) => {
    const pos = detail.nodeViewData?.nodePosMap?.[id]?.position || { x: 0, y: 0 }
    return {
      id,
      nodeType: data.nodeType,
      runeId: data.runeId || null,
      slotPackId: data.slotPackId || null,
      mutualExclusionGroup: data.mutualExclusionGroup || null,
      position: pos
    }
  })

  // 处理道路数据（只保留有有效位置数据且两端节点都存在的 road）
  const roads = Object.entries(detail.roadRelationDataMap || {})
    .filter(([id, data]: [string, any]) => {
      // 过滤条件：
      // 1. 必须有有效的 roadPos 数据
      // 2. 两端节点必须在 nodeDataMap 中存在（可以是 NODE/START/KEYPOINT 等任何类型）
      const roadPos = detail.nodeViewData?.roadPosMap?.[id]
      const startId = data.start?.id
      const endId = data.end?.id
      
      // 检查两端节点是否在 nodeDataMap 中存在（不限制类型）
      const startIsValidNode = startId && detail.nodeDataMap?.[startId]
      const endIsValidNode = endId && detail.nodeDataMap?.[endId]
      
      return roadPos && 
             roadPos.centerPos && 
             roadPos.startPos && 
             roadPos.endPos &&
             startIsValidNode &&
             endIsValidNode
    })
    .map(([id, data]: [string, any]) => {
      const roadPos = detail.nodeViewData.roadPosMap[id]
      return {
        id,
        startId: data.start.id,
        endId: data.end.id,
        positions: roadPos
      }
    })

  // 处理指标集数据
  const packs = Object.entries(detail.bagDataMap || {}).map(([id, data]: [string, any]) => ({
    id,
    slotPackType: data.slotPackType || '',
    slotPackName: data.slotPackName || '',
    slotPackFullName: data.slotPackFullName || '',
    rewardScore: data.rewardScore || 0,
    isDaily: data.isDaily || false,
    sortId: data.sortId || 0
  }))

  // 处理词条数据（包含 description 预处理）
  const runes = Object.entries(detail.runeDataMap || {}).map(([id, data]: [string, any]) => {
    // 预处理 description
    let description = data.packedRune?.description || ''
    if (typeof description === 'string') {
      // 简单的预处理示例，实际可能在后端做更复杂的处理
      description = description.split('\r\n').filter((line: string) => line.trim() !== '')
    }
    
    return {
      runeId: id,
      runeGroupId: data.runeGroupId || '',
      runeIcon: data.runeIcon || '',
      runeName: data.runeName || '',
      score: data.score || 0,
      description,
      packedRune: {
        id: data.packedRune?.id || id,
        points: data.packedRune?.points || 0,
        mutexGroupKey: data.packedRune?.mutexGroupKey || null,
        runes: (data.packedRune?.runes || []).map((rune: any) => ({
          key: rune.key,
          blackboard: rune.blackboard || []
        }))
      }
    }
  })

  // 获取地图信息
  const stageData = (rawData as any).default?.info?.mapStageDataMap?.[mapId]

  return {
    mapId,
    mapName: stageData?.name || '未知地图',
    mapCode: stageData?.code || '',
    nodes,
    roads,
    packs,
    runes
  }
}

// 模拟 API 调用（实际项目中，这里调用后端接口）
async function fetchMapData(mapId: string): Promise<MapDataResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  return processMapData(mapId)
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
const currentScore = ref(0)
const packBonusScore = ref(0)  // 指标集奖励分数
const globalYOffset = ref(0)  // 全局 Y 轴偏移（让所有内容向上移动）

// ==================== 画布和布局常量 ====================
const canvasWidth = ref(3000)      // Canvas 宽度（像素），会根据内容自动调整
const canvasHeight = ref(1500)     // Canvas 高度（像素），会根据内容自动调整
const offsetX = 10                 // 水平偏移量（像素）：所有节点/道路/指示器的基准 X 偏移
const offsetY = 800                // 垂直偏移量（像素）：JSON 坐标系原点在屏幕上的 Y 位置
const scale = 1.5                  // 缩放比例：JSON 坐标到屏幕像素的转换比例

// ==================== 缩放控制 ====================
const zoomLevel = ref(1.0)         // 缩放级别：1.0 = 100%，范围 0.5 - 2.0
const MIN_ZOOM = 0.5               // 最小缩放比例
const MAX_ZOOM = 2.0               // 最大缩放比例
const ZOOM_STEP = 0.1              // 每次缩放步长

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

// 缩放控制函数
function zoomIn() {
  if (zoomLevel.value < MAX_ZOOM) {
    zoomLevel.value = Math.min(zoomLevel.value + ZOOM_STEP, MAX_ZOOM)
  }
}

function zoomOut() {
  if (zoomLevel.value > MIN_ZOOM) {
    zoomLevel.value = Math.max(zoomLevel.value - ZOOM_STEP, MIN_ZOOM)
  }
}

function resetZoom() {
  zoomLevel.value = 1.0
}

// 格式化缩放比例显示（如 100%、150%）
const zoomPercentage = computed(() => Math.round(zoomLevel.value * 100) + '%')

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
  description: any  // 包含占位符如 {atk:0%}
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

const blue = "#0080ff";
const red = "#ff2020";
// 获取所有选中节点对应的 runeDataMap 数据
function getSelectedRunesData(): RuneData[] {
  const selectedRunes: RuneData[] = []
  
  selectedRuneNodes.value.forEach(nodeId => {
    const nodeData = nodes.value.get(nodeId)
    if (nodeData?.runeId) {
      const runeData = mapData.value?.runeDataMap?.[nodeData.runeId]
      if (runeData) {
        runeData.packedRune.description = parseDescription(runeData.packedRune);
        selectedRunes.push(runeData as RuneData)
      }
    }
  })
  
  return selectedRunes
}

const parseDescription = (packedRune: PackedRune) => {
  const descArr = packedRune.description
    .replaceAll(`<@crisisv2.pos>`, `<span style="color:${blue}">`)
    .replaceAll(`<@crisisv2.nag>`, `<span style="color:${red}">`)
    .replaceAll(`</>`, `</span>`)
    .split("\r\n");

  descArr.forEach((text, index) => {
    const regex = /{([^:}+]+)(?::\d+%?)?}/g;
    let match;
    
    while(match = regex.exec(text)){
      const hasPercent = match[0].includes("%");   //是否有百分号
      const hasColon = match[0].includes(":0");   //是否有:0

      let key = match[1];
            
      let value;

      packedRune.runes.find((rune: any) => {
        value = rune.blackboard.find((item: any) => item.key === key)?.value;
        return value;
      })



      if(value){
        descArr[index] = hasPercent? 
          descArr[index].replace(`{${key}:0%}`, parseFloat((value * 100).toFixed(3)) + "%")  //防止出现很长的小数
          : hasColon ? descArr[index].replace(`{${key}:0}`, value) 
            : descArr[index].replace(`{${key}}`, value);
      }
    }
  })

  return descArr;
}



// 从 API 数据获取地图阶段信息
const mapStageData = computed(() => {
  if (!mapData.value) return null
  return {
    name: mapData.value.mapName,
    code: mapData.value.mapCode
  }
})

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
  
  // 2. 转换为数组并排序（排除 null pack，即 START 节点）
  const sortedPacks = Array.from(packIntervals.entries())
    .map(([packId, interval]) => ({packId, ...interval}))
    .filter(p => p.packId !== null)  // 排除无 pack 的节点
    .sort((a, b) => a.minY - b.minY)
  
  // 如果没有 pack（如 crisis_v2_01-03_b 地图），直接返回空压缩
  if (sortedPacks.length === 0) {
    console.log('警告：该地图没有 pack 数据，跳过 Y 轴压缩')
    return {
      getOffset: () => 0,
      maxOffset: 0,
      gaps: [],
      sortedPacks: [],
      packOffsets: new Map()
    }
  }
  
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
  
  // 调试：打印所有 pack 和 gap 信息（已禁用）
  /*
  const debugInfo = {
    currentMap: CURRENT_MAP_ID,
    firstPackTop: Math.round(firstPackTop),
    targetTop: TARGET_TOP,
    extraTopOffset: Math.round(extraTopOffset),
    packs: sortedPacks.map(p => ({ 
      packId: p.packId, 
      minY: Math.round(p.minY), 
      maxY: Math.round(p.maxY),
      height: Math.round(p.maxY - p.minY)
    })),
    gaps: gaps.map(g => ({
      start: Math.round(g.start),
      end: Math.round(g.end),
      size: Math.round(g.size)
    })),
    nodeCount: nodes.value.size,
    packCount: packDataMap.value.size,
    rawNodes: Array.from(nodes.value.entries()).map(([id, data]) => ({
      id,
      type: data.nodeType,
      slotPackId: data.slotPackId,
      pos: nodePosMap.value.get(id)
    })).slice(0, 10)
  }
  
  ;(window as any).lastDebugInfo = debugInfo
  
  console.log('=== Y轴压缩调试 ===')
  console.log(debugInfo)
  console.log('提示：使用 copy(lastDebugInfo) 可复制此对象')
  
  const maxGap = Math.max(...gaps.map(g => g.size), 0)
  if (maxGap > 500) {
    console.warn('警告：检测到超大间隙:', maxGap, 'px，请检查地图数据!')
  }
  
  sortedPacks.forEach((pack, index) => {
    let offset = extraTopOffset
    for (const gap of gaps) {
      if (pack.minY > gap.start) {
        offset += gap.size
      }
    }
    packOffsets.set(pack.packId, offset)
    
    const packInfo = pack.packId ? packDataMap.value.get(pack.packId as string) : null
    const packName = packInfo?.slotPackFullName || packInfo?.slotPackName || pack.packId || 'START'
    console.log(`Pack ${index} (${packName}): minY=${pack.minY}, offset=${offset}, 新位置=${pack.minY - offset}`)
  })
  
  console.log('=== 压缩后的 pack 间距 ===')
  */
  
  const packOffsets = new Map<string | null, number>()
  
  sortedPacks.forEach((pack) => {
    let offset = extraTopOffset
    for (const gap of gaps) {
      if (pack.minY > gap.start) {
        offset += gap.size
      }
    }
    packOffsets.set(pack.packId, offset)
  })
  const compressedPacks = sortedPacks.map(p => ({
    packId: p.packId,
    originalMinY: p.minY,
    compressedMinY: p.minY - (packOffsets.get(p.packId) || 0),
    originalMaxY: p.maxY,
    compressedMaxY: p.maxY - (packOffsets.get(p.packId) || 0)
  }))
  
  // 调试输出已删除
  for (let i = 1; i < compressedPacks.length; i++) {
    const prev = compressedPacks[i - 1]
    const curr = compressedPacks[i]
    const gap = curr.compressedMinY - prev.compressedMaxY
    const prevInfo = prev.packId ? packDataMap.value.get(prev.packId as string) : null
    const currInfo = curr.packId ? packDataMap.value.get(curr.packId as string) : null
    // console.log(`${prevInfo?.slotPackFullName || prev.packId} -> ${currInfo?.slotPackFullName || curr.packId}: 间距=${gap}px`)
  }
  
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
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid #555;
}

/* 缩放控制 */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.zoom-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.zoom-btn.reset {
  width: auto;
  padding: 0 12px;
  font-size: 12px;
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
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