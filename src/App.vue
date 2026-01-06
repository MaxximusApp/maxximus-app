<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <span class="logo-emoji">🎉</span>
        </div>
        <h1 class="title">Maximus App</h1>
      </div>

      <div class="card">
        <div class="status-badge">
          <span class="pulse"></span>
          <span class="status-text">Online</span>
        </div>
        
        <h2 class="card-title">
          <span class="emoji">🎊</span>
          App Funcionando!
        </h2>
        
        <p class="card-description">
          Seu Maxximus App está rodando perfeitamente!
        </p>

        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <span>Rápido</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔒</span>
            <span>Seguro</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📱</span>
            <span>Responsivo</span>
          </div>
        </div>

        <button class="btn-primary" @click="comecarAgora">
          Começar Agora
          <span class="btn-arrow">→</span>
        </button>

        <div class="mode-toggle" @click="toggleTheme">
          <span>{{ isDark ? '☀️' : '🌙' }}</span>
        </div>
      </div>

      <footer class="footer">
        <p>Desenvolvido com ❤️</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const comecarAgora = () => {
  alert('Vamos começar! 🚀')
  // Adicione sua lógica aqui
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark-mode')
}

onMounted(() => {
  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker registrado!', reg))
      .catch(err => console.log('❌ Erro ao registrar SW:', err))
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: background 0.3s ease;
}

body.dark-mode #app {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.container {
  max-width: 480px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  display: inline-block;
  margin-bottom: 15px;
}

.logo-emoji {
  font-size: 4rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card {
  background: white;
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

body.dark-mode .card {
  background: #2d3748;
  color: white;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #d4edda;
  color: #155724;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
}

body.dark-mode .status-badge {
  background: #2f855a;
  color: #c6f6d5;
}

.pulse {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
  }
}

.card-title {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

body.dark-mode .card-title {
  color: white;
}

.emoji {
  font-size: 1.5rem;
}

.card-description {
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

body.dark-mode .card-description {
  color: #cbd5e0;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

body.dark-mode .features {
  border-color: #4a5568;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #4a5568;
}

body.dark-mode .feature-item {
  color: #cbd5e0;
}

.feature-icon {
  font-size: 1.5rem;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(5px);
}

.mode-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mode-toggle:hover {
  transform: rotate(20deg) scale(1.2);
}

.footer {
  text-align: center;
  margin-top: 30px;
  color: white;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsividade */
@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .card {
    padding: 30px 20px;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .features {
    flex-direction: column;
    gap: 15px;
  }
}
</style>