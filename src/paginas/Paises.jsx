import { useState, useEffect } from 'react'
import Modal from '../componentes/Modal'

function Paises({ user }) {
  const [paises, setPaises] = useState([]) // Viene de tabla 'countries'
  const [ofertas, setOfertas] = useState([]) // Viene de tabla 'packages'
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // 1. Cargar datos reales de la BD al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPaises = await fetch('http://localhost:3000/api/countries')
        const dataPaises = await resPaises.json()
        setPaises(dataPaises)

        const resOfertas = await fetch('http://localhost:3000/api/packages')
        const dataOfertas = await resOfertas.json()
        setOfertas(dataOfertas)
      } catch (err) {
        console.error("Error cargando datos:", err)
      }
    }
    fetchData()
  }, [])

  const openModal = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  // 2. PROCESO LÓGICO: Comprar paquete (Usa tu PROCEDURE sp_comprar_paquete)
  const handleCompra = async () => {
    if (!user) return alert("Debes iniciar sesión")
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3000/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id, 
          package_id: selectedItem.id 
        })
      })
      const data = await res.json()

      if (res.ok) {
        alert("¡Compra exitosa! Revisa tu correo.")
        setModalOpen(false)
      } else {
        alert(data.error || "Error en la compra")
      }
    } catch (err) {
      alert("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto animate-fadeIn">
      <h2 className="text-4xl font-black text-slate-900 mb-10 border-l-8 border-blue-600 pl-4">
        Explora el Mundo
      </h2>

      {/* Grid de Países (Tabla countries) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {paises.map((d) => (
          <article key={d.code} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100">
            <div className="relative h-64 overflow-hidden">
              <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                {d.avg_price}
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-2xl font-bold text-slate-800">{d.name}</h4>
              <div className="flex text-amber-400 my-2">
                {'★'.repeat(Math.floor(d.rating))} <span className="ml-2 text-slate-400 text-sm italic">({d.rating})</span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">{d.description}</p>
              <button 
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                onClick={() => openModal(d)}
              >
                Ver Detalles
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Listado de Ofertas (Tabla packages) */}
      <h3 className="text-2xl font-bold text-slate-800 mb-8">Ofertas de Temporada</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ofertas.map((item) => (
          <div 
            key={item.id} 
            onClick={() => openModal(item)}
            className="cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all group"
          >
            <img src={item.image} className="w-full h-40 object-cover rounded-xl mb-4" alt="" />
            <h4 className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.title}</h4>
            <p className="text-blue-600 font-black mt-2">{item.price_numeric}€</p>
          </div>
        ))}
      </div>

      {/* Modal con Lógica de Negocio */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem?.name || selectedItem?.title}>
        {selectedItem && (
          <div className="space-y-6">
            <img src={selectedItem.image} className="w-full h-64 object-cover rounded-2xl" alt="" />
            <div>
              <h4 className="text-lg font-bold text-slate-800">Sobre este destino</h4>
              <p className="text-slate-600 mt-2 leading-relaxed">
                {selectedItem.description || selectedItem.details}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">Precio Total</span>
                <span className="text-3xl font-black text-blue-600">
                  {selectedItem.price_numeric || 50}€
                </span>
              </div>
              
              <button 
                onClick={handleCompra}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva Ahora'}
              </button>
              <p className="text-[10px] text-center text-blue-400 mt-3 uppercase tracking-widest font-bold">
                Pago seguro mediante tu Wallet Tsunami
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default Paises