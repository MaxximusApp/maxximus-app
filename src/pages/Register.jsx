import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      return setError('As senhas não coincidem')
    }
    
    if (formData.password.length < 8) {
      return setError('A senha deve ter no mínimo 8 caracteres')
    }
    
    setLoading(true)

    const { error } = await signUp(formData.email, formData.password, {
      nome: formData.nome
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Criar nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Preencha os dados para se cadastrar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Nome completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
            
            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              required
            />
            
            <Input
              label="Confirmar senha"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Criar conta
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Entre aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}