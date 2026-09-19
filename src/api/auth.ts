import { http, unwrap } from './http'
import type { ApiResponse, CurrentUserResponse, LoginResponse, UserResponse } from '../types/api'
export interface RegisterPayload { username: string; password: string; displayName: string }
export interface LoginPayload { username: string; password: string }
export async function login(payload: LoginPayload): Promise<LoginResponse> { return unwrap(await http.post<ApiResponse<LoginResponse>>('/api/auth/login', payload)) }
export async function register(payload: RegisterPayload): Promise<UserResponse> { return unwrap(await http.post<ApiResponse<UserResponse>>('/api/auth/register', payload)) }
export async function currentUser(): Promise<CurrentUserResponse> { return unwrap(await http.get<ApiResponse<CurrentUserResponse>>('/api/auth/me')) }
