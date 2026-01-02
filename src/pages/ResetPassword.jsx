import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Recuperar senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Digite seu email para receber o link de recuperação
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Enviar link de recuperação
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Voltar para o login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}