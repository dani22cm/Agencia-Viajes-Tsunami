import { useState, useEffect } from 'react'
import Login from './paginas/Login'
import Header from './paginas/Header'
import Footer from './paginas/Footer'
import Bloque1 from './componentes/bloque1'
import Bloque2 from './componentes/Bloque2' 
import Bloque3 from './componentes/Bloque3'
import Paises from './paginas/Paises'
import Noticias from './paginas/Noticias'
import Register from './paginas/Register'

// Importante: Tailwind gestionará casi todo, pero mantenemos App.css para ajustes globales
import './App.css'

function App() {
  // Estado global del usuario (Requisito: Persistencia y estado real)
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const saved = localStorage.getItem('usuario_tsunami')
    return saved ? JSON.parse(saved) : null
  })

  const [route, setRoute] = useState(window.location.hash || '#inicio')

  // Manejo de navegación por Hash
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#inicio')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Guardar sesión cuando cambia el usuario
  useEffect(() => {
    if (usuarioLogueado) {
      localStorage.setItem('usuario_tsunami', JSON.stringify(usuarioLogueado))
    } else {
      localStorage.removeItem('usuario_tsunami')
      localStorage.removeItem('token_tsunami')
    }
  }, [usuarioLogueado])

  const handleLogin = (datosServidor) => {
    // datosServidor viene del backend: { user: {id, name, role}, token }
    setUsuarioLogueado(datosServidor.user)
    localStorage.setItem('token_tsunami', datosServidor.token)
    window.location.hash = '#inicio'
  }

  const handleLogout = () => {
    setUsuarioLogueado(null)
    window.location.hash = '#inicio'
  }

  // --- Lógica de Renderizado de Rutas ---

  // Páginas de acceso sin Header/Footer
  if (route === '#login' || route === '#/login') {
    return <Login onLogin={handleLogin} backgroundImage="/images/fondos/1456.jpg" />
  }

  if (route === '#register' || route === '#/register') {
    return <Register onRegister={handleLogin} backgroundImage="/images/fondos/1460.jpg" />
  }

  // Estructura común para el resto de la App
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Requisito: El Header debe reaccionar al estado (mostrar login o cerrar sesión) */}
      <Header usuario={usuarioLogueado} onLogout={handleLogout} />

      <main className="flex-grow">
        {(() => {
          switch (true) {
            case route === '#paises' || route === '#/paises':
              // Pasamos el usuario a Paises para que pueda ejecutar el PROCEDURE de compra
              return <Paises user={usuarioLogueado} />
            
            case route.startsWith('#noticias') || route.startsWith('#/noticias'):
              return <Noticias usuarioLogueado={usuarioLogueado} />
            
            case route === '#inicio' || route === '':
            default:
              return (
                <div className="animate-fadeIn">
                  <Bloque1 usuario={usuarioLogueado} />
                  <Bloque2 />
                  <Bloque3 />
                </div>
              )
          }
        })()}
      </main>

      <Footer />
    </div>
  )
}

export default App