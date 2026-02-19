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
// --- NUEVO: IMPORTACIÓN DE LA PÁGINA DE ESTADÍSTICAS ---
import Estadisticas from './paginas/Estadisticas' 

function App() {
  // Estado global del usuario (Persistencia en localStorage)
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* El Header reacciona al rol del usuario para mostrar el botón de Admin */}
      <Header usuario={usuarioLogueado} onLogout={handleLogout} />

      <main className="flex-grow">
        {(() => {
          switch (true) {
            case route === '#paises' || route === '#/paises':
              // Se pasa el usuario para poder realizar la reserva en la tabla bookings
              return <Paises user={usuarioLogueado} />
            
            case route.startsWith('#noticias') || route.startsWith('#/noticias'):
              return <Noticias usuarioLogueado={usuarioLogueado} />

            // --- NUEVA RUTA: ESTADÍSTICAS (PROTEGIDA) ---
            case route === '#estadisticas' || route === '#/estadisticas':
              // Validación de seguridad: Solo admins pueden entrar
              if (usuarioLogueado?.role === 'admin') {
                return <Estadisticas />
              } else {
                return (
                  <div className="flex flex-col items-center justify-center p-20">
                    <h2 className="text-2xl font-bold text-red-600">🚫 Acceso Restringido</h2>
                    <p className="text-slate-600">Esta sección solo es accesible para administradores.</p>
                    <a href="#inicio" className="mt-4 text-blue-500 underline">Volver al inicio</a>
                  </div>
                )
              }
            
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