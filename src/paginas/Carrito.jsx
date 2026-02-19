import { useState } from 'react'

function Carrito({ carrito, eliminarDelCarrito, vaciarCarrito, user }) {
  const [procesando, setProcesando] = useState(false)

  // Calculamos el total sumando los precios de los items del carrito
  const total = carrito.reduce((acc, item) => acc + Number(item.price), 0)

  const handlePago = async () => {
    if (!user) {
      alert("⚠️ Debes iniciar sesión para finalizar la compra.");
      return;
    }

    setProcesando(true);

    try {
      // Recorremos el carrito y compramos cada viaje uno por uno
      for (const viaje of carrito) {
        const respuesta = await fetch('http://localhost:4000/api/comprar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_usuario: user.id,
            id_viaje: viaje.code // Enviamos el código (ej: JPN) para que busque el paquete
          })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          // Si MySQL dice que no hay saldo, lanzamos el error para parar el proceso
          throw new Error(data.error || `Error al comprar ${viaje.name}`);
        }
      }

      // Si el bucle termina sin errores, es que todo se ha comprado bien
      alert("✅ ¡Pago completado! Se ha descontado el total de tu Cartera Tsunami y tus reservas están confirmadas.");
      vaciarCarrito(); // Limpiamos la pantalla

    } catch (error) {
      console.error("Fallo en la transacción:", error);
      alert(`❌ Operación cancelada: ${error.message}`);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 animate-fadeIn min-h-[60vh]">
      <div className="mb-8 border-b-4 border-blue-600 inline-block pr-8">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Tu Carrito
        </h2>
        <p className="text-slate-500 font-medium mt-1">Revisa tus destinos antes de volar</p>
      </div>

      {carrito.length > 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <ul className="divide-y divide-slate-100 mb-8">
            {carrito.map((item, index) => (
              <li key={index} className="py-6 flex justify-between items-center group">
                <div className="flex items-center gap-6">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-2xl shadow-md"
                  />
                  <div>
                    <p className="font-bold text-2xl text-slate-800">{item.name}</p>
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      Ref: {item.code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <p className="text-2xl font-black text-blue-600">{item.price}€</p>
                  <button 
                    onClick={() => eliminarDelCarrito(index)}
                    disabled={procesando}
                    className="text-red-400 font-bold hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg hover:bg-red-100"
                    title="Eliminar viaje"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center border border-slate-200">
            <div>
              <p className="text-slate-500 font-medium">Total a pagar</p>
              <p className="text-4xl font-black text-slate-900">{total}€</p>
            </div>
            
            <button 
              onClick={handlePago}
              disabled={procesando}
              className={`mt-6 md:mt-0 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center gap-3
                ${procesando 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-slate-900 hover:scale-105 active:scale-95'}`}
            >
              {procesando ? 'Procesando pago...' : 'Pagar con mi Saldo'}
              {!procesando && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-slate-500 text-xl font-medium">Tu carrito está más vacío que el desierto del Sahara.</p>
          <a href="#paises" className="inline-block mt-6 text-blue-600 font-bold hover:underline">
            ¡Vamos a explorar destinos!
          </a>
        </div>
      )}
    </div>
  )
}

export default Carrito