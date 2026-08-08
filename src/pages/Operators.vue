<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { recognizeImage } from '@/api/ocr'

interface Operator {
  name: string
  profession: string
  avatar_url: string
  skills: string[]
}

const RARITIES = ['1星', '2星', '3星', '4星', '5星', '6星'] as const
const PROFESSIONS = ['先锋', '近卫', '重装', '狙击', '术师', '医疗', '辅助', '特种'] as const

const allOperators = ref<Record<string, Operator[]>>({})
const loading = ref(true)
const loadError = ref('')
const recognizing = ref(false)
const recognizeStatus = ref('')
const fileInput = ref<HTMLInputElement>()
// 0 = 图标模式, 1 = 文字+图标模式
const skillDisplayMode = ref<0 | 1>(0)

const selectedStars = reactive(new Set<string>(JSON.parse(localStorage.getItem('operatorFilter_stars') || '[]')))
const selectedClasses = reactive(new Set<string>(JSON.parse(localStorage.getItem('operatorFilter_classes') || '[]')))
const selectedOperators = reactive(new Set<string>())
const selectedSkills = reactive(new Set<string>())
const ocrPriority = ref<string[]>([])
const e1Mode = ref(localStorage.getItem('operatorFilter_e1Mode') === 'true')
watch(e1Mode, (val) => {
  localStorage.setItem('operatorFilter_e1Mode', String(val))
  if (val) {
    // 切换到精一模式时，将选中第3个技能的干员改为选中第2个技能
    const toSwitch: string[] = []
    selectedSkills.forEach(skillKey => {
      const [opName, skillName] = skillKey.split('::')
      const op = findOperatorByName(opName)
      if (op) {
        const visibleSkills = getVisibleSkills(op)
        if (!visibleSkills.includes(skillName) && visibleSkills.length >= 2) {
          toSwitch.push(opName)
        }
      }
    })
    toSwitch.forEach(opName => {
      const op = findOperatorByName(opName)
      if (op) {
        selectedSkills.delete(opName + '::' + op.skills[2])
        selectedSkills.add(opName + '::' + op.skills[1])
      }
    })
  }
})

function getVisibleSkills(op: Operator): string[] {
  return e1Mode.value ? op.skills.slice(0, 2) : op.skills
}

const totalCount = computed(() => {
  let count = 0
  RARITIES.forEach(r => {
    const ops = allOperators.value[r]
    if (ops) count += ops.length
  })
  return count
})

const displayCount = computed(() => {
  let count = 0
  RARITIES.forEach(r => {
    const ops = allOperators.value[r]
    if (!ops) return
    const starMatch = selectedStars.size === 0 || selectedStars.has(r)
    if (!starMatch) return
    ops.forEach(op => {
      const classMatch = selectedClasses.size === 0 || selectedClasses.has(op.profession)
      if (classMatch) count++
    })
  })
  return count
})

const selectedInfo = computed(() => {
  if (selectedOperators.size > 0) return `已选 ${selectedOperators.size} 干员`
  return ''
})

const filteredOperators = computed(() => {
  const result: { rarity: string; op: Operator }[] = []
  RARITIES.forEach(r => {
    const ops = allOperators.value[r]
    if (!ops) return
    const starMatch = selectedStars.size === 0 || selectedStars.has(r)
    if (!starMatch) return
    ops.forEach(op => {
      const classMatch = selectedClasses.size === 0 || selectedClasses.has(op.profession)
      if (classMatch) {
        result.push({ rarity: r, op })
      }
    })
  })
  if (ocrPriority.value.length > 0) {
    result.sort((a, b) => {
      const ai = ocrPriority.value.indexOf(a.op.name)
      const bi = ocrPriority.value.indexOf(b.op.name)
      const aIdx = ai === -1 ? Infinity : ai
      const bIdx = bi === -1 ? Infinity : bi
      return aIdx - bIdx
    })
  }
  return result
})

function getRarityNum(rarity: string): number {
  return parseInt(rarity)
}

function getFirstChar(name: string): string {
  return name.charAt(0)
}

const apiUrl = import.meta.env.VITE_API_URL || ''

function getAvatarUrl(avatarUrl: string): string {
  return apiUrl + 'wiki_upload/images/' + avatarUrl
}

function getSkillIconUrl(opName: string, skillName: string): string {
  return apiUrl + 'wiki_upload/skills/' + opName + '/' + skillName + '.png'
}

function saveFilters() {
  localStorage.setItem('operatorFilter_stars', JSON.stringify(Array.from(selectedStars)))
  localStorage.setItem('operatorFilter_classes', JSON.stringify(Array.from(selectedClasses)))
}

function toggleStar(r: string) {
  if (selectedStars.has(r)) selectedStars.delete(r)
  else selectedStars.add(r)
  saveFilters()
}

function toggleClass(p: string) {
  if (selectedClasses.has(p)) selectedClasses.delete(p)
  else selectedClasses.add(p)
  saveFilters()
}

function toggleOperator(op: Operator) {
  const visibleSkills = getVisibleSkills(op)
  if (selectedOperators.has(op.name)) {
    selectedOperators.delete(op.name)
    visibleSkills.forEach(skill => {
      selectedSkills.delete(op.name + '::' + skill)
    })
  } else {
    selectedOperators.add(op.name)
    if (visibleSkills.length > 0) {
      visibleSkills.forEach(skill => {
        selectedSkills.delete(op.name + '::' + skill)
      })
      selectedSkills.add(op.name + '::' + visibleSkills[visibleSkills.length - 1])
    }
  }
}

function toggleSkill(opName: string, skillKey: string) {
  if (selectedSkills.has(skillKey)) {
    // 再次点击已选中的技能 = 取消选中该干员（同时清除技能）
    selectedOperators.delete(opName)
    const op = findOperatorByName(opName)
    if (op) {
      op.skills.forEach(skill => {
        selectedSkills.delete(opName + '::' + skill)
      })
    }
    return
  }
  // 选中技能 = 同时选中干员
  if (!selectedOperators.has(opName)) {
    selectedOperators.add(opName)
  }
  // 清除同一干员下的其他技能选中，切换到新技能
  const op = findOperatorByName(opName)
  if (op) {
    op.skills.forEach(skill => {
      selectedSkills.delete(opName + '::' + skill)
    })
  }
  selectedSkills.add(skillKey)
}

function findOperatorByName(name: string): Operator | undefined {
  for (const rarity of RARITIES) {
    const ops = allOperators.value[rarity]
    if (ops) {
      const found = ops.find(op => op.name === name)
      if (found) return found
    }
  }
  return undefined
}

function isSelected(name: string) {
  return selectedOperators.has(name)
}

function isSkillSelected(skillKey: string) {
  return selectedSkills.has(skillKey)
}

function isStarActive(r: string) {
  return selectedStars.has(r)
}

function isClassActive(p: string) {
  return selectedClasses.has(p)
}

async function handleGenerate() {
  const parts: string[] = []
  // 有技能选中的干员
  selectedSkills.forEach(skillKey => {
    const [opName, skillName] = skillKey.split('::')
    const op = findOperatorByName(opName)
    if (op && skillName) {
      const idx = op.skills.indexOf(skillName) + 1
      parts.push(opName + idx)
    }
  })
  // 没有技能的干员（只显示干员名）
  selectedOperators.forEach(opName => {
    const hasSkill = Array.from(selectedSkills).some(key => key.startsWith(opName + '::'))
    if (!hasSkill) {
      parts.push(opName)
    }
  })
  if (parts.length === 0) return
  const text = parts.join('+')
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板：' + text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    // @ts-ignore - execCommand is deprecated but needed as fallback
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('已复制到剪贴板：' + text)
  }
}

function clearStars() {
  selectedStars.clear()
  saveFilters()
}

function clearClasses() {
  selectedClasses.clear()
  saveFilters()
}

function triggerRecognize() {
  fileInput.value?.click()
}

async function handleRecognize(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

    recognizing.value = true
    recognizeStatus.value = '正在识别文字...'

  try {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        // 如果原始图片小于800KB就不压缩
        if (file.size < 800 * 1024) {
          resolve(dataUrl)
          return
        }
        // 大图才压缩
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxW = 1200
          const scale = img.width > maxW ? maxW / img.width : 1
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    })

    selectedOperators.clear()
    selectedSkills.clear()

    const res = await recognizeImage(base64)
    const apiData = res.data

    const lines: string[] = []
    if (apiData.lines) {
      apiData.lines.forEach((item: any) => {
        lines.push(item.text)
      })
    }

    const matchedOps: string[] = []
    const allOpNames: string[] = []
    RARITIES.forEach(r => {
      const ops = allOperators.value[r]
      if (ops) ops.forEach(op => allOpNames.push(op.name))
    })

    for (const line of lines) {
      const trimmed = line.trim()
      if (allOpNames.includes(trimmed) && !matchedOps.includes(trimmed)) {
        matchedOps.push(trimmed)
      }
    }

    if (matchedOps.length === 0) {
      recognizeStatus.value = '未识别到干员，请确认截图中有干员名字'
      setTimeout(() => { recognizeStatus.value = '' }, 3000)
      return
    }

    ocrPriority.value = [...matchedOps]
    matchedOps.forEach(name => {
      if (!selectedOperators.has(name)) {
        const op = findOperatorByName(name)
        if (op) toggleOperator(op)
      }
    })

    recognizeStatus.value = '已识别 ' + matchedOps.length + ' 个干员：' + matchedOps.join('、')
    setTimeout(() => { recognizeStatus.value = '' }, 4000)
  } catch (err: any) {
    recognizeStatus.value = '识别失败：' + (err.message || '未知错误')
    setTimeout(() => { recognizeStatus.value = '' }, 3000)
  } finally {
    recognizing.value = false
  }
}

function resetSelection() {
  selectedOperators.clear()
  selectedSkills.clear()
}

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  // Show placeholder
  const placeholder = img.parentElement?.querySelector('.avatar-placeholder') as HTMLElement
  if (placeholder) placeholder.style.display = 'flex'
}

onMounted(async () => {
  try {
    const res = await fetch(apiUrl + 'wiki_upload/operators.json')
    if (!res.ok) throw new Error('加载失败: ' + res.status)
    allOperators.value = await res.json()
  } catch (err: any) {
    loadError.value = err.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="operators-page">
    <!-- 精一模式按钮 -->
    <button
      class="mode-toggle-btn e1-btn"
      :class="{ active: e1Mode }"
      @click="e1Mode = !e1Mode"
    >
      {{ e1Mode ? '精一模式' : '精二模式' }}
    </button>
    <!-- 右上角切换按钮 -->
    <button
      class="mode-toggle-btn mode-btn"
      :title="skillDisplayMode === 0 ? '切换到文字模式' : '切换到图标模式'"
      @click="skillDisplayMode = skillDisplayMode === 0 ? 1 : 0"
    >
      {{ skillDisplayMode === 0 ? '☰ 文字' : '▣ 图标' }}
    </button>

    <!-- 顶部筛选栏 -->
    <div class="filter-bar">
      <div class="filter-section">
        <span class="filter-label">星级</span>
        <div class="filter-group">
          <button
            v-for="(r, i) in RARITIES"
            :key="r"
            class="filter-btn"
            :class="['star-' + (i + 1), { active: isStarActive(r) }]"
            @click="toggleStar(r)"
          >
            {{ i + 1 }}★
          </button>
          <button class="filter-btn" :class="{ active: selectedStars.size === 0 }" @click="clearStars" title="不限星级">不限</button>
        </div>
      </div>
      <div class="filter-section">
        <span class="filter-label">职业</span>
        <div class="filter-group">
          <button
            v-for="p in PROFESSIONS"
            :key="p"
            class="filter-btn"
            :class="{ active: isClassActive(p) }"
            @click="toggleClass(p)"
          >
            {{ p }}
          </button>
          <button class="filter-btn" :class="{ active: selectedClasses.size === 0 }" @click="clearClasses" title="不限职业">不限</button>
        </div>
      </div>
      <button class="recognize-btn" @click="triggerRecognize" :disabled="recognizing">{{ recognizing ? '识别中...' : '图像识别' }}</button>
      <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleRecognize" />
      <div class="recognize-status" v-if="recognizeStatus">{{ recognizeStatus }}</div>
      <button class="reset-selection-btn" @click="resetSelection" :disabled="selectedOperators.size === 0">重置选中</button>
      <button class="generate-btn" @click="handleGenerate" :disabled="selectedOperators.size === 0">生成</button>
    </div>

    <!-- 统计栏 -->
    <div class="stats-bar">
      <span>显示: <span class="count">{{ displayCount }}</span> / {{ totalCount }} 干员</span>
      <span class="selected-info" v-if="selectedInfo">{{ selectedInfo }}</span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="loadError" class="empty-state">加载 operators.json 失败: {{ loadError }}</div>

    <!-- 干员网格 -->
    <div v-else class="operators-grid" :class="{ 'e1-mode': e1Mode }">
      <template v-for="{ rarity, op } in filteredOperators" :key="op.name">
        <div
          class="operator-card"
          :class="{ selected: isSelected(op.name) }"
          :data-rarity="getRarityNum(rarity)"
          @click="toggleOperator(op)"
        >
          <div class="avatar-wrapper">
            <div class="rarity-badge">★{{ getRarityNum(rarity) }}</div>
            <img
              :src="getAvatarUrl(op.avatar_url)"
              :alt="op.name"
              loading="lazy"
              @error="handleImgError"
            />
            <div class="avatar-placeholder" style="display: none">
              {{ getFirstChar(op.name) }}
            </div>
          </div>
          <div class="operator-info">
            <div class="operator-name" :title="op.name">{{ op.name }}</div>
            <div class="operator-profession">{{ op.profession }}</div>
            <!-- 图标模式：精二固定3个槽位，精一固定2个槽位 -->
            <div v-if="skillDisplayMode === 0" class="skills-icon-row">
              <div
                v-for="idx in (e1Mode ? 2 : 3)"
                :key="idx"
                class="skill-icon-slot"
                :class="{
                  empty: !getVisibleSkills(op)[idx - 1],
                  selected: getVisibleSkills(op)[idx - 1] && isSkillSelected(op.name + '::' + getVisibleSkills(op)[idx - 1])
                }"
                @click.stop="getVisibleSkills(op)[idx - 1] && toggleSkill(op.name, op.name + '::' + getVisibleSkills(op)[idx - 1])"
              >
                <img
                  v-if="getVisibleSkills(op)[idx - 1]"
                  :src="getSkillIconUrl(op.name, getVisibleSkills(op)[idx - 1])"
                  :alt="getVisibleSkills(op)[idx - 1]"
                  :title="getVisibleSkills(op)[idx - 1]"
                  class="skill-icon-img"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
              </div>
            </div>
            <!-- 文字+图标模式 -->
            <div v-else class="skills-list">
              <template v-if="getVisibleSkills(op).length > 0">
                <span
                  v-for="skill in getVisibleSkills(op)"
                  :key="skill"
                  class="skill-tag"
                  :class="{ selected: isSkillSelected(op.name + '::' + skill) }"
                  :title="skill"
                  @click.stop="toggleSkill(op.name, op.name + '::' + skill)"
                >
                  <img
                    :src="getSkillIconUrl(op.name, skill)"
                    :alt="skill"
                    class="skill-icon"
                    @error="($event.target as HTMLImageElement).style.display='none'"
                  />
                  {{ skill }}
                </span>
              </template>
              <span v-else class="no-skills">无技能</span>
            </div>
          </div>
        </div>
      </template>

      <div v-if="filteredOperators.length === 0" class="empty-state">
        没有符合条件的干员
      </div>
      <div class="bottom-spacer"></div>
    </div>
  </div>
</template>

<style scoped>
.operators-page {
  min-height: 100vh;
  background: #1a1a2e;
  color: #e0e0e0;
  position: relative;
}

/* 右上角按钮 */
.mode-toggle-btn {
  position: fixed;
  top: 12px;
  z-index: 200;
  padding: 6px 14px;
  border: 1px solid #445577;
  border-radius: 6px;
  background: #1e2a45;
  color: #aaccee;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.mode-btn {
  right: 16px;
}

.e1-btn {
  right: 110px;
}

.mode-toggle-btn:hover {
  background: #2a3a5a;
  border-color: #6688bb;
  color: #ffffff;
}

.mode-toggle-btn.active {
  background: #0f3460;
  border-color: #2980b9;
  color: #ffffff;
}

/* 顶部筛选栏 */
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #16213e;
  border-bottom: 2px solid #0f3460;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.filter-section {
  margin-bottom: 10px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: inline-block;
  font-size: 13px;
  color: #8899aa;
  margin-right: 10px;
  min-width: 50px;
  vertical-align: middle;
  user-select: none;
}

.filter-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  vertical-align: middle;
  align-items: center;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border: 1px solid #334466;
  border-radius: 4px;
  background: #1a1a2e;
  color: #99aabb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #5588bb;
  color: #ccddeeff;
  background: #223355;
}

.filter-btn.active {
  background: #0f3460;
  border-color: #2980b9;
  color: #ffffff;
  box-shadow: 0 0 8px rgba(41, 128, 185, 0.3);
}

.star-1.active {
  background: #555555;
  border-color: #888888;
}
.star-2.active {
  background: #5a7a3a;
  border-color: #88aa55;
}
.star-3.active {
  background: #3a5a7a;
  border-color: #5588bb;
}
.star-4.active {
  background: #6a4a8a;
  border-color: #9966cc;
}
.star-5.active {
  background: #8a7a2a;
  border-color: #ccaa33;
}
.star-6.active {
  background: #8a4a2a;
  border-color: #ff8833;
}

.reset-selection-btn {
  position: absolute;
  right: 108px;
  bottom: 12px;
  padding: 6px 16px;
  border: 1px solid #445566;
  border-radius: 4px;
  background: #1a2a3e;
  color: #99aabb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-selection-btn:hover:not(:disabled) {
  background: #223344;
  border-color: #557788;
  color: #ccddeeff;
}

.reset-selection-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.generate-btn {
  position: absolute;
  right: 20px;
  bottom: 12px;
  padding: 6px 20px;
  border: 1px solid #2980b9;
  border-radius: 4px;
  background: #0f3460;
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background: #2980b9;
  box-shadow: 0 0 8px rgba(41, 128, 185, 0.4);
}

.generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.recognize-btn {
  position: absolute;
  right: 204px;
  bottom: 12px;
  padding: 6px 16px;
  border: 1px solid #445566;
  border-radius: 4px;
  background: #1a2a3e;
  color: #99aabb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.recognize-btn:hover:not(:disabled) {
  background: #223344;
  border-color: #557788;
  color: #ccddeeff;
}

.recognize-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.recognize-status {
  position: absolute;
  right: 340px;
  bottom: 16px;
  font-size: 12px;
  color: #88aacc;
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 统计栏 */
.stats-bar {
  padding: 10px 20px;
  background: #1a1a2e;
  font-size: 13px;
  color: #667788;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #222244;
}

.stats-bar .count {
  color: #2980b9;
  font-weight: bold;
}

.selected-info {
  margin-left: auto;
  font-size: 12px;
  color: #889;
}

/* 干员网格 */
.operators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 16px 20px;
}

/* 干员卡片 */
.operator-card {
  background: #1e2a40;
  border: 2px solid #2a3a55;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}


.operator-card.selected {
  border-color: #ff6600;
  box-shadow: 0 0 12px rgba(255, 102, 0, 0.3);
}

.operator-card.selected::after {
  content: '✓';
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 16px;
  color: #ff6600;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  z-index: 2;
}

/* 星级边框颜色 */
.operator-card[data-rarity='1'] {
  border-color: #444;
}
.operator-card[data-rarity='2'] {
  border-color: #556644;
}
.operator-card[data-rarity='3'] {
  border-color: #335577;
}
.operator-card[data-rarity='4'] {
  border-color: #664488;
}
.operator-card[data-rarity='5'] {
  border-color: #887733;
}
.operator-card[data-rarity='6'] {
  border-color: #885522;
}

.operator-card[data-rarity='1'].selected {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}
.operator-card[data-rarity='2'].selected {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}
.operator-card[data-rarity='3'].selected {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}
.operator-card[data-rarity='4'].selected {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}
.operator-card[data-rarity='5'].selected {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}
.operator-card[data-rarity='6'].selected {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}

/* 头像区域 */
.avatar-wrapper {
  width: 100%;
  aspect-ratio: 1;
  background: #16213e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: #556677;
  background: linear-gradient(135deg, #1a2a3e, #16213e);
}

.rarity-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  color: #ffcc00;
  font-weight: bold;
  z-index: 1;
}

/* 干员信息区域 */
.operator-info {
  padding: 8px 4px;
}

.operator-name {
  font-size: 13px;
  font-weight: bold;
  color: #ddeeff;
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operator-profession {
  font-size: 11px;
  color: #7799aa;
  margin-bottom: 6px;
}

/* 技能标签 */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #162838;
  border: 1px solid #2a4055;
  border-radius: 3px;
  font-size: 13px;
  color: #88aacc;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skill-tag:hover {
  background: #1a3a55;
  border-color: #4488aa;
  color: #aaddee;
}

.skill-tag.selected {
  background: #003318;
  border-color: #00cc44;
  color: #66ff99;
  box-shadow: 0 0 6px rgba(0, 204, 68, 0.35), 0 0 12px rgba(0, 204, 68, 0.15);
}

.skill-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 图标模式：3个固定位置 */
.skills-icon-row {
  display: flex;
  gap: 4px;
  padding: 2px;
}

.skill-icon-slot {
  flex: 1;
  background: #16213e;
  border: 2px solid #2a3a55;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  position: relative;
  padding: 0;
  line-height: 0;
}

.skill-icon-slot.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
  pointer-events: none;
}

.skill-icon-slot:not(.empty):hover {
  background: #1a3050;
  border-color: #4488aa;
}

.e1-mode .skill-icon-slot:not(.empty) {
  transform: scale(0.9);
}

.skill-icon-slot {
  overflow: visible;
}

.skill-icon-slot.selected {
  z-index: 1;
  box-shadow: 0 0 8px rgba(0, 220, 80, 0.45), 0 0 16px rgba(0, 220, 80, 0.2);
}

.skill-icon-slot.selected .skill-icon-img {
  transform: translateY(-4px);
}

.skill-icon-slot.selected::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: -2px;
  right: -2px;
  height: 4px;
  background: #00cc44;
  box-shadow: 0 0 6px rgba(0, 204, 68, 0.7), 0 0 12px rgba(0, 204, 68, 0.4);
  z-index: 3;
}


.skill-icon-img {
  display: block;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  margin: -2px;
  object-fit: contain;
}

.no-skills {
  font-size: 11px;
  color: #556;
  font-style: italic;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #556677;
  font-size: 16px;
  grid-column: 1 / -1;
}

/* 底部间距 */
.bottom-spacer {
  height: 40px;
  grid-column: 1 / -1;
}

/* 响应式 */
@media (max-width: 600px) {
  .operators-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 10px;
  }
  .filter-bar {
    padding: 10px 12px;
  }
  .filter-btn {
    padding: 4px 10px;
    font-size: 12px;
  }
  .operator-name {
    font-size: 12px;
  }
  .skill-tag {
    font-size: 10px;
    padding: 1px 6px;
  }
  .mode-toggle-btn {
    top: 8px;
    right: 10px;
    padding: 4px 10px;
    font-size: 12px;
  }
}
</style>