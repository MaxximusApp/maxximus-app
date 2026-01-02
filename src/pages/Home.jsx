import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../services/supabase'
import { Target, CheckCircle, TrendingUp, Calendar } from 'lucide-react'

export default function Home() {
  const { user, profile } = useAuth()
  const { theme, getThemeStyles } = useTheme()
  const styles = getThemeStyles()
  
  const [stats, setStats] = useState({
    habitsToday: 0,
    totalHabits: 5,
    progress: 25,
    activeTrail: 'Disciplina'
  })
  
  const [habits, setHabits] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Buscar hábitos de hoje
    const today = new Date().toISOString().split('T')[0]
    const { data: habitsData } = await supabase
      .from('habitos_diarios')
      .select('*')
      .eq('user_id', user.id)
      .eq('data', today)
    
    if (habitsData) {
      setHabits(habitsData)
      const completed = habitsData.filter(h => h.concluido).length
      setStats(prev => ({
        ...prev,
        habitsToday: completed,
        totalHabits: habitsData.length || 5
      }))
    }
  }

  const toggleHabit = async (habitId, completed) => {
    const { error } = await supabase
      .from('habitos_diarios')
      .update({ concluido: !completed })
      .eq('id', habitId)
    
    if (!error) {
      fetchDashboardData()
    }
  }

  const statsCards = [
    {
      title: 'Progresso Total',
      value: `${stats.progress}%`,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Hábitos Hoje',
      value: `${stats.habitsToday}/${stats.totalHabits}`,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Trilha Ativa',
      value: stats.activeTrail,
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Dia da Semana',
      value: new Date().toLocaleDateString('pt-BR', { weekday: 'long' }),
      icon: Calendar,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {profile?.nome?.split(' ')[0] || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Aqui está seu progresso de hoje
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`rounded-xl p-6 text-white bg-gradient-to-br ${stat.color} shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className="h-10 w-10 opacity-80" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Hábitos de Hoje */}
      <div className={`rounded-xl ${styles.card} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Hábitos de Hoje</h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
        
        <div className="space-y-3">
          {habits.length > 0 ? habits.map(habit => (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                theme === 'masculino' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => toggleHabit(habit.id, habit.concluido)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    habit.concluido
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400'
                  }`}
                >
                  {habit.concluido && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={habit.concluido ? 'line-through opacity-70' : ''}>
                  {habit.habito}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                habit.concluido
                  ? 'bg-green-500/20 text-green-600'
                  : 'bg-yellow-500/20 text-yellow-600'
              }`}>
                {habit.categoria}
              </span>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum hábito cadastrado para hoje.</p>
              <p className="text-sm mt-2">Vá para a seção Hábitos para adicionar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Trilhas em Destaque */}
      <div className={`rounded-xl ${styles.card} p-6`}>
        <h2 className="text-xl font-bold mb-4">Trilhas Recomendadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Disciplina e Foco', progress: 40, desc: 'Domine sua mente e produtividade' },
            { name: 'Hábitos Saudáveis', progress: 25, desc: 'Transforme sua rotina diária' },
            { name: 'Melhoria do Sono', progress: 10, desc: 'Qualidade de sono premium' },
            { name: 'Combate à Procrastinação', progress: 0, desc: 'Comece agora e não depois' }
          ].map((trail, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                theme === 'masculino' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{trail.name}</h3>
                <span className="text-sm font-bold">{trail.progress}%</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{trail.desc}</p>
              <div className={`h-2 rounded-full ${theme === 'masculino' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${trail.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}