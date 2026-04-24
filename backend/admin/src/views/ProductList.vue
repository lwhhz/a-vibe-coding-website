<template>
  <div class="product-list">
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
      <router-link to="/products/create" class="btn btn-primary">添加产品</router-link>
    </div>
    
    <div class="search-box">
      <input type="text" v-model="searchQuery" placeholder="搜索产品..." />
      <button class="btn btn-outline" @click="loadProducts">搜索</button>
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
              <th>座位数</th>
              <th>价格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.seats }}座</td>
              <td>¥{{ product.price }}</td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/products/edit/${product.id}`" class="btn btn-secondary">编辑</router-link>
                  <button class="btn btn-danger" @click="deleteProduct(product.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredProducts.length === 0" class="loading">
          没有找到产品
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductList',
  data() {
    return {
      searchQuery: '',
      products: [],
      loading: true,
      error: null,
      errorDetail: null,
      deleteError: null,
      deleteErrorDetail: null,
      successMessage: null
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products
      }
      return this.products.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/api/products')
        this.products = response.data
      } catch (error) {
        console.error('加载产品失败:', error)
        this.error = '加载产品失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      await this.loadProducts()
    },
    async deleteProduct(id) {
      if (confirm('确定要删除这个产品吗？')) {
        try {
          this.deleteError = null
          this.deleteErrorDetail = null
          await axios.delete(`/api/products/${id}`)
          this.products = this.products.filter(product => product.id !== id)
          this.successMessage = '产品删除成功'
          window.scrollTo(0, 0)
          setTimeout(() => this.successMessage = null, 3000)
        } catch (error) {
          console.error('删除产品失败:', error)
          this.deleteError = '删除产品失败，请稍后重试'
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