<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register } from '../api/auth'
import { getErrorMessage } from '../api/http'

const router = useRouter(); const formRef = ref<FormInstance>(); const loading = ref(false); const errorMessage = ref('')
const form = reactive({ username: '', password: '', displayName: '' })
const rules: FormRules = { username: [{ required: true, min: 4, max: 64, message: '用户名长度需为 4～64 个字符', trigger: 'blur' }], password: [{ required: true, min: 8, max: 64, message: '密码长度需为 8～64 个字符', trigger: 'blur' }], displayName: [{ required: true, max: 64, message: '请输入展示名称', trigger: 'blur' }] }
async function submit() { errorMessage.value = ''; const valid = await formRef.value?.validate().catch(() => false); if (!valid) return; loading.value = true; try { await register(form); ElMessage.success('注册成功，请登录'); await router.replace('/login') } catch (error) { errorMessage.value = getErrorMessage(error, '注册失败，请稍后重试') } finally { loading.value = false } }
</script>

<template>
  <div class="login-page">
    <section class="login-intro"><div class="brand-mark">AI</div><h1>从一张工单开始，建立清晰的服务闭环。</h1><p class="lead">注册入口只创建普通 USER。客服与管理员角色由后端管理，不在浏览器端自助提升权限。</p><div class="feature-list"><span>✓ 创建并跟进工单</span><span>✓ 所有权隔离</span><span>✓ 后端安全边界</span><span>✓ 人在回路</span></div></section>
    <section class="login-card-wrap"><div class="login-card"><div class="brand-chip">创建普通用户</div><h2>注册工作台</h2><p class="sub">注册成功后即可创建自己的工单并查看处理进度。</p><el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon style="margin-bottom: 18px" /><el-form ref="formRef" :model="form" :rules="rules" label-position="top"><el-form-item label="用户名" prop="username"><el-input v-model="form.username" placeholder="4～64 个字符" size="large" /></el-form-item><el-form-item label="展示名称" prop="displayName"><el-input v-model="form.displayName" placeholder="例如：小杨" size="large" /></el-form-item><el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password placeholder="至少 8 个字符" size="large" /></el-form-item><el-button type="primary" size="large" :loading="loading" style="width: 100%; margin-top: 7px" @click="submit">创建 USER 账号</el-button></el-form><div class="login-footer">已有账号？ <RouterLink to="/login">返回登录</RouterLink></div></div></section>
  </div>
</template>
