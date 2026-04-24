<template>
  <div class="case-form">
    <!-- 成功提示 -->
    <div v-if="successMessage" class="success-message alert-box">
      <strong>成功</strong>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = null" class="alert-close">×</button>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="loadError" class="error-message alert-box">
      <strong>加载失败</strong>
      <p>{{ loadError }}</p>
      <pre v-if="loadErrorDetail">{{ loadErrorDetail }}</pre>
      <button @click="retryLoad" class="alert-close">×</button>
    </div>
    
    <!-- 保存错误提示 -->
    <div v-if="saveError" class="error-message alert-box">
      <strong>保存失败</strong>
      <p>{{ saveError }}</p>
      <pre v-if="saveErrorDetail">{{ saveErrorDetail }}</pre>
      <button @click="saveError = null" class="alert-close">×</button>
    </div>
    
    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? '编辑案例' : '添加案例' }}</h1>
      <router-link to="/cases" class="btn btn-outline">返回列表</router-link>
    </div>
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <template v-else>
      <div class="card">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">案例名称</label>
            <input type="text" id="name" v-model="formData.name" required />
          </div>
          
          <div class="form-group">
            <label for="description">案例摘要</label>
            <textarea id="description" v-model="formData.description" required rows="3" placeholder="简要描述案例，将显示在案例列表页"></textarea>
            <small style="color: #666; margin-top: 5px; display: block;">
              此内容将显示在官网案例列表页的卡片中
            </small>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="flex: 1; margin-right: 10px;">
              <label for="location">地点</label>
              <input type="text" id="location" v-model="formData.location" required />
            </div>
            
            <div class="form-group" style="flex: 1; margin-left: 10px;">
              <label for="date">日期</label>
              <input type="date" id="date" v-model="formData.date" required />
            </div>
          </div>
          
          <div class="form-group">
            <label for="products">产品</label>
            <input type="text" id="products" v-model="formData.products" required />
          </div>
          
          <div class="form-group">
            <label for="category">类别</label>
            <input 
              type="text" 
              id="category" 
              v-model="formData.categoryText" 
              required 
              placeholder="请输入案例类别，如：景区、园区、酒店、商场等"
            />
            <small style="color: #666; margin-top: 5px; display: block;">
              自定义输入类别名称，将用于官网筛选
            </small>
          </div>
          
          <div class="form-group">
            <label for="image">图片URL</label>
            <input type="text" id="image" v-model="formData.image" required />
          </div>
          
          <div class="form-group">
            <label for="content">详细内容 <span style="font-weight: normal; color: #666;">(支持Markdown格式)</span></label>
            <div class="content-editor">
              <div class="editor-toolbar">
                <button type="button" class="toolbar-btn" @click="insertMarkdown('**', '**')" title="加粗">B</button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('*', '*')" title="斜体">I</button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('## ', '')" title="标题">H</button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('- ', '')" title="列表">•</button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('> ', '')" title="引用">❝</button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('[链接文字](url)', '')" title="链接">🔗</button>
                <button type="button" class="toolbar-btn" @click="insertMarkdown('![图片描述](url)', '')" title="图片">🖼️</button>
                <button type="button" class="toolbar-btn" @click="togglePreview" title="预览">{{ showPreview ? '编辑' : '预览' }}</button>
              </div>
              <textarea 
                v-if="!showPreview"
                id="content" 
                v-model="formData.content" 
                rows="15" 
                placeholder="请输入案例详细内容，支持Markdown语法&#10;&#10;示例：&#10;## 项目背景&#10;描述项目背景...&#10;&#10;## 解决方案&#10;- 方案一&#10;- 方案二&#10;&#10;## 客户评价&#10;> 客户的评价内容"
              ></textarea>
              <div v-else class="content-preview" v-html="previewContent"></div>
            </div>
            <small style="color: #666; margin-top: 5px; display: block;">
              此内容将显示在官网案例详情页，支持Markdown格式
            </small>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <router-link to="/cases" class="btn btn-outline">取消</router-link>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { marked } from 'marked'

export default {
  name: 'CaseForm',
  data() {
    return {
      isEdit: false,
      showPreview: false,
      formData: {
        name: '',
        description: '',
        location: '',
        date: '',
        products: '',
        categoryText: '',
        image: '',
        content: ''
      },
      loading: false,
      successMessage: null,
      loadError: null,
      loadErrorDetail: null,
      saveError: null,
      saveErrorDetail: null
    }
  },
  computed: {
    previewContent() {
      if (!this.formData.content) return '<p style="color: #999;">暂无内容，请在编辑模式输入Markdown内容</p>'
      return marked(this.formData.content)
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.loadCase(id)
    }
  },
  methods: {
    togglePreview() {
      this.showPreview = !this.showPreview
    },
    insertMarkdown(prefix, suffix) {
      const textarea = document.getElementById('content')
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = this.formData.content || ''
      const selectedText = text.substring(start, end)
      const before = text.substring(0, start)
      const after = text.substring(end)
      this.formData.content = before + prefix + selectedText + suffix + after
      this.$nextTick(() => {
        textarea.focus()
        textarea.selectionStart = start + prefix.length
        textarea.selectionEnd = start + prefix.length + selectedText.length
      })
    },
    async loadCase(id) {
      this.loading = true
      try {
        this.loadError = null
        this.loadErrorDetail = null
        const response = await axios.get(`/api/cases/${id}`)
        this.formData = response.data
      } catch (error) {
        this.loadError = '加载案例失败，请稍后重试'
        this.loadErrorDetail = this.getErrorDetails(error)
        console.error('加载案例失败:', error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      const id = this.$route.params.id
      if (id) {
        await this.loadCase(id)
      }
    },
    async submitForm() {
      this.loading = true
      this.saveError = null
      this.saveErrorDetail = null
      this.successMessage = null
      try {
        if (this.isEdit) {
          await axios.put(`/api/cases/${this.$route.params.id}`, this.formData)
          this.successMessage = '案例更新成功'
        } else {
          await axios.post('/api/cases', this.formData)
          this.successMessage = '案例添加成功'
        }
        window.scrollTo(0, 0)
        setTimeout(() => {
          this.$router.push('/cases')
        }, 1500)
      } catch (error) {
        this.saveError = '保存案例失败，请稍后重试'
        this.saveErrorDetail = this.getErrorDetails(error)
        console.error('保存案例失败:', error)
      } finally {
        this.loading = false
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

.form-row {
  display: flex;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.content-editor {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  gap: 2px;
  padding: 8px;
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.toolbar-btn {
  padding: 5px 12px;
  border: 1px solid var(--border-color);
  background-color: var(--white);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.content-editor textarea {
  width: 100%;
  padding: 15px;
  border: none;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 300px;
}

.content-editor textarea:focus {
  outline: none;
}

.content-preview {
  padding: 20px;
  min-height: 300px;
  line-height: 1.8;
  background-color: white;
}

.content-preview :deep(h1),
.content-preview :deep(h2),
.content-preview :deep(h3) {
  margin: 15px 0 10px;
  color: var(--primary-color);
}

.content-preview :deep(p) {
  margin: 10px 0;
}

.content-preview :deep(ul),
.content-preview :deep(ol) {
  margin: 10px 0;
  padding-left: 25px;
}

.content-preview :deep(blockquote) {
  margin: 10px 0;
  padding: 10px 15px;
  border-left: 4px solid var(--primary-color);
  background-color: #f8f9fa;
}

.content-preview :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.content-preview :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}
</style>
