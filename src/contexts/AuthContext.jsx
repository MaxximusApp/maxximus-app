import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Verificar sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Ouvir mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error)
      } else {
        setProfile(data || null)
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('users_profile')
          .insert([{
            id: authData.user.id,
            email: email,
            nome: userData.nome || '',
            created_at: new Date().toISOString(),
          }])

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }

      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setProfile(null)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updatePassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('users_profile')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile: () => user && fetchUserProfile(user.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}