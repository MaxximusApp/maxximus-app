import { ref, computed } from 'vue'

const user = ref(null)

export function useAuth() {
  const isAuthenticated = computed(() => user.value !== null)

  const login = (email, password) => {
    user.value = { email, name: 'Usuário' }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, isAuthenticated, login, logout }
}