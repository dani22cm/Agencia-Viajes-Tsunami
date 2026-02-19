function Header({ usuario, onLogout, cartCount }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO DE TSUNAMI */}
        <a href="#inicio" className="flex items-center gap-2 group">
          <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-2xl font-black tracking-tighter text-slate-900">TSUNAMI<span className="text-blue-600">VIAJES</span></span>
        </a>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="hidden md:flex gap-8 font-bold text-sm text-slate-600">
          <a href="#inicio" className="hover:text-blue-600 transition-colors">INICIO</a>
          <a href="#paises" className="hover:text-blue-600 transition-colors">PAÍSES</a>
          <a href="#noticias" className="hover:text-blue-600 transition-colors">NOTICIAS</a>
          
          {usuario?.role === 'admin' && (
            <a href="#estadisticas" className="text-red-500 hover:text-red-700 transition-colors">ESTADÍSTICAS</a>
          )}
        </nav>

        {/* ACCIONES DEL USUARIO Y CARRITO */}
        <div className="flex items-center gap-6">
          
          <a 
            href="#carrito" 
            className="relative text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            title="Ver mi carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </a>

          {usuario ? (
             <div className="flex items-center gap-4 border-l-2 border-slate-200 pl-6">
                <div className="flex flex-col text-right">
                  {/* AQUÍ ESTÁ EL ENLACE AL PERFIL */}
                  <a href="#perfil" className="font-bold text-slate-800 text-sm hover:text-blue-600 hover:underline">
                    {usuario.name}
                  </a>
                  <button 
                    onClick={onLogout} 
                    className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    CERRAR SESIÓN
                  </button>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black border-2 border-blue-200">
                  {usuario.name.charAt(0).toUpperCase()}
                </div>
             </div>
          ) : (
             <div className="flex gap-4 border-l-2 border-slate-200 pl-6">
                <a href="#login" className="font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100">
                  INICIAR SESIÓN
                </a>
             </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header