import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
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
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Entre na sua conta para continuar
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
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-blue-400 hover:text-blue-300">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Entrar
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}