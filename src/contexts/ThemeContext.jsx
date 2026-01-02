import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('masculino')

  useEffect(() => {
    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('app-theme') || 'masculino'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeName) => {
    // Remover classes antigas
    document.body.classList.remove('masculino', 'feminino')
    // Adicionar nova classe
    document.body.classList.add(themeName)
    // Salvar no localStorage
    localStorage.setItem('app-theme', themeName)
  }

  const changeTheme = (newTheme) => {
    if (newTheme === 'masculino' || newTheme === 'feminino') {
      setTheme(newTheme)
      applyTheme(newTheme)
    }
  }

  const getThemeStyles = () => {
    return {
      background: theme === 'masculino' ? 'bg-gray-900' : 'bg-gray-50',
      text: theme === 'masculino' ? 'text-gray-100' : 'text-gray-800',
      card: theme === 'masculino' ? 'card-masculino' : 'card-feminino',
      primary: theme === 'masculino' ? 'bg-red-600' : 'bg-pink-500',
      primaryHover: theme === 'masculino' ? 'hover:bg-red-700' : 'hover:bg-pink-600',
      secondary: theme === 'masculino' ? 'bg-purple-600' : 'bg-purple-500',
      border: theme === 'masculino' ? 'border-gray-700' : 'border-gray-200',
    }
  }

  const value = {
    theme,
    changeTheme,
    getThemeStyles,
    isMasculino: theme === 'masculino',
    isFeminino: theme === 'feminino',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}