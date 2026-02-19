import { useState, useEffect } from 'react'

function Perfil({ user, onLogout }) {
  const [saldo, setSaldo] = useState(0)
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!user) return;

    // 1. Obtenemos el saldo actual de la Cartera (Wallet)
    fetch(`http://localhost:4000/api/wallet/${user.id}`)
      .then(res => res.json())
      .then(data => setSaldo(data.balance))
      .catch(err => console.error("Error al cargar saldo:", err));

    // 2. Obtenemos el historial de viajes comprados
    fetch(`http://localhost:4000/api/reservas/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setReservas(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar reservas:", err);
        setCargando(false);
      });
  }, [user]);

  if (!user) return <div className="p-20 text-center">Inicia sesión para ver tu perfil.</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fadeIn min-h-screen">
      
      {/* CABECERA DEL PERFIL Y SALDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* Tarjeta de Usuario */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-black border-4 border-white shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">Hola, {user.name}</h2>
            <p className="text-slate-500 font-medium">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase">
              Cliente {user.role === 'admin' ? 'Premium' : 'Estándar'}
            </span>
          </div>
        </div>

        {/* Tarjeta de Wallet (Estilo Booking Rewards) */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-blue-200 font-medium mb-1 z-10">Saldo Tsunami Wallet</p>
          <h3 className="text-5xl font-black z-10">{Number(saldo).toLocaleString('es-ES')}€</h3>
          <button className="mt-4 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-bold py-2 px-4 rounded-xl w-max z-10 backdrop-blur-sm">
            Recargar Saldo
          </button>
        </div>
      </div>

      {/* HISTORIAL DE RESERVAS */}
      <div>
        <h3 className="text-2xl font-black text-slate-800 mb-6 border-l-4 border-blue-600 pl-3">Tus Próximos Viajes</h3>
        
        {cargando ? (
          <p className="text-slate-500">Cargando tus aventuras...</p>
        ) : reservas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden relative">
                  <img src={reserva.image_url} alt={reserva.country_name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm">
                    {reserva.status === 'confirmed' ? '✅ Confirmado' : '⏳ Pendiente'}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1">{reserva.country_name}</p>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{reserva.title}</h4>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-xs text-slate-400">Importe pagado</p>
                      <p className="font-black text-lg text-slate-700">{reserva.total_paid}€</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      Reserva: {new Date(reserva.booking_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-slate-600 font-medium">Aún no tienes reservas.</p>
            <a href="#paises" className="inline-block mt-4 text-blue-600 font-bold hover:underline">¡Encuentra tu próximo destino!</a>
          </div>
        )}
      </div>

    </div>
  )
}

export default Perfil