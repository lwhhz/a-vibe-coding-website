<template>
  <div class="other-info">
    <h2>其他信息修改</h2>

    <div v-if="successMessage" class="success-message alert-box">
      <strong>成功</strong>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = null" class="alert-close">×</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="content">
      <div class="section" v-for="sec in sections" :key="sec.key">
        <div class="section-header" @click="toggleSection(sec.key)">
          <div class="section-title-row">
            <span class="toggle-icon">{{ collapsed[sec.key] ? '▶' : '▼' }}</span>
            <h3>{{ sec.title }}</h3>
            <span class="section-count">{{ otherInfo[sec.key] ? otherInfo[sec.key].length : 0 }}项</span>
          </div>
          <p class="section-hint">{{ sec.hint }}</p>
        </div>
        <div class="section-body" v-show="!collapsed[sec.key]">
          <div class="items-list">
            <div v-for="(item, index) in otherInfo[sec.key]" :key="sec.key + '-' + index" class="item-card">
              <div class="item-header">
                <span class="item-number">{{ index + 1 }}</span>
                <button @click="removeItem(sec.key, index)" class="btn-remove">删除</button>
              </div>
              <div class="item-content">
                <div v-if="sec.key === 'history'" class="form-group">
                  <label>日期</label>
                  <input type="text" v-model="item.date" placeholder="如: 2010年" />
                </div>
                <div v-if="item.icon !== undefined" class="form-group">
                  <label>图标</label>
                  <input type="text" v-model="item.icon" :placeholder="'输入emoji图标，如: ' + (sec.key === 'history' ? '' : '🏭')" />
                </div>
                <div class="form-group">
                  <label>标题</label>
                  <input type="text" v-model="item.title" :placeholder="'输入' + sec.label + '标题'" />
                </div>
                <div v-if="item.description !== undefined" class="form-group">
                  <label>描述</label>
                  <textarea v-model="item.description" :placeholder="'输入' + sec.label + '描述'"></textarea>
                </div>
              </div>
            </div>
          </div>
          <button @click="addItem(sec.key)" class="btn-add">+ 添加{{ sec.label }}</button>
        </div>
      </div>

      <div class="actions">
        <button @click="saveInfo" class="btn-save" :disabled="saving">
          {{ saving ? '保存中...' : '保存所有信息' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OtherInfo',
  data() {
    return {
      otherInfo: {
        advantages: [],
        history: [],
        certifications: [],
        services: [],
        homeAdvantages: []
      },
      collapsed: {
        advantages: false,
        history: false,
        certifications: false,
        services: false,
        homeAdvantages: false
      },
      sections: [
        { key: 'advantages', title: '公司优势', hint: '显示在"关于我们"页面，每个优势包含图标、标题和描述', label: '优势' },
        { key: 'history', title: '发展历程', hint: '显示在"关于我们"页面，每个历程包含日期、标题和描述', label: '历程' },
        { key: 'certifications', title: '资质认证', hint: '显示在"关于我们"页面，每个认证包含图标和标题', label: '认证' },
        { key: 'services', title: '本地服务优势', hint: '显示在"联系我们"页面，每个服务包含图标、标题和描述', label: '服务' },
        { key: 'homeAdvantages', title: '首页本地优势', hint: '显示在官网首页"本地优势"区域，每个优势包含图标、标题和描述', label: '优势' }
      ],
      loading: true,
      saving: false,
      successMessage: null
    }
  },
  async mounted() {
    await this.loadInfo()
  },
  methods: {
    toggleSection(key) {
      this.collapsed[key] = !this.collapsed[key]
    },
    async loadInfo() {
      try {
        this.loading = true
        const response = await axios.get('/api/other-info')
        this.otherInfo = {
          advantages: response.data.advantages || [],
          history: response.data.history || [],
          certifications: response.data.certifications || [],
          services: response.data.services || [],
          homeAdvantages: response.data.homeAdvantages || []
        }
      } catch (error) {
        console.error('加载信息失败:', error)
        alert('加载信息失败')
      } finally {
        this.loading = false
      }
    },
    addItem(type) {
      if (type === 'history') {
        this.otherInfo.history.push({ date: '', title: '', description: '' })
      } else if (type === 'certifications') {
        this.otherInfo.certifications.push({ icon: '', title: '' })
      } else {
        this.otherInfo[type].push({ icon: '', title: '', description: '' })
      }
      if (this.collapsed[type]) {
        this.collapsed[type] = false
      }
    },
    removeItem(type, index) {
      if (confirm('确定要删除此项吗？')) {
        this.otherInfo[type].splice(index, 1)
      }
    },
    async saveInfo() {
      try {
        this.saving = true
        this.successMessage = null
        await axios.post('/api/other-info', this.otherInfo)
        this.successMessage = '信息保存成功'
        window.scrollTo(0, 0)
        setTimeout(() => {
          this.successMessage = null
        }, 3000)
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.other-info {
  padding: 20px;
}

.other-info h2 {
  margin-bottom: 20px;
  color: var(--primary-color);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  padding: 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.section-header:hover {
  background-color: #f8f9fa;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title-row h3 {
  margin: 0;
  color: var(--secondary-color);
}

.toggle-icon {
  font-size: 12px;
  color: var(--secondary-color);
  width: 16px;
  flex-shrink: 0;
}

.section-count {
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: normal;
}

.section-hint {
  color: #666;
  font-size: 14px;
  margin: 5px 0 0 26px;
}

.section-body {
  padding: 0 20px 20px;
}

.items-list {
  margin-bottom: 15px;
}

.item-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-number {
  background: var(--primary-color);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-remove:hover {
  background: #c82333;
}

.item-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group textarea {
  min-height: 60px;
  resize: vertical;
}

.btn-add {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-add:hover {
  background: #3db8d4;
}

.actions {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-save {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-save:hover {
  background: #008f68;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
