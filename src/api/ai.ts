import { http, unwrap } from './http'
import type { AiAgentResponse, AiAnalysisResponse, AiReplyDraftResponse, ApiResponse } from '../types/api'
export async function analyzeTicket(id: number): Promise<AiAnalysisResponse> { return unwrap(await http.post<ApiResponse<AiAnalysisResponse>>(`/api/tickets/${id}/ai-analysis`)) }
export async function createReplyDraft(id: number): Promise<AiReplyDraftResponse> { return unwrap(await http.post<ApiResponse<AiReplyDraftResponse>>(`/api/tickets/${id}/ai-reply-draft`)) }
export async function runAgent(id: number, query: string): Promise<AiAgentResponse> { return unwrap(await http.post<ApiResponse<AiAgentResponse>>(`/api/tickets/${id}/ai-agent`, { query })) }
