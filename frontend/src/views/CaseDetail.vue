<template>
  <div class="case-detail">
    <div class="container">
      <router-link to="/cases" class="back-link">← 返回案例列表</router-link>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-message alert-box">
        <strong>加载失败</strong>
        <p>{{ error }}</p>
        <pre v-if="errorDetail">{{ errorDetail }}</pre>
        <button @click="retryLoad" class="alert-close">×</button>
      </div>
      
      <!-- 加载中 -->
      <div v-if="loading" class="text-center mt-30">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <template v-else-if="caseItem.id">
        <div class="case-hero">
          <img :src="caseItem.image" :alt="caseItem.name" class="case-hero-image" />
          <div class="case-hero-overlay"></div>
          <div class="case-hero-content">
            <span class="case-category-badge">{{ caseItem.categoryText }}</span>
            <h1>{{ caseItem.name }}</h1>
            <div class="case-meta">
              <span class="meta-item">📍 {{ caseItem.location }}</span>
              <span class="meta-item">📅 {{ formatDate(caseItem.date) }}</span>
              <span class="meta-item">🚗 {{ caseItem.products }}</span>
            </div>
          </div>
        </div>
        
        <div class="case-body">
          <div class="case-summary">
            <p>{{ caseItem.description }}</p>
          </div>
          
          <div class="case-content" v-if="caseItem.content" v-html="renderedContent"></div>
          
          <div class="case-no-content" v-else>
            <p>暂无详细内容</p>
          </div>
        </div>
        
        <div class="case-bottom-cta">
          <router-link to="/contact" class="cta-button">咨询类似方案</router-link>
          <router-link to="/cases" class="cta-button cta-outline">返回案例列表</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { marked } from 'marked'

export default {
  name: 'CaseDetail',
  data() {
    return {
      caseItem: {},
      loading: true,
      error: null,
      errorDetail: null
    }
  },
  computed: {
    renderedContent() {
      if (!this.caseItem.content) return ''
      return marked(this.caseItem.content)
    }
  },
  async mounted() {
    const caseId = this.$route.params.id
    if (caseId) {
      await this.loadCase(caseId)
    }
  },
  methods: {
    async loadCase(caseId) {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get(`/cases/${caseId}`)
        this.caseItem = response.data
      } catch (error) {
        console.error('加载案例详情失败:', error)
        this.error = '加载案例详情失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      const caseId = this.$route.params.id
      if (caseId) {
        await this.loadCase(caseId)
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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
.case-detail {
  padding: 60px 0;
  background: transparent;
}

.back-link {
  display: inline-block;
  margin-bottom: 30px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}

.back-link:hover {
  color: var(--secondary-color);
  box-shadow: var(--glow-primary);
}

.case-hero {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 25px;
  overflow: hidden;
  margin-bottom: 40px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.case-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.case-hero-content {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  color: white;
  z-index: 1;
}

.case-hero-content h1 {
  font-size: 36px;
  margin: 10px 0 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.case-category-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.case-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 14px;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.case-body {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 25px;
  padding: 40px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  margin-bottom: 40px;
}

.case-summary {
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(0, 168, 120, 0.2);
}

.case-summary p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--light-text);
}

.case-content {
  line-height: 1.8;
  color: var(--text-color);
}

.case-content :deep(h1) {
  font-size: 28px;
  margin: 30px 0 15px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
}

.case-content :deep(h2) {
  font-size: 24px;
  margin: 25px 0 12px;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.case-content :deep(h3) {
  font-size: 20px;
  margin: 20px 0 10px;
  color: var(--text-color);
}

.case-content :deep(p) {
  margin: 12px 0;
  font-size: 16px;
}

.case-content :deep(ul),
.case-content :deep(ol) {
  margin: 12px 0;
  padding-left: 25px;
}

.case-content :deep(li) {
  margin: 8px 0;
  line-height: 1.6;
}

.case-content :deep(blockquote) {
  margin: 15px 0;
  padding: 15px 20px;
  border-left: 4px solid var(--primary-color);
  background: rgba(0, 168, 120, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 0 12px 12px 0;
}

.case-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

.case-content :deep(pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 15px 0;
}

.case-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.case-content :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 15px 0;
}

.case-content :deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 15px 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 168, 120, 0.05);
}

.case-content :deep(th),
.case-content :deep(td) {
  border: 1px solid rgba(0, 168, 120, 0.2);
  padding: 10px 15px;
  text-align: left;
}

.case-content :deep(th) {
  background: rgba(0, 168, 120, 0.1);
  font-weight: 600;
}

.case-content :deep(a) {
  color: var(--primary-color);
  text-decoration: underline;
}

.case-no-content {
  text-align: center;
  padding: 40px;
  color: var(--light-text);
}

.case-bottom-cta {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cta-outline {
  background: rgba(0, 168, 120, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.cta-outline:hover {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--glow-primary);
}

@media (max-width: 768px) {
  .case-hero {
    height: 280px;
  }
  
  .case-hero-content h1 {
    font-size: 24px;
  }
  
  .case-body {
    padding: 20px;
  }
  
  .case-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .case-bottom-cta {
    flex-direction: column;
    align-items: center;
  }
}
</style>