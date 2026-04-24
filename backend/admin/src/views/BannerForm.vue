<template>
  <div class="banner-form">
    <!-- 成功提示 -->
    <div v-if="successMessage" class="success-message alert-box">
      <strong>成功</strong>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = null" class="alert-close">×</button>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message alert-box">
      <strong>{{ isEdit ? '更新失败' : '创建失败' }}</strong>
      <p>{{ error }}</p>
      <pre v-if="errorDetail">{{ errorDetail }}</pre>
      <button @click="error = null" class="alert-close">×</button>
    </div>

    <div class="card">
      <h2>{{ isEdit ? '编辑轮播图' : '添加轮播图' }}</h2>
      
      <!-- 加载中 -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="title">标题 <span class="required">*</span></label>
          <input 
            type="text" 
            id="title" 
            v-model="form.title" 
            required 
            placeholder="请输入轮播图标题"
          />
        </div>

        <div class="form-group">
          <label for="subtitle">副标题</label>
          <input 
            type="text" 
            id="subtitle" 
            v-model="form.subtitle" 
            placeholder="请输入副标题（可选）"
          />
        </div>

        <div class="form-group">
          <label for="image">图片地址 <span class="required">*</span></label>
          <input 
            type="url" 
            id="image" 
            v-model="form.image" 
            required 
            placeholder="请输入图片URL地址"
          />
          <small style="color: #666; margin-top: 5px; display: block;">建议尺寸：1920x500 像素</small>
          <div v-if="form.image" class="image-preview" style="margin-top: 10px;">
            <img :src="form.image" alt="预览" style="max-width: 100%; max-height: 200px; border-radius: 4px;" />
          </div>
        </div>

        <div class="form-group">
          <label for="link">链接地址</label>
          <input 
            type="url" 
            id="link" 
            v-model="form.link" 
            placeholder="请输入点击跳转链接（可选）"
          />
        </div>

        <div class="form-group">
          <label for="sortOrder">排序顺序</label>
          <input 
            type="number" 
            id="sortOrder" 
            v-model.number="form.sortOrder" 
            min="0"
            placeholder="数字越小越靠前，默认为0"
          />
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px;">
            <input 
              type="checkbox" 
              v-model="form.isActive" 
              style="width: auto;"
            />
            <span>启用此轮播图</span>
          </label>
        </div>

        <div class="form-actions">
          <router-link to="/banners" class="btn btn-secondary">取消</router-link>
          <button type="submit" class="btn btn-primary">{{ isEdit ? '更新' : '创建' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BannerForm',
  data() {
    return {
      form: {
        title: '',
        subtitle: '',
        image: '',
        link: '',
        sortOrder: 0,
        isActive: true
      },
      loading: false,
      error: null,
      errorDetail: null,
      successMessage: null
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id
    }
  },
  async mounted() {
    if (this.isEdit) {
      await this.loadBanner()
    }
  },
  methods: {
    async loadBanner() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get(`/api/banners/${this.$route.params.id}`)
        this.form = {
          title: response.data.title,
          subtitle: response.data.subtitle || '',
          image: response.data.image,
          link: response.data.link || '',
          sortOrder: response.data.sortOrder || 0,
          isActive: response.data.isActive
        }
      } catch (error) {
        console.error('加载轮播图失败:', error)
        this.error = '加载轮播图失败'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      try {
        this.error = null
        this.errorDetail = null
        
        if (this.isEdit) {
          await axios.put(`/api/banners/${this.$route.params.id}`, this.form)
          this.successMessage = '更新成功'
        } else {
          await axios.post('/api/banners', this.form)
          this.successMessage = '创建成功'
        }
        window.scrollTo(0, 0)
        
        setTimeout(() => {
          this.$router.push('/banners')
        }, 1500)
      } catch (error) {
        console.error('保存轮播图失败:', error)
        this.error = this.isEdit ? '更新轮播图失败' : '创建轮播图失败'
        this.errorDetail = this.getErrorDetails(error)
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
.form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.required {
  color: var(--error-color);
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}
</style>