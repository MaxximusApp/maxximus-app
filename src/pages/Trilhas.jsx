import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { Target, ChevronRight, CheckCircle } from 'lucide-react'

export default function Trilhas() {
  const { user } = useAuth()
  const [trails, setTrails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrails()
  }, [])

  const fetchTrails = async () => {
    setLoading(true)
    
    // Buscar trilhas do banco
    const { data: conteudos } = await supabase
      .from('conteudos_texto')
      .select('categoria')
      .distinct()
    
    if (conteudos) {
      const categories = [...new Set(conteudos.map(c => c.categoria))]
      
      // Buscar progresso do usuário
      const { data: progressos } = await supabase
        .from('trilhas_progresso')
        .select('*')
        .eq('user_id', user.id)
      
      const trailsData = categories.map(category => {
        const progress = progressos?.find(p => p.trilha_nome === category)
        return {
          id: category,
          nome: category,
          descricao: `Aprenda sobre ${category.toLowerCase()} com lições práticas`,
          modulos: 8,
          progresso: progress?.progresso_percentual || 0,
          concluida: progress?.concluida || false,
          cor: getTrailColor(category)
        }
      })
      
      setTrails(trailsData)
    }
    
    setLoading(false)
  }

  const getTrailColor = (category) => {
    const colors = {
      'Disciplina': 'from-blue-500 to-cyan-500',
      'Produtividade': 'from-purple-500 to-pink-500',
      'Hábitos': 'from-green-500 to-emerald-500',
      'Sono': 'from-indigo-500 to-blue-500',
      'Mental': 'from-yellow-500 to-orange-500',
      'default': 'from-gray-500 to-gray-700'
    }
    return colors[category] || colors.default
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Trilhas de Conhecimento</h1>
        <p className="text-gray-500 mt-2">
          Escolha uma trilha para começar sua jornada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trails.map(trail => (
          <div
            key={trail.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className={`h-2 bg-gradient-to-r ${trail.cor}`}></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${trail.cor} text-white mr-3`}>
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{trail.nome}</h3>
                    <p className="text-sm text-gray-500">{trail.modulos} módulos</p>
                  </div>
                </div>
                
                {trail.concluida && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{trail.descricao}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span className="font-bold">{trail.progresso}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${trail.cor}`}
                    style={{ width: `${trail.progresso}%` }}
                  ></div>
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                {trail.progresso > 0 ? 'Continuar' : 'Começar'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}