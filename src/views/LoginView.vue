<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getErrorMessage } from '../api/http'
import { auth } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const errorMessage = ref('')
const form = reactive({ username: '', password: '' })
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function submit() {
  errorMessage.value = ''
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await auth.login(form)
    ElMessage.success('登录成功')
    await router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/tickets/mine')
  } catch (error) { errorMessage.value = getErrorMessage(error, '登录失败，请检查用户名和密码') } finally { loading.value = false }
}
</script>

<template>
  <div class="login-page">
    <section class="login-intro">
      <div class="brand-mark">AI</div>
      <h1>把工单处理，变成可解释的协作流程。</h1>
      <p class="lead">AI Ticket Console 连接可信 Java 业务边界与可控 AI 能力，让客服在同一张工单里完成判断、跟进和人工审核。</p>
      <div class="feature-list"><span>✓ JWT + RBAC</span><span>✓ Redis 幂等</span><span>✓ AI 分析建议</span><span>✓ 人工审核草稿</span></div>
    </section>
    <section class="login-card-wrap">
      <div class="login-card">
        <div class="brand-chip">AI Ticket Console</div>
        <h2>欢迎回来</h2>
        <p class="sub">登录你的工单工作台，继续处理待跟进的服务请求。</p>
        <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon style="margin-bottom: 18px" />
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
          <el-form-item label="用户名" prop="username"><el-input v-model="form.username" autocomplete="username" placeholder="输入用户名" size="large" /></el-form-item>
          <el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password autocomplete="current-password" placeholder="输入密码" size="large" @keyup.enter="submit" /></el-form-item>
          <el-button type="primary" size="large" :loading="loading" style="width: 100%; margin-top: 7px" @click="submit">登录工作台</el-button>
        </el-form>
        <div class="login-footer">还没有账号？ <RouterLink to="/register">注册普通 USER</RouterLink></div>
      </div>
    </section>
  </div>
</template>
