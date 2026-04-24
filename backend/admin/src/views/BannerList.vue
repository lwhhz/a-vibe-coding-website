<template>
  <div class="banner-list">
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
      <router-link to="/banners/create" class="btn btn-primary">添加轮播图</router-link>
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
              <th>预览</th>
              <th>标题</th>
              <th>副标题</th>
              <th>排序</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="banner in banners" :key="banner.id">
              <td>{{ banner.id }}</td>
              <td>
                <img :src="banner.image" alt="banner.title" style="width: 120px; height: 60px; object-fit: cover; border-radius: 4px;" />
              </td>
              <td>{{ banner.title }}</td>
              <td>{{ banner.subtitle || '-' }}</td>
              <td>{{ banner.sortOrder }}</td>
              <td>
                <span :class="['status-badge', banner.isActive ? 'active' : 'inactive']">
                  {{ banner.isActive ? '启用' : '禁用' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/banners/edit/${banner.id}`" class="btn btn-secondary">编辑</router-link>
                  <button class="btn btn-danger" @click="deleteBanner(banner.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="banners.length === 0" class="loading">
          暂无轮播图
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BannerList',
  data() {
    return {
      banners: [],
      loading: true,
      error: null,
      errorDetail: null,
      deleteError: null,
      deleteErrorDetail: null,
      successMessage: null
    }
  },
  async mounted() {
    await this.loadBanners()
  },
  methods: {
    async loadBanners() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/api/banners')
        this.banners = response.data
      } catch (error) {
        console.error('加载轮播图失败:', error)
        this.error = '加载轮播图失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      this.error = null
      this.errorDetail = null
      await this.loadBanners()
    },
    async deleteBanner(id) {
      if (!confirm('确定要删除这个轮播图吗？')) {
        return
      }
      
      try {
        this.deleteError = null
        this.deleteErrorDetail = null
        await axios.delete(`/api/banners/${id}`)
        this.successMessage = '删除成功'
        window.scrollTo(0, 0)
        await this.loadBanners()
        setTimeout(() => {
          this.successMessage = null
        }, 3000)
      } catch (error) {
        console.error('删除轮播图失败:', error)
        this.deleteError = '删除轮播图失败，请稍后重试'
        this.deleteErrorDetail = this.getErrorDetails(error)
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
  justify-content: flex-end;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}
</style>