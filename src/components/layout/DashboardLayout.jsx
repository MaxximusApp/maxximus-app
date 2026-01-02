import React, { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Home,
  Target,
  CheckSquare,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const { theme, getThemeStyles } = useTheme()
  const styles = getThemeStyles()

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Trilhas', href: '/dashboard/trilhas', icon: Target },
    { name: 'Hábitos', href: '/dashboard/habitos', icon: CheckSquare },
    { name: 'Conteúdos', href: '/dashboard/conteudos', icon: BookOpen },
    { name: 'Progresso', href: '/dashboard/progresso', icon: TrendingUp },
    { name: 'Perfil', href: '/dashboard/perfil', icon: User },
  ]

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className={`min-h-screen ${styles.background} ${styles.text}`}>
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className={`flex-1 flex flex-col min-h-0 ${theme === 'masculino' ? 'bg-gray-800' : 'bg-white border-r'}`}>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className={`text-2xl font-bold ${theme === 'masculino' ? 'text-white' : 'text-gray-800'}`}>
                Maxximus
              </h1>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      ${isActive
                        ? theme === 'masculino'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : theme === 'masculino'
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className={`flex-shrink-0 flex border-t ${theme === 'masculino' ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            <div className="flex items-center">
              <div className="ml-3">
                <p className={`text-sm font-medium ${theme === 'masculino' ? 'text-white' : 'text-gray-700'}`}>
                  {profile?.nome || user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-2 rounded-lg hover:bg-red-500/10 text-red-500"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className={`${theme === 'masculino' ? 'bg-gray-800' : 'bg-white'} border-b ${styles.border}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${theme === 'masculino' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className={`text-xl font-bold ${theme === 'masculino' ? 'text-white' : 'text-gray-800'}`}>
              Maxximus
            </h1>
            <div className="w-10"></div>
          </div>
        </div>

        {sidebarOpen && (
          <div className={`fixed inset-0 z-40 ${theme === 'masculino' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex flex-col h-full">
              <div className="flex-1 py-5 overflow-y-auto">
                <nav className="px-4 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          group flex items-center px-3 py-2 text-base font-medium rounded-lg
                          ${isActive
                            ? theme === 'masculino'
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-100 text-gray-900'
                            : theme === 'masculino'
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className="mr-3 h-6 w-6" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
              <div className={`flex-shrink-0 border-t ${theme === 'masculino' ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${theme === 'masculino' ? 'text-white' : 'text-gray-700'}`}>
                      {profile?.nome || user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout