import { useState, useEffect } from 'react'

function Paises({ user, onAgregarCarrito }) {
  const [viajes, setViajes] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  // 1. NUEVOS ESTADOS PARA EL BUSCADOR Y ORDENAMIENTO
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('defecto')

  // Estados para el Modal de Vuelos (Lo mantenemos igual)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null)
  const [vuelos, setVuelos] = useState([])
  const [buscandoVuelos, setBuscandoVuelos] = useState(false)

  useEffect(() => {
    fetch('http://localhost:4000/api/paises')
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron obtener los destinos del servidor')
        return res.json()
      })
      .then(data => {
        setViajes(data)
        setCargando(false)
      })
      .catch(err => {
        setError(err.message)
        setCargando(false)
      })
  }, [])

  const abrirModalVuelos = async (destino) => {
    if (!user) {
      alert("⚠️ Debes iniciar sesión para configurar tu viaje.");
      return;
    }
    
    setDestinoSeleccionado(destino);
    setModalAbierto(true);
    setBuscandoVuelos(true);

    try {
      const respuesta = await fetch(`http://localhost:4000/api/vuelos/${destino.code}`);
      const datosVuelos = await respuesta.json();
      setVuelos(datosVuelos);
    } catch (err) {
      console.error("Error al obtener vuelos:", err);
    } finally {
      setBuscandoVuelos(false);
    }
  };

  const confirmarVuelo = (vueloElegido) => {
    const viajeConfigurado = {
      ...destinoSeleccionado,
      flight: vueloElegido,
      nombreVuelo: `Salida desde ${vueloElegido.origin} el ${new Date(vueloElegido.departure_date).toLocaleDateString()}`
    };
    
    onAgregarCarrito(viajeConfigurado);
    setModalAbierto(false);
  };

  // 2. LÓGICA MÁGICA DE FILTRADO Y ORDENAMIENTO EN TIEMPO REAL
  const viajesProcesados = viajes
    .filter(destino => 
      // Busca por nombre del país o por palabras en la descripción
      destino.name.toLowerCase().includes(busqueda.toLowerCase()) || 
      (destino.description && destino.description.toLowerCase().includes(busqueda.toLowerCase()))
    )
    .sort((a, b) => {
      // Ordena según lo que elija el usuario en el selector
      if (orden === 'precio_asc') return a.price - b.price;
      if (orden === 'precio_desc') return b.price - a.price;
      if (orden === 'nombre_az') return a.name.localeCompare(b.name);
      return 0; // 'defecto'
    });

  if (cargando) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fadeIn relative">
      
      <div className="mb-8">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-blue-600 pl-4">
          Explora el Mundo
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Encuentra tu próximo destino perfecto</p>
      </div>

      {error && (
        <div className="bg-red-50 border-red-200 border text-red-600 p-4 rounded-xl mb-8 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* 3. INTERFAZ DEL BUSCADOR Y FILTROS */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Input de Búsqueda */}
        <div className="relative w-full md:w-1/2 lg:w-2/3">
          <svg className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Busca por país, ciudad o temática (ej: 'Japón', 'Playa')..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-50 pl-14 pr-4 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-slate-700 font-bold transition-all placeholder:font-medium"
          />
        </div>

        {/* Selector de Orden */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <span className="text-slate-400 font-bold text-sm hidden lg:block">Ordenar por:</span>
          <select 
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="w-full md:w-auto bg-slate-50 border border-transparent py-4 pl-4 pr-12 rounded-2xl text-slate-700 font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer appearance-none transition-all"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
          >
            <option value="defecto">Recomendados</option>
            <option value="precio_asc">Precio: Más barato primero</option>
            <option value="precio_desc">Precio: Más caro primero</option>
            <option value="nombre_az">Nombre: A - Z</option>
          </select>
        </div>
      </div>

      {/* GRID DE PAÍSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {viajesProcesados.length > 0 ? (
          viajesProcesados.map((destino) => (
            <div key={destino.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-slate-100">
              <div className="relative h-64 overflow-hidden">
                <img src={destino.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={destino.name}/>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1 rounded-full font-black text-blue-600 shadow-lg">
                  {destino.price ? `Desde ${destino.price}€` : 'Consultar'} 
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-slate-800">{destino.name}</h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{destino.code}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{destino.description}</p>

                <button 
                  onClick={() => abrirModalVuelos(destino)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Configurar Viaje
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-6xl mb-4">🏜️</p>
            <p className="text-slate-800 font-black text-2xl">No hay resultados para "{busqueda}"</p>
            <p className="text-slate-500 font-medium mt-2">Prueba a buscar otro país o palabra clave.</p>
            <button 
              onClick={() => setBusqueda('')} 
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Ver todos los destinos
            </button>
          </div>
        )}
      </div>

      {/* --- MODAL DE SELECCIÓN DE VUELOS (Se mantiene igual) --- */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-black">Elige tu Vuelo</h3>
                <p className="text-blue-200 font-medium text-sm">Destino: {destinoSeleccionado?.name}</p>
              </div>
              <button onClick={() => setModalAbierto(false)} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50 flex-grow">
              {buscandoVuelos ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-500 font-bold">Buscando conexiones aéreas...</p>
                </div>
              ) : vuelos.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {vuelos.map(vuelo => (
                    <div key={vuelo.id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center hover:border-blue-400 transition-colors shadow-sm">
                      <div className="w-full sm:w-auto mb-4 sm:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-slate-900 text-white text-xs font-black px-2 py-1 rounded uppercase">Salida</span>
                          <p className="font-black text-slate-800 text-lg">{vuelo.origin}</p>
                        </div>
                        <p className="text-sm text-slate-500 font-medium flex flex-col gap-1">
                          <span>🛫 Ida: {new Date(vuelo.departure_date).toLocaleDateString()}</span>
                          <span>🛬 Vuelta: {new Date(vuelo.return_date).toLocaleDateString()}</span>
                        </p>
                      </div>
                      
                      <div className="text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 flex flex-row sm:flex-col justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase">Suplemento vuelo</p>
                          <p className="text-2xl font-black text-blue-600">+{vuelo.price}€</p>
                        </div>
                        <button 
                          onClick={() => confirmarVuelo(vuelo)}
                          className="mt-0 sm:mt-3 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-blue-600 transition-colors shadow-md"
                        >
                          Elegir Vuelo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-5xl mb-4">🛬</p>
                  <p className="text-slate-600 font-bold text-lg">No hay vuelos programados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Paises