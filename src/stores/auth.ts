import { computed, reactive } from 'vue'
import { currentUser, login as loginRequest } from '../api/auth'
import { TOKEN_KEY } from '../api/http'
import type { LoginPayload } from '../api/auth'
import type { Role, SessionUser } from '../types/api'
const USER_KEY = 'ai-ticket-user'
function readUser(): SessionUser | null { const raw = localStorage.getItem(USER_KEY); if (!raw) return null; try { return JSON.parse(raw) as SessionUser } catch { localStorage.removeItem(USER_KEY); return null } }
const state = reactive<{ token: string | null; user: SessionUser | null }>({ token: localStorage.getItem(TOKEN_KEY), user: readUser() })
function setSession(token: string, user: SessionUser) { state.token = token; state.user = user; localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)) }
async function login(payload: LoginPayload) { const result = await loginRequest(payload); localStorage.setItem(TOKEN_KEY, result.accessToken); state.token = result.accessToken; const user = await currentUser(); setSession(result.accessToken, { id: user.id, username: user.username, role: user.role, displayName: result.user.displayName }); return state.user }
function logout() { state.token = null; state.user = null; localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) }
export const auth = { state, isAuthenticated: computed(() => Boolean(state.token && state.user)), role: computed<Role | null>(() => state.user?.role ?? null), login, logout, setSession }
