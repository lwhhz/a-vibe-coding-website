<template>
  <div>
    <!-- 成功提示 -->
    <div v-if="successMessage" class="success-message alert-box">
      <strong>成功</strong>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = null" class="alert-close">×</button>
    </div>
    
    <!-- 加载错误提示 -->
    <div v-if="loadError" class="error-message alert-box">
      <strong>加载失败</strong>
      <p>{{ loadError }}</p>
      <pre v-if="loadErrorDetail">{{ loadErrorDetail }}</pre>
      <button @click="retryLoad" class="alert-close">×</button>
    </div>
    
    <!-- 更新状态错误提示 -->
    <div v-if="updateError" class="error-message alert-box">
      <strong>更新失败</strong>
      <p>{{ updateError }}</p>
      <pre v-if="updateErrorDetail">{{ updateErrorDetail }}</pre>
      <button @click="updateError = null" class="alert-close">×</button>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h2>咨询表单详情</h2>
        <router-link to="/" class="btn btn-outline">
          返回列表
        </router-link>
      </div>
      
      <!-- 加载中 -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 表单详情 -->
      <template v-else-if="contactForm">
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label>姓名</label>
              <input type="text" :value="contactForm.name" disabled />
            </div>
            <div class="form-group">
              <label>电话</label>
              <input type="text" :value="contactForm.phone" disabled />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" :value="contactForm.email" disabled />
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="formStatus" @change="updateStatus">
                <option value="pending">待处理</option>
                <option value="processed">处理中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>咨询主题</label>
            <input type="text" :value="contactForm.subject" disabled />
          </div>
          <div class="form-group">
            <label>咨询内容</label>
            <textarea :value="contactForm.message" disabled></textarea>
          </div>
          <div class="form-group">
            <label>提交时间</label>
            <input type="text" :value="formatDate(contactForm.createdAt)" disabled />
          </div>
        </div>
      </template>
      
      <!-- 不存在 -->
      <div v-else class="empty-state">
        <div class="empty-state-icon">❌</div>
        <p>咨询表单不存在</p>
        <router-link to="/" class="btn btn-primary">
          返回列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ContactFormDetail',
  data() {
    return {
      contactForm: null,
      loading: true,
      formStatus: '',
      successMessage: null,
      loadError: null,
      loadErrorDetail: null,
      updateError: null,
      updateErrorDetail: null
    }
  },
  mounted() {
    this.loadContactForm()
  },
  methods: {
    async loadContactForm() {
      try {
        this.loading = true
        this.loadError = null
        this.loadErrorDetail = null
        const { id } = this.$route.params
        const response = await axios.get(`http://localhost:5000/api/contact-forms/${id}`)
        this.contactForm = response.data
        this.formStatus = response.data.status
      } catch (error) {
        this.loadError = '加载咨询表单失败，请稍后重试'
        this.loadErrorDetail = this.getErrorDetails(error)
        console.error('加载咨询表单失败:', error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      await this.loadContactForm()
    },
    async updateStatus() {
      try {
        this.updateError = null
        this.updateErrorDetail = null
        const { id } = this.$route.params
        await axios.put(`http://localhost:5000/api/contact-forms/${id}`, {
          status: this.formStatus
        })
        this.contactForm.status = this.formStatus
        this.successMessage = '状态更新成功'
        setTimeout(() => {
          this.successMessage = null
        }, 3000)
      } catch (error) {
        this.updateError = '更新状态失败，请稍后重试'
        this.updateErrorDetail = this.getErrorDetails(error)
        console.error('更新状态失败:', error)
        // 恢复原状态
        if (this.contactForm) {
          this.formStatus = this.contactForm.status
        }
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.card-header h2 {
  color: var(--primary-color);
  margin: 0;
}
</style>
