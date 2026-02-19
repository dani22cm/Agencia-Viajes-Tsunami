import { useEffect, useState } from 'react'

// Mantenemos NOTICIAS_DATA como fallback, pero lo ideal es que venga de tu tabla 'packages' o una similar
const NOTICIAS_DATA = [
  {
    id: 1,
    titulo: 'Descubriendo los rincones secretos de Málaga',
    autor: 'María López',
    fecha: '2025-11-10',
    tags: ['Málaga', 'Cultura', 'Playas'],
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
    contenido: 'Un paseo por Málaga revela una ciudad bañada por luz, donde playas doradas coexisten con cafés escondidos.',
    cuerpo: ['Desde las callejuelas del centro histórico hasta el vibrante Muelle Uno, Málaga invita a perderse.']
  },
  // ... resto de noticias
]

function Noticias({ usuarioLogueado }) {
  const [seleccionada, setSeleccionada] = useState(NOTICIAS_DATA[0])
  const [comentarios, setComentarios] = useState([])
  const [texto, setTexto] = useState('')
  const [likes, setLikes] = useState(0)

  // Requisito: Persistencia y lógica real
  useEffect(() => {
    if (!seleccionada) return
    const key = `comentarios_noticia_${seleccionada.id}`
    const saved = localStorage.getItem(key)
    setComentarios(saved ? JSON.parse(saved) : [])
  }, [seleccionada])

  const handleEnviar = (e) => {
    e.preventDefault()
    if (!texto.trim() || !usuarioLogueado) return

    const nuevo = {
      id: Date.now(),
      autor: usuarioLogueado.name, // Usamos el nombre real del usuario logueado
      texto: texto.trim(),
      fecha: new Date().toLocaleString()
    }

    const updated = [nuevo, ...comentarios]
    setComentarios(updated)
    localStorage.setItem(`comentarios_noticia_${seleccionada.id}`, JSON.stringify(updated))
    setTexto('')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto animate-fadeIn">
      {/* Listado lateral con Tailwind */}
      <aside className="w-full lg:w-1/3 space-y-4">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Últimas noticias</h2>
        <div className="space-y-3">
          {NOTICIAS_DATA.map((n) => (
            <div
              key={n.id}
              onClick={() => setSeleccionada(n)}
              className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                seleccionada?.id === n.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white hover:bg-blue-50'
              }`}
            >
              <img src={n.imagen} className="w-20 h-20 object-cover rounded-lg" alt="" />
              <div>
                <h3 className="font-bold text-sm line-clamp-2">{n.titulo}</h3>
                <span className="text-xs opacity-70">{n.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Detalle de la noticia con Animaciones */}
      <section className="w-full lg:w-2/3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        {seleccionada && (
          <article className="space-y-6">
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{seleccionada.titulo}</h1>
            <div className="flex gap-4 text-sm text-slate-400 font-medium italic">
              <span>Por {seleccionada.autor}</span>
              <span>•</span>
              <span>{seleccionada.fecha}</span>
            </div>
            
            <img src={seleccionada.imagen} className="w-full h-80 object-cover rounded-2xl shadow-inner" alt="" />
            
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p className="text-xl font-medium text-slate-800">{seleccionada.contenido}</p>
              {seleccionada.cuerpo?.map((p, i) => <p key={i} className="mt-4">{p}</p>)}
            </div>

            {/* Requisito: Proceso lógico - Comentarios */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-bold mb-6">Conversación ({comentarios.length})</h3>
              
              {usuarioLogueado ? (
                <form onSubmit={handleEnviar} className="mb-8 space-y-4">
                  <textarea
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Escribe tu opinión..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    rows={3}
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-100">
                    Publicar comentario
                  </button>
                </form>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm font-medium mb-6">
                  Debes estar logueado para participar en la conversación.
                </div>
              )}

              <ul className="space-y-4">
                {comentarios.map((c) => (
                  <li key={c.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-slideIn">
                    <div className="flex justify-between mb-2">
                      <strong className="text-blue-600">{c.autor}</strong>
                      <span className="text-xs text-slate-400">{c.fecha}</span>
                    </div>
                    <p className="text-slate-700">{c.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
      </section>
    </div>
  )
}

export default Noticias