<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createTicket, type CreateTicketPayload } from '../api/tickets'
import { getErrorMessage } from '../api/http'
import { auth } from '../stores/auth'
import type { TicketPriority } from '../types/api'
import { priorityLabel } from '../utils/ticket'

const router = useRouter(); const formRef = ref<FormInstance>(); const loading = ref(false); const errorMessage = ref('')
const form = reactive<CreateTicketPayload>({ title: '', description: '', creatorName: auth.state.user?.displayName || auth.state.user?.username || '', priority: 'MEDIUM' })
const priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const rules: FormRules = { title: [{ required: true, message: '请输入工单标题', trigger: 'blur' }, { max: 120, message: '标题不能超过 120 个字符', trigger: 'blur' }], description: [{ required: true, message: '请描述问题', trigger: 'blur' }, { max: 2000, message: '描述不能超过 2000 个字符', trigger: 'blur' }], creatorName: [{ required: true, message: '请输入创建人名称', trigger: 'blur' }, { max: 64, message: '创建人名称不能超过 64 个字符', trigger: 'blur' }], priority: [{ required: true, message: '请选择优先级', trigger: 'change' }] }
let lastFingerprint = ''; let idempotencyKey: string | null = null
const priorityHint = computed(() => ({ LOW: '一般咨询或低影响问题', MEDIUM: '需要正常跟进的服务请求', HIGH: '影响主要流程，需要尽快处理', URGENT: '严重影响使用，需要优先响应' }[form.priority]))
async function submit() { errorMessage.value = ''; const valid = await formRef.value?.validate().catch(() => false); if (!valid) return; const fingerprint = JSON.stringify(form); if (fingerprint !== lastFingerprint || !idempotencyKey) { lastFingerprint = fingerprint; idempotencyKey = crypto.randomUUID() }; loading.value = true; try { const result = await createTicket({ ...form }, idempotencyKey); ElMessage.success('工单创建成功'); idempotencyKey = null; await router.push(`/tickets/${result.id}`) } catch (error) { errorMessage.value = getErrorMessage(error, '工单创建失败，可安全重试'); } finally { loading.value = false } }
</script>

<template>
  <div class="page-heading"><div><h2>创建工单</h2><p>提交后由 Java 业务服务校验、持久化，并使用 Idempotency-Key 防止同一逻辑请求重复创建。</p></div></div>
  <div class="panel form-panel"><div class="panel-body"><el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon style="margin-bottom: 22px" /><el-form ref="formRef" :model="form" :rules="rules" label-position="top"><el-form-item label="工单标题" prop="title"><el-input v-model="form.title" maxlength="120" show-word-limit placeholder="一句话概括需要解决的问题" size="large" /></el-form-item><el-form-item label="问题描述" prop="description"><el-input v-model="form.description" type="textarea" :rows="7" maxlength="2000" show-word-limit placeholder="补充现象、影响范围和已经尝试过的操作" /></el-form-item><div class="detail-grid"><el-form-item label="创建人名称" prop="creatorName"><el-input v-model="form.creatorName" maxlength="64" /></el-form-item><el-form-item label="优先级" prop="priority"><el-select v-model="form.priority" style="width: 100%"><el-option v-for="item in priorities" :key="item" :label="priorityLabel(item) + '（' + item + '）'" :value="item" /></el-select><div class="ticket-subtitle" style="margin-top: 6px">{{ priorityHint }}</div></el-form-item></div><div class="form-note">创建接口需要真实的 <strong>Idempotency-Key</strong>。本页面会为一次逻辑提交生成 UUID；网络失败后重试会复用同一个 key，修改内容后才会生成新的 key。</div><div style="display:flex; justify-content:flex-end; margin-top: 24px; gap: 10px"><el-button @click="router.back()">取消</el-button><el-button type="primary" :loading="loading" @click="submit">提交工单</el-button></div></el-form></div></div>
</template>
