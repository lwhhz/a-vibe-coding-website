<template>
  <div class="case-list">
    <!-- 成功提示 -->
    <div v-if="successMessage" class="success-message alert-box">
      <strong>成功</strong>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = null" class="alert-close">×</button>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message alert-box">
      <strong>加载失败</strong>
      <p>{{ error }}</p>
      <pre v-if="errorDetail">{{ errorDetail }}</pre>
      <button @click="retryLoad" class="alert-close">×</button>
    </div>
    
    <!-- 删除错误提示 -->
    <div v-if="deleteError" class="error-message alert-box">
      <strong>删除失败</strong>
      <p>{{ deleteError }}</p>
      <pre v-if="deleteErrorDetail">{{ deleteErrorDetail }}</pre>
      <button @click="deleteError = null" class="alert-close">×</button>
    </div>
    
    <div class="page-header">
      <router-link to="/cases/create" class="btn btn-primary">添加案例</router-link>
    </div>
    
    <div class="search-box">
      <input type="text" v-model="searchQuery" placeholder="搜索案例..." />
      <button class="btn btn-outline" @click="loadCases">搜索</button>
    </div>
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <template v-else>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>地点</th>
              <th>类别</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="caseItem in filteredCases" :key="caseItem.id">
              <td>{{ caseItem.id }}</td>
              <td>{{ caseItem.name }}</td>
              <td>{{ caseItem.location }}</td>
              <td>{{ caseItem.categoryText }}</td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/cases/edit/${caseItem.id}`" class="btn btn-secondary">编辑</router-link>
                  <button class="btn btn-danger" @click="deleteCase(caseItem.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredCases.length === 0" class="loading">
          没有找到案例
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CaseList',
  data() {
    return {
      searchQuery: '',
      cases: [],
      loading: true,
      error: null,
      errorDetail: null,
      deleteError: null,
      deleteErrorDetail: null,
      successMessage: null
    }
  },
  computed: {
    filteredCases() {
      if (!this.searchQuery) {
        return this.cases
      }
      return this.cases.filter(caseItem => 
        caseItem.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        caseItem.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  async mounted() {
    await this.loadCases()
  },
  methods: {
    async loadCases() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/api/cases')
        this.cases = response.data
      } catch (error) {
        console.error('加载案例失败:', error)
        this.error = '加载案例失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      await this.loadCases()
    },
    async deleteCase(id) {
      if (confirm('确定要删除这个案例吗？')) {
        try {
          this.deleteError = null
          this.deleteErrorDetail = null
          await axios.delete(`/api/cases/${id}`)
          this.cases = this.cases.filter(caseItem => caseItem.id !== id)
          this.successMessage = '案例删除成功'
          window.scrollTo(0, 0)
          setTimeout(() => this.successMessage = null, 3000)
        } catch (error) {
          console.error('删除案例失败:', error)
          this.deleteError = '删除案例失败，请稍后重试'
          this.deleteErrorDetail = this.getErrorDetails(error)
        }
      }
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
