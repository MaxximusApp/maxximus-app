import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../services/supabase'
import { User, Mail, Target, TrendingUp, Calendar, Edit2 } from 'lucide-react'

export default function Perfil() {
  const { user, profile, updateProfile } = useAuth()
  const { theme, changeTheme } = useTheme()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [stats, setStats] = useState({
    habitsCompleted: 0,
    trailsCompleted: 0,
    daysStreak: 0,
    contentRead: 0
  })

  useEffect(() => {
    if (profile) {
      setFormData(profile)
      fetchStats()
    }
  }, [profile])

  const fetchStats = async () => {
    // Buscar estatísticas
    const today = new Date().toISOString().split('T')[0]
    
    // Hábitos concluídos
    const { count: habitsCount } = await supabase
      .from('habitos_diarios')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('concluido', true)

    // Trilhas concluídas
    const { count: trailsCount } = await supabase
      .from('trilhas_progresso')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('concluida', true)

    // Conteúdos lidos
    const { count: contentCount } = await supabase
      .from('acessos_conteudo')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('lido', true)

    setStats({
      habitsCompleted: habitsCount || 0,
      trailsCompleted: trailsCount || 0,
      daysStreak: 7, // Mock - implementar lógica real
      contentRead: contentCount || 0
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await updateProfile(formData)
    if (!error) {
      setEditMode(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const statsCards = [
    {
      title: 'Hábitos Concluídos',
      value: stats.habitsCompleted,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Trilhas Completas',
      value: stats.trailsCompleted,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Dias de Sequência',
      value: stats.daysStreak,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Conteúdos Lidos',
      value: stats.contentRead,
      icon: User,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-gray-500 mt-2">
            Gerencie suas informações e veja seu progresso
          </p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {editMode ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Formulário do Perfil */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile?.nome?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold">
              {profile?.nome || 'Usuário'}
            </h2>
            <p className="text-gray-500 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Idade</label>
              <input
                type="number"
                name="idade"
                value={formData.idade || ''}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Altura (cm)</label>
              <input
                type="number"
                name="altura"
                value={formData.altura || ''}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={formData.peso || ''}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sexo</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexo"
                    value="masculino"
                    checked={formData.sexo === 'masculino'}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="mr-2"
                  />
                  Masculino
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexo"
                    value="feminino"
                    checked={formData.sexo === 'feminino'}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="mr-2"
                  />
                  Feminino
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tema da Interface</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => changeTheme('masculino')}
                  className={`px-4 py-2 rounded-lg ${theme === 'masculino' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}
                  disabled={!editMode}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  onClick={() => changeTheme('feminino')}
                  className={`px-4 py-2 rounded-lg ${theme === 'feminino' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}
                  disabled={!editMode}
                >
                  Feminino
                </button>
              </div>
            </div>
          </div>

          {editMode && (
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}