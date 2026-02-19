import { useState, useEffect } from 'react'

// Recibimos 'user' como prop para saber quién está logueado
function Paises({ user }) {
  const [viajes, setViajes] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  // 1. Cargar los países desde el servidor al montar el componente
  useEffect(() => {
    fetch('http://localhost:4000/api/paises')
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron obtener los destinos')
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

  // 2. Función para gestionar la reserva
  const handleReserva = async (destino) => {
    // Verificamos si hay un usuario logueado antes de permitir la compra
    if (!user) {
      alert("⚠️ Debes iniciar sesión para realizar una reserva.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:4000/api/reservar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: user.id,        // ID del usuario de la sesión
          id_viaje: destino.code,     // Usamos el código (JPN, ESP, etc.) para la tabla bookings
          precio: destino.price       // Precio que se guardará en total_paid
        }),
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert(`✅ ¡Reserva confirmada! Has reservado un viaje a ${destino.name}.`);
      } else {
        alert(`❌ Error: ${resultado.error || 'No se pudo procesar la reserva'}`);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert('🚫 No se pudo conectar con el servidor para realizar la reserva.');
    }
  };

  if (cargando) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fadeIn">
      {/* Cabecera de la sección */}
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter border-l-8 border-blue-600 pl-4">
          Explora el Mundo
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Ofertas exclusivas de Tsunami Viajes</p>
      </div>

      {error && (
        <div className="bg-red-50 border-red-200 border text-red-600 p-4 rounded-xl mb-8">
          ⚠️ {error}
        </div>
      )}

      {/* Grid de tarjetas de viajes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {viajes.length > 0 ? (
          viajes.map((destino) => (
            <div 
              key={destino.id} 
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-slate-100"
            >
              {/* Imagen del destino */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={destino.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={destino.name}
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1 rounded-full font-black text-blue-600 shadow-lg">
                  {destino.price ? `${destino.price}€` : 'Consultar'} 
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-slate-800">{destino.name}</h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {destino.code}
                  </span>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {destino.description || 'Descubre los secretos de este destino increíble con nuestros paquetes personalizados.'}
                </p>

                {/* Botón de Acción */}
                <button 
                  onClick={() => handleReserva(destino)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Reservar Ahora
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 italic text-xl">No hay destinos disponibles en este momento...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Paises