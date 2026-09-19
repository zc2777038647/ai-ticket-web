export type Role = 'USER' | 'AGENT' | 'ADMIN'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface ApiResponse<T> { code: number; message: string; data: T | null }
export interface UserResponse { id: number; username: string; displayName: string; role: Role }
export interface LoginResponse { accessToken: string; tokenType: string; expiresIn: number; user: UserResponse }
export interface CurrentUserResponse { id: number; username: string; role: Role }
export interface SessionUser { id: number; username: string; displayName: string; role: Role }
export interface TicketResponse { id: number; title: string; description: string; creatorName: string; priority: TicketPriority; status: TicketStatus }
export interface PageResponse<T> { records: T[]; total: number; pages: number; current: number; size: number }
export interface TicketAssignmentResponse { ticketId: number; assigneeUserId: number; assigneeUsername: string; assigneeDisplayName: string }
export interface AiAnalysisResponse { category: string; suggestedPriority: TicketPriority; reason: string; confidence: number }
export interface AiReplyDraftResponse { draft: string; tone: string }
export interface AiSourceResponse { source: string; snippet: string }
export interface AiAgentResponse { answer: string; sources: AiSourceResponse[]; toolCalls: number }
