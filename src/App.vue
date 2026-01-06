<template>
  <div id="app" :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <!-- Header -->
      <header class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-3xl font-bold">Maxximus App</h1>
          <div class="flex gap-4">
            <button 
              @click="toggleTheme"
              class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              {{ isDark ? '☀️ Claro' : '🌙 Escuro' }}
            </button>
            <button 
              v-if="!isAuthenticated"
              @click="showLogin = true"
              class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Entrar
            </button>
            <button 
              v-else
              @click="handleLogout"
              class="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto p-6">
        <!-- Login Form -->
        <div v-if="showLogin && !isAuthenticated" class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-6">
          <h2 class="text-2xl font-bold mb-4">Bem-vindo!</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Email:</label>
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Senha:</label>
              <input
                v-model="password"
                type="password"
                placeholder="********"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 dark:bg-gray-700"
              />
            </div>
            <button
              @click="handleLogin"
              class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Entrar
            </button>
          </div>
        </div>

        <!-- Dashboard -->
        <div v-if="isAuthenticated" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 class="text-xl font-bold mb-2">📊 Dashboard</h3>
            <p>Seu painel principal</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 class="text-xl font-bold mb-2">✅ Hábitos</h3>
            <p>Gerencie seus hábitos</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 class="text-xl font-bold mb-2">📈 Progresso</h3>
            <p>Acompanhe sua evolução</p>
          </div>
        </div>

        <!-- Welcome Message -->
        <div v-if="!isAuthenticated && !showLogin" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <h2 class="text-3xl font-bold mb-4">🎉 App Funcionando!</h2>
          <p class="text-lg mb-4">Seu Maxximus App está rodando perfeitamente!</p>
          <button
            @click="showLogin = true"
            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Começar Agora
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from './composables/useAuth'

const isDark = ref(true)
const showLogin = ref(false)
const email = ref('')
const password = ref('')

const { isAuthenticated, login, logout } = useAuth()

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleLogin = () => {
  login(email.value, password.value)
  showLogin.value = false
  email.value = ''
  password.value = ''
}

const handleLogout = () => {
  logout()
  showLogin.value = false
}
</script>