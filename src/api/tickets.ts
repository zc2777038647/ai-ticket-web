import { http, unwrap } from './http'
import type { ApiResponse, PageResponse, TicketAssignmentResponse, TicketPriority, TicketResponse, TicketStatus } from '../types/api'
export interface TicketPageParams { page: number; size: number; status?: TicketStatus; priority?: TicketPriority; creatorName?: string; keyword?: string }
export interface CreateTicketPayload { title: string; description: string; creatorName: string; priority: TicketPriority }
export async function createTicket(payload: CreateTicketPayload, idempotencyKey: string): Promise<TicketResponse> { return unwrap(await http.post<ApiResponse<TicketResponse>>('/api/tickets', payload, { headers: { 'Idempotency-Key': idempotencyKey } })) }
export async function getTicket(id: number): Promise<TicketResponse> { return unwrap(await http.get<ApiResponse<TicketResponse>>(`/api/tickets/${id}`)) }
export async function listTickets(params: TicketPageParams): Promise<PageResponse<TicketResponse>> { return unwrap(await http.get<ApiResponse<PageResponse<TicketResponse>>>('/api/tickets', { params })) }
export async function listMyTickets(params: TicketPageParams): Promise<PageResponse<TicketResponse>> { return unwrap(await http.get<ApiResponse<PageResponse<TicketResponse>>>('/api/tickets/mine', { params })) }
export async function updateTicketStatus(id: number, status: TicketStatus): Promise<TicketResponse> { return unwrap(await http.patch<ApiResponse<TicketResponse>>(`/api/tickets/${id}/status`, { status })) }
export async function assignTicket(id: number, assigneeUserId: number): Promise<TicketAssignmentResponse> { return unwrap(await http.patch<ApiResponse<TicketAssignmentResponse>>(`/api/tickets/${id}/assignee`, { assigneeUserId })) }
