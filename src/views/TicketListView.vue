<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getErrorMessage } from '../api/http'
import { listMyTickets, listTickets, type TicketPageParams } from '../api/tickets'
import type { PageResponse, TicketPriority, TicketResponse, TicketStatus } from '../types/api'
import { priorityLabel, priorityTagType, statusLabel, statusTagType } from '../utils/ticket'

const route = useRoute(); const router = useRouter()
const mine = computed(() => route.name === 'my-tickets')
const title = computed(() => mine.value ? '我的工单' : '全部工单')
const subtitle = computed(() => mine.value ? '只展示当前登录用户创建的工单，数据范围由 Java Service 做对象级约束。' : '按状态、优先级和关键词筛选全部工单，供客服与管理员统一跟进。')
const loading = ref(false); const errorMessage = ref('')
const pageData = ref<PageResponse<TicketResponse>>({ records: [], total: 0, pages: 0, current: 1, size: 10 })
const query = reactive<{ page: number; size: number; status?: TicketStatus; priority?: TicketPriority; creatorName: string; keyword: string }>({ page: 1, size: 10, creatorName: '', keyword: '' })
const statusOptions: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']; const priorityOptions: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
function cleanQuery(): TicketPageParams { return { page: query.page, size: query.size, status: query.status, priority: query.priority, creatorName: query.creatorName || undefined, keyword: query.keyword || undefined } }
async function load() { loading.value = true; errorMessage.value = ''; try { pageData.value = mine.value ? await listMyTickets(cleanQuery()) : await listTickets(cleanQuery()) } catch (error) { errorMessage.value = getErrorMessage(error, '工单列表加载失败') } finally { loading.value = false } }
function resetFilters() { query.page = 1; query.status = undefined; query.priority = undefined; query.creatorName = ''; query.keyword = ''; void load() }
function goPage(page: number) { query.page = page; void load() }
function openDetail(id: number) { void router.push(`/tickets/${id}`) }
watch(mine, () => { query.page = 1; void load() }); onMounted(() => { void load() })
</script>

<template>
  <div class="page-heading"><div><h2>{{ title }}</h2><p>{{ subtitle }}</p></div><div class="heading-actions"><el-button v-if="mine" type="primary" @click="router.push('/tickets/create')">＋ 创建工单</el-button><el-button :loading="loading" @click="load">刷新</el-button></div></div>
  <div class="panel table-panel">
    <div v-if="!mine" class="filter-bar"><el-input v-model="query.keyword" clearable placeholder="搜索标题或描述" @keyup.enter="query.page = 1; load()" /><el-input v-model="query.creatorName" clearable placeholder="创建人" @keyup.enter="query.page = 1; load()" /><el-select v-model="query.status" clearable placeholder="状态" @change="query.page = 1; load()"><el-option v-for="item in statusOptions" :key="item" :label="statusLabel(item)" :value="item" /></el-select><el-select v-model="query.priority" clearable placeholder="优先级" @change="query.page = 1; load()"><el-option v-for="item in priorityOptions" :key="item" :label="priorityLabel(item)" :value="item" /></el-select><el-button @click="resetFilters">重置</el-button></div>
    <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon style="margin: 15px 20px 0" />
    <el-table v-loading="loading" :data="pageData.records" style="width: 100%" row-key="id">
      <el-table-column label="工单" min-width="330"><template #default="scope"><div class="ticket-title" @click="openDetail(scope.row.id)">#{{ scope.row.id }} · {{ scope.row.title }}</div><div class="ticket-subtitle">创建人：{{ scope.row.creatorName }}</div></template></el-table-column>
      <el-table-column label="状态" width="130"><template #default="scope"><el-tag size="small" :type="statusTagType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag></template></el-table-column>
      <el-table-column label="优先级" width="120"><template #default="scope"><el-tag size="small" effect="plain" :type="priorityTagType(scope.row.priority)">{{ priorityLabel(scope.row.priority) }}</el-tag></template></el-table-column>
      <el-table-column label="处理人" width="150"><template #default><span class="not-provided">响应未提供</span></template></el-table-column>
      <el-table-column label="创建时间" width="150"><template #default><span class="not-provided">响应未提供</span></template></el-table-column>
      <el-table-column label="操作" width="100" fixed="right"><template #default="scope"><el-button link type="primary" @click="openDetail(scope.row.id)">查看详情</el-button></template></el-table-column>
      <template #empty><div class="empty-wrap"><el-empty description="暂无工单" /></div></template>
    </el-table>
    <div class="pagination-row"><span class="pagination-count">共 {{ pageData.total }} 条 · 第 {{ pageData.current }} / {{ Math.max(pageData.pages, 1) }} 页</span><el-pagination background layout="prev, pager, next" :current-page="query.page" :page-size="query.size" :total="pageData.total" @current-change="goPage" /></div>
  </div>
</template>
