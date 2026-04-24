<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <h2 class="admin-logo">咨询管理</h2>
      <nav class="admin-nav">
        <router-link to="/" class="nav-item">
          <span class="nav-icon">📋</span>
          <span class="nav-text">咨询列表</span>
        </router-link>
      </nav>
    </div>
    
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #00a878;
  --secondary-color: #008f68;
  --background-color: #f5f7fa;
  --white: #ffffff;
  --text-color: #333333;
  --light-text: #666666;
  --border-color: #e0e0e0;
  --accent-color: #4a90e2;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.admin-container {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background-color: var(--primary-color);
  color: white;
  padding: 20px 0;
}

.admin-logo {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.admin-nav {
  padding: 0 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  text-decoration: none;
  color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.nav-icon {
  margin-right: 15px;
  font-size: 18px;
}

.admin-content {
  flex: 1;
  padding: 30px;
  background-color: var(--background-color);
}

.admin-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.admin-header h1 {
  color: var(--primary-color);
  font-size: 24px;
}

.card {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: var(--accent-color);
  color: white;
}

.btn-secondary:hover {
  background-color: #357abd;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.table th {
  background-color: var(--background-color);
  font-weight: 600;
  color: var(--text-color);
}

.table tr:hover {
  background-color: rgba(0, 168, 120, 0.05);
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

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 168, 120, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--light-text);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--light-text);
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #f39c12;
  color: white;
}

.status-processed {
  background-color: var(--primary-color);
  color: white;
}

.status-completed {
  background-color: #27ae60;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* 错误提示 */
.error-message {
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  color: #dc3545;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
}

.error-message strong {
  display: block;
  margin-bottom: 5px;
}

.error-message pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  overflow-x: auto;
  font-size: 12px;
  white-space: pre-wrap;
}

/* 成功提示 */
.success-message {
  background-color: #f0fff4;
  border: 1px solid #b7f0c3;
  color: #27ae60;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
}

.success-message strong {
  display: block;
  margin-bottom: 5px;
}

/* 加载旋转图标 */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 可关闭的提示框 */
.alert-box {
  position: relative;
  padding-right: 40px;
}

.alert-close {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    padding: 10px 0;
  }
  
  .admin-logo {
    margin-bottom: 20px;
  }
  
  .admin-nav {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding: 0 10px;
  }
  
  .nav-item {
    white-space: nowrap;
    margin-bottom: 0;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .table {
    font-size: 14px;
  }
  
  .table th,
  .table td {
    padding: 8px 10px;
  }
}
</style>