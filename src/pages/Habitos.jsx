import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { Plus, Check, Trash2, Calendar } from 'lucide-react'

export default function Habitos() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [category, setCategory] = useState('Saúde')
  const [loading, setLoading] = useState(false)

  const categories = ['Saúde', 'Produtividade', 'Relacionamentos', 'Finanças', 'Pessoal']

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('habitos_diarios')
      .select('*')
      .eq('user_id', user.id)
      .eq('data', today)
      .order('created_at', { ascending: true })
    
    if (data) setHabits(data)
  }

  const addHabit = async () => {
    if (!newHabit.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('habitos_diarios')
      .insert([{
        user_id: user.id,
        habito: newHabit.trim(),
        categoria: category,
        concluido: false,
        data: new Date().toISOString().split('T')[0]
      }])

    if (!error) {
      setNewHabit('')
      fetchHabits()
    }
    setLoading(false)
  }

  const toggleHabit = async (id, currentStatus) => {
    const { error } = await supabase
      .from('habitos_diarios')
      .update({ concluido: !currentStatus })
      .eq('id', id)

    if (!error) {
      fetchHabits()
    }
  }

  const deleteHabit = async (id) => {
    const { error } = await supabase
      .from('habitos_diarios')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchHabits()
    }
  }

  const predefinedHabits = [
    { habito: 'Acordar no horário planejado', categoria: 'Produtividade' },
    { habito: 'Fazer 30min de exercícios', categoria: 'Saúde' },
    { habito: 'Beber 2L de água', categoria: 'Saúde' },
    { habito: 'Ler por 20 minutos', categoria: 'Pessoal' },
    { habito: 'Meditar por 10 minutos', categoria: 'Saúde' },
    { habito: 'Dormir antes das 23h', categoria: 'Saúde' },
    { habito: 'Anotar 3 coisas boas do dia', categoria: 'Pessoal' },
  ]

  const addPredefinedHabit = async (habit) => {
    const { error } = await supabase
      .from('habitos_diarios')
      .insert([{
        user_id: user.id,
        habito: habit.habito,
        categoria: habit.categoria,
        concluido: false,
        data: new Date().toISOString().split('T')[0]
      }])

    if (!error) {
      fetchHabits()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hábitos Diários</h1>
        <p className="text-gray-500 mt-2">
          Construa sua rotina um hábito de cada vez
        </p>
      </div>

      {/* Adicionar novo hábito */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Adicionar Hábito</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Ex: Meditar por 10 minutos"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            onClick={addHabit}
            disabled={loading || !newHabit.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* Hábitos pré-definidos */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Hábitos Sugeridos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {predefinedHabits.map((habit, index) => (
            <button
              key={index}
              onClick={() => addPredefinedHabit(habit)}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div>
                <span className="font-medium">{habit.habito}</span>
                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {habit.categoria}
                </span>
              </div>
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Lista de hábitos do dia */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Hábitos de Hoje</h2>
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum hábito para hoje.</p>
            <p className="text-sm mt-2">Adicione hábitos usando o formulário acima.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleHabit(habit.id, habit.concluido)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      habit.concluido
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400'
                    }`}
                  >
                    {habit.concluido && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <div>
                    <span className={`font-medium ${habit.concluido ? 'line-through text-gray-400' : ''}`}>
                      {habit.habito}
                    </span>
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full mr-2">
                        {habit.categoria}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(habit.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Resumo */}
        {habits.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-600">Concluídos: </span>
                <span className="font-bold">
                  {habits.filter(h => h.concluido).length} de {habits.length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((habits.filter(h => h.concluido).length / habits.length) * 100)}% completo
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}