<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const user = computed(() => auth.state.user)
const role = computed(() => auth.role.value)
const roleLabel = computed(() => ({ USER: '普通用户', AGENT: '客服坐席', ADMIN: '管理员' }[role.value ?? 'USER']))
const menuItems = computed(() => {
  const items = [{ path: '/tickets/mine', label: '我的工单', icon: '▤' }, { path: '/tickets/create', label: '创建工单', icon: '+' }]
  if (role.value === 'AGENT' || role.value === 'ADMIN') items.unshift({ path: '/tickets', label: '全部工单', icon: '▦' })
  return items
})
const pageContext = computed(() => {
  if (route.name === 'ticket-create') return '创建一张新的客户工单'
  if (route.name === 'ticket-detail') return '查看工单与 AI 辅助处理'
  return role.value === 'USER' ? '跟进你提交的服务请求' : '统一处理与跟进客户服务请求'
})
function logout() { auth.logout(); router.replace('/login') }
</script>

<template>
  <el-container class="app-shell">
    <aside class="app-sidebar">
      <div class="brand">
        <div class="brand-mark">AI</div>
        <h1>AI Ticket Console</h1>
        <p>智能工单管理与 AI 辅助处理</p>
      </div>
      <nav class="nav">
        <div class="nav-section">工作台</div>
        <RouterLink v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-link">
          <span class="nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span>
        </RouterLink>
        <div class="side-note">Java 业务后端负责认证、授权、工单与数据一致性。AI 只输出建议，不直接修改工单。</div>
      </nav>
    </aside>
    <el-container class="app-main">
      <header class="topbar">
        <span class="topbar-context">{{ pageContext }}</span>
        <div class="topbar-user">
          <div class="user-copy"><strong>{{ user?.displayName || user?.username }}</strong><span>{{ user?.username }} · {{ roleLabel }}</span></div>
          <el-tag size="small" effect="plain" type="info">{{ role }}</el-tag>
          <el-button text type="primary" @click="logout">退出登录</el-button>
        </div>
      </header>
      <main class="page-content"><RouterView /></main>
    </el-container>
  </el-container>
</template>
