import { useState } from 'react'

function Header({ usuario, onLogout }) {
  const [isHovered, setIsHovered] = useState(false)

  // Lista base de navegación
  const navItems = ['inicio', 'paises', 'noticias']
  
  // Si el usuario es admin, añadimos estadísticas a la lista
  if (usuario?.role === 'admin') {
    navItems.push('estadisticas')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo y Nombre con Animación */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.hash = '#inicio'}>
            <div className="relative">
              <img 
                src="https://i.pinimg.com/originals/ab/f1/80/abf180964abb052f91529589b8433ce6.png" 
                alt="Avión" 
                className="w-10 h-10 object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" 
              />
              <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              TSUNAMI<span className="text-slate-800">VIAJES</span>
            </h1>
          </div>

          {/* Navegación Central - DINÁMICA */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                className={`text-sm font-bold uppercase tracking-widest transition-colors relative group ${
                  item === 'estadisticas' ? 'text-indigo-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all group-hover:w-full ${
                  item === 'estadisticas' ? 'bg-indigo-600 w-0' : 'bg-blue-600 w-0'
                }`}></span>
              </a>
            ))}
          </nav>

          {/* Grupo Derecha: Usuario / Auth */}
          <div className="flex items-center gap-4">
            {usuario ? (
              <div className="flex items-center gap-3 bg-slate-100 p-1.5 pr-4 rounded-full border border-slate-200 hover:bg-white transition-all shadow-sm">
                <img 
                  src="https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg" 
                  alt="Perfil" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800 leading-none">
                    {usuario.name || usuario}
                  </span>
                  <button 
                    onClick={onLogout} 
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 text-left uppercase tracking-tighter mt-0.5 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a 
                  href="#login" 
                  className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </a>
                <a 
                  href="#register" 
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Registro
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header