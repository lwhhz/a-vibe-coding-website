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
    
    <!-- 删除错误提示 -->
    <div v-if="deleteError" class="error-message alert-box">
      <strong>删除失败</strong>
      <p>{{ deleteError }}</p>
      <pre v-if="deleteErrorDetail">{{ deleteErrorDetail }}</pre>
      <button @click="deleteError = null" class="alert-close">×</button>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h2>咨询表单列表</h2>
        <p>管理所有用户提交的咨询表单</p>
      </div>
      <div class="card-body">
        <!-- 加载中 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <template v-else>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>姓名</th>
                  <th>电话</th>
                  <th>邮箱</th>
                  <th>主题</th>
                  <th>状态</th>
                  <th>提交时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody v-if="contactForms.length > 0">
                <tr v-for="form in contactForms" :key="form.id">
                  <td>{{ form.id }}</td>
                  <td>{{ form.name }}</td>
                  <td>{{ form.phone }}</td>
                  <td>{{ form.email }}</td>
                  <td>{{ form.subject }}</td>
                  <td>
                    <span :class="['status-badge', `status-${form.status}`]">
                      {{ form.status === 'pending' ? '待处理' : form.status === 'processed' ? '处理中' : '已完成' }}
                    </span>
                  </td>
                  <td>{{ formatDate(form.createdAt) }}</td>
                  <td>
                    <div class="action-buttons">
                      <router-link :to="`/form/${form.id}`" class="btn btn-outline">
                        查看
                      </router-link>
                      <button @click="deleteForm(form.id)" class="btn btn-danger">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="8" class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>暂无咨询表单</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ContactFormList',
  data() {
    return {
      contactForms: [],
      loading: true,
      successMessage: null,
      loadError: null,
      loadErrorDetail: null,
      deleteError: null,
      deleteErrorDetail: null
    }
  },
  mounted() {
    this.loadContactForms()
  },
  methods: {
    async loadContactForms() {
      try {
        this.loading = true
        this.loadError = null
        this.loadErrorDetail = null
        const response = await axios.get('http://localhost:5000/api/contact-forms')
        this.contactForms = response.data
      } catch (error) {
        this.loadError = '加载咨询表单失败，请稍后重试'
        this.loadErrorDetail = this.getErrorDetails(error)
        console.error('加载咨询表单失败:', error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      await this.loadContactForms()
    },
    async deleteForm(id) {
      if (confirm('确定要删除这个咨询表单吗？')) {
        try {
          this.deleteError = null
          this.deleteErrorDetail = null
          await axios.delete(`http://localhost:5000/api/contact-forms/${id}`)
          this.contactForms = this.contactForms.filter(form => form.id !== id)
          this.successMessage = '删除成功'
          setTimeout(() => {
            this.successMessage = null
          }, 3000)
        } catch (error) {
          this.deleteError = '删除失败，请稍后重试'
          this.deleteErrorDetail = this.getErrorDetails(error)
          console.error('删除失败:', error)
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
  margin-bottom: 20px;
}

.card-header h2 {
  color: var(--primary-color);
  margin-bottom: 5px;
}

.card-header p {
  color: var(--light-text);
  font-size: 14px;
}

.table-responsive {
  overflow-x: auto;
}
</style>
