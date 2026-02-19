import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/Login'
import Menu from './paginas/Menu' // Asumiendo que aquí mostrarás los packages
import './App.css'

function App() {
  // Estado global del usuario (Requisito: Estado global)
  const [usuario, setUsuario] = useState(null)

  // Persistencia básica: Al cargar, ver si hay sesión en el navegador
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('usuario_tsunami')
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada))
    }
  }, [])

  const handleLogin = (datos) => {
    // 'datos' viene del backend con: { user: {id, name, role}, token }
    setUsuario(datos.user)
    localStorage.setItem('usuario_tsunami', JSON.stringify(datos.user))
    localStorage.setItem('token_tsunami', datos.token)
  }

  const handleLogout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario_tsunami')
    localStorage.removeItem('token_tsunami')
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Navbar con Tailwind (Requisito: Diseño cuidado) */}
        {usuario && (
          <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Agencia Tsunami
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cliente</p>
                <p className="text-sm font-semibold text-slate-700">{usuario.name}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 border border-transparent hover:border-red-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </nav>
        )}

        <main>
          <Routes>
            {/* Requisito: Rutas protegidas */}
            <Route 
              path="/login" 
              element={!usuario ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            
            <Route 
              path="/" 
              element={usuario ? <Menu user={usuario} /> : <Navigate to="/login" />} 
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App