<template>
  <div id="app" :class="isDark ? 'dark' : ''">
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <!-- Header -->
      <header class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-3xl font-bold">Maxximus App</h1>
          <button 
            @click="toggleTheme"
            class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            {{ isDark ? '☀️ Claro' : '🌙 Escuro' }}
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto p-6">
        <div v-if="!isLoggedIn" class="max-w-md mx-auto mt-10">
          <!-- Login Form -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 class="text-2xl font-bold mb-6 text-center">Bem-vindo!</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Email</label>
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="seu@email.com"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 dark:bg-gray-700"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Senha</label>
                <input 
                  v-model="password"
                  type="password" 
                  placeholder="••••••••"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 dark:bg-gray-700"
                />
              </div>

              <button 
                @click="login"
                class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard -->
        <div v-else>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold">Dashboard</h2>
            <button 
              @click="logout"
              class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sair
            </button>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h3 class="text-lg font-semibold mb-2">Total de Usuários</h3>
              <p class="text-4xl font-bold">1,234</p>
            </div>

            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <h3 class="text-lg font-semibold mb-2">Vendas Hoje</h3>
              <p class="text-4xl font-bold">R$ 5,678</p>
            </div>

            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h3 class="text-lg font-semibold mb-2">Novos Clientes</h3>
              <p class="text-4xl font-bold">89</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">Atividade Recente</h3>
            <div class="space-y-3">
              <div v-for="activity in activities" :key="activity.id" 
                   class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p class="font-semibold">{{ activity.user }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.action }}</p>
                </div>
                <span class="text-sm text-gray-500">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-100 dark:bg-gray-800 mt-12 py-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          © 2026 Maxximus App - Todos os direitos reservados
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isDark: false,
      isLoggedIn: false,
      email: '',
      password: '',
      activities: [
        { id: 1, user: 'João Silva', action: 'Fez uma compra', time: '5 min atrás' },
        { id: 2, user: 'Maria Santos', action: 'Criou uma conta', time: '15 min atrás' },
        { id: 3, user: 'Pedro Oliveira', action: 'Atualizou perfil', time: '1 hora atrás' },
        { id: 4, user: 'Ana Costa', action: 'Enviou mensagem', time: '2 horas atrás' },
      ]
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },
    login() {
      if (this.email && this.password) {
        this.isLoggedIn = true
        localStorage.setItem('isLoggedIn', 'true')
      } else {
        alert('Preencha email e senha!')
      }
    },
    logout() {
      this.isLoggedIn = false
      this.email = ''
      this.password = ''
      localStorage.removeItem('isLoggedIn')
    }
  },
  mounted() {
    // Carregar preferências salvas
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      this.isDark = true
    }
    
    const savedLogin = localStorage.getItem('isLoggedIn')
    if (savedLogin === 'true') {
      this.isLoggedIn = true
    }
  }
}
</script>