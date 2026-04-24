<template>
  <div class="dashboard">
    
    <div v-if="error" class="error-message alert-box">
      <strong>加载失败</strong>
      <p>{{ error }}</p>
      <pre v-if="errorDetail">{{ errorDetail }}</pre>
      <button @click="retryLoad" class="alert-close">×</button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <template v-else>
      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="dashboard-card-icon">🚗</div>
          <div class="dashboard-card-title">产品数量</div>
          <div class="dashboard-card-value">{{ productCount }}</div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card-icon">📋</div>
          <div class="dashboard-card-title">案例数量</div>
          <div class="dashboard-card-value">{{ caseCount }}</div>
        </div>
      </div>
    
    <div class="card">
      <h2>最近活动</h2>
      <div class="activity-list">
        <div class="activity-item" v-for="(log, index) in activityLogs" :key="'log-' + index">
          <div class="activity-icon" :class="getActionClass(log.action)">{{ getActionIcon(log.action) }}</div>
          <div class="activity-content">
            <div class="activity-title">{{ log.action }}{{ log.type }}</div>
            <div class="activity-description">{{ log.title }} - {{ log.description }}</div>
            <div class="activity-time">{{ formatTime(log.createdAt) }}</div>
          </div>
        </div>
        <div v-if="activityLogs.length === 0" class="no-activity">
          暂无活动记录
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      productCount: 0,
      caseCount: 0,
      activityLogs: [],
      loading: true,
      error: null,
      errorDetail: null
    }
  },
  async mounted() {
    await this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const [productsResponse, casesResponse, logsResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/cases'),
          axios.get('/api/activity-logs?limit=20')
        ])
        this.productCount = productsResponse.data.length
        this.caseCount = casesResponse.data.length
        this.activityLogs = logsResponse.data
      } catch (error) {
        console.error('加载仪表盘数据失败:', error)
        this.error = '加载仪表盘数据失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      await this.loadDashboardData()
    },
    getActionIcon(action) {
      const icons = {
        '新增': '+',
        '更新': '✏️',
        '删除': '🗑️'
      }
      return icons[action] || '•'
    },
    getActionClass(action) {
      const classes = {
        '新增': 'action-create',
        '更新': 'action-update',
        '删除': 'action-delete'
      }
      return classes[action] || ''
    },
    formatTime(createdAt) {
      if (!createdAt) return ''
      const date = new Date(createdAt)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    },
    getErrorDetails(error) {
      if (error.response) {
        return `状态码: ${error.response.status}\n响应: ${JSON.stringify(error.response.data)}`
      } else if (error.request) {
        return `请求失败: ${error.message}`
      } else {
        return `错误: ${error.message}`
      }
    }
  }
}
</script>

<style scoped>
.activity-list {
  margin-top: 20px;
}

.activity-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
}

.activity-item:hover {
  background-color: #f5f7fa;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #00a878;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.activity-icon.action-create {
  background-color: #28a745;
}

.activity-icon.action-update {
  background-color: #ffc107;
  color: #333;
}

.activity-icon.action-delete {
  background-color: #dc3545;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-description {
  color: #666;
  margin-bottom: 5px;
  font-size: 14px;
}

.activity-time {
  color: #999;
  font-size: 12px;
}

.no-activity {
  text-align: center;
  padding: 30px;
  color: #999;
}
</style>
