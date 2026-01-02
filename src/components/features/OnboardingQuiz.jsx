import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { supabase } from '../../services/supabase'
import Button from '../common/Button'

const OnboardingQuiz = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    objetivo_principal: '',
    trabalha: '',
    turno: '',
    estudando: '',
    tem_filhos: '',
    medicamentos: '',
    doencas_limitacoes: '',
    nivel_estresse: 5,
    qualidade_sono: '',
    faz_academia: '',
    pratica_esportes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const { updateProfile } = useAuth()
  const { changeTheme } = useTheme()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Se mudou o sexo, atualizar tema
    if (name === 'sexo' && value) {
      changeTheme(value)
    }
  }

  const nextStep = () => {
    if (step < 6) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Salvar perfil
      const { error } = await updateProfile({
        ...formData,
        modo_interface: formData.sexo
      })
      
      if (error) throw error
      
      // Salvar respostas do quiz
      const quizAnswers = Object.entries(formData).map(([pergunta, resposta]) => ({
        pergunta,
        resposta: resposta.toString()
      }))
      
      const { error: quizError } = await supabase
        .from('quiz_respostas')
        .insert(quizAnswers.map(answer => ({
          user_id: (await supabase.auth.getUser()).data.user.id,
          ...answer
        })))
      
      if (quizError) throw quizError
      
      navigate('/dashboard/home')
      
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: 'Informações Básicas',
      fields: [
        { name: 'nome', label: 'Nome completo', type: 'text', required: true },
        { name: 'idade', label: 'Idade', type: 'number', min: 16, max: 100, required: true },
        { 
          name: 'sexo', 
          label: 'Sexo', 
          type: 'radio', 
          options: [
            { value: 'masculino', label: 'Masculino' },
            { value: 'feminino', label: 'Feminino' }
          ],
          required: true 
        }
      ]
    },
    {
      title: 'Dados Físicos',
      fields: [
        { name: 'altura', label: 'Altura (cm)', type: 'number', min: 100, max: 250 },
        { name: 'peso', label: 'Peso (kg)', type: 'number', min: 30, max: 300 },
        { 
          name: 'objetivo_principal', 
          label: 'Objetivo principal', 
          type: 'select',
          options: [
            { value: 'ganhar_massa', label: 'Ganhar massa muscular' },
            { value: 'perder_peso', label: 'Perder peso' },
            { value: 'manter_saude', label: 'Manter saúde' },
            { value: 'melhorar_disciplina', label: 'Melhorar disciplina' },
            { value: 'outros', label: 'Outros' }
          ],
          required: true 
        }
      ]
    },
    {
      title: 'Rotina',
      fields: [
        { 
          name: 'trabalha', 
          label: 'Você trabalha?', 
          type: 'radio',
          options: [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' }
          ] 
        },
        { 
          name: 'turno', 
          label: 'Turno de trabalho', 
          type: 'select',
          options: [
            { value: 'manha', label: 'Manhã' },
            { value: 'tarde', label: 'Tarde' },
            { value: 'noite', label: 'Noite' },
            { value: 'rotativo', label: 'Rotativo' },
            { value: 'nao_aplica', label: 'Não se aplica' }
          ] 
        },
        { 
          name: 'estudando', 
          label: 'Você está estudando?', 
          type: 'radio',
          options: [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
            { value: 'ambos', label: 'Ambos (trabalha e estuda)' }
          ] 
        },
        { 
          name: 'tem_filhos', 
          label: 'Você tem filhos?', 
          type: 'radio',
          options: [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' }
          ] 
        }
      ]
    },
    {
      title: 'Saúde',
      fields: [
        { name: 'medicamentos', label: 'Medicamentos regulares', type: 'textarea', placeholder: 'Quais? (ou "Não tomo")' },
        { name: 'doencas_limitacoes', label: 'Doenças ou limitações', type: 'textarea', placeholder: 'Descrever (ou "Não possuo")' },
        { 
          name: 'nivel_estresse', 
          label: 'Nível de estresse (1-10)', 
          type: 'range', 
          min: 1, 
          max: 10 
        },
        { 
          name: 'qualidade_sono', 
          label: 'Qualidade do sono', 
          type: 'select',
          options: [
            { value: 'otima', label: 'Ótima' },
            { value: 'boa', label: 'Boa' },
            { value: 'regular', label: 'Regular' },
            { value: 'ruim', label: 'Ruim' },
            { value: 'pessima', label: 'Péssima' }
          ] 
        }
      ]
    },
    {
      title: 'Atividades Físicas',
      fields: [
        { 
          name: 'faz_academia', 
          label: 'Frequenta academia?', 
          type: 'radio',
          options: [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' }
          ] 
        },
        { name: 'pratica_esportes', label: 'Pratica esportes?', type: 'textarea', placeholder: 'Quais? (ou "Não pratico")' }
      ]
    }
  ]

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min={field.min}
                max={field.max}
                required={field.required}
              />
            )}
          </div>
        )
      
      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required={field.required}
            >
              <option value="">Selecione...</option>
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )
      
      case 'radio':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options.map(opt => (
                <label key={opt.value} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={formData[field.name] === opt.value}
                    onChange={handleChange}
                    className="mr-2"
                    required={field.required}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        )
      
      case 'range':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field.label}: {formData[field.name] || field.min}
            </label>
            <input
              type="range"
              name={field.name}
              min={field.min}
              max={field.max}
              value={formData[field.name] || field.min}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 (Baixo)</span>
              <span>10 (Alto)</span>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  const currentStep = steps[step - 1]

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Barra de progresso */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Conteúdo do passo atual */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">{currentStep.title}</h2>
        
        <form>
          {currentStep.fields.map(renderField)}
        </form>
      </div>

      {/* Botões de navegação */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={step === 1}
          variant="outline"
        >
          Voltar
        </Button>
        
        {step < steps.length ? (
          <Button onClick={nextStep}>
            Próximo
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Finalizar e Começar
          </Button>
        )}
      </div>
    </div>
  )
}

export default OnboardingQuiz