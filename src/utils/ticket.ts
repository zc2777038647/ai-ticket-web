import type { TicketStatus } from '../types/api'
export function nextStatuses(status: TicketStatus): TicketStatus[] { switch (status) { case 'OPEN': return ['IN_PROGRESS']; case 'IN_PROGRESS': return ['RESOLVED']; case 'RESOLVED': return ['CLOSED']; case 'CLOSED': return [] } }
export function statusLabel(status: string): string { return ({ OPEN: '待处理', IN_PROGRESS: '处理中', RESOLVED: '已解决', CLOSED: '已关闭' } as Record<string, string>)[status] ?? status }
export function priorityLabel(priority: string): string { return ({ LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' } as Record<string, string>)[priority] ?? priority }
export function statusTagType(status: string): 'info' | 'warning' | 'success' | 'danger' { return ({ OPEN: 'info', IN_PROGRESS: 'warning', RESOLVED: 'success', CLOSED: 'danger' } as Record<string, 'info' | 'warning' | 'success' | 'danger'>)[status] ?? 'info' }
export function priorityTagType(priority: string): 'info' | 'warning' | 'danger' { return ({ LOW: 'info', MEDIUM: 'warning', HIGH: 'danger', URGENT: 'danger' } as Record<string, 'info' | 'warning' | 'danger'>)[priority] ?? 'info' }
export function formatDate(value: string | undefined): string { if (!value) return '后端响应未提供'; return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) }
