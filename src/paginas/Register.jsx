import { useState } from 'react'

export default function Register({ onRegister, backgroundImage }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const containerStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' } 
    : {}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Llamada real al backend (Node.js + Express)
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: nombre, 
          email: email, 
          password: password 
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert("Cuenta creada con éxito. Ahora puedes loguearte.")
        // Redirigimos al login usando el hash o navegación
        window.location.hash = '#login'
      } else {
        setError(data.error || 'Error al registrarse')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={containerStyle}
    >
      {/* Tarjeta con Tailwind y Animación de entrada */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-fadeIn">
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-black text-slate-800">Crea tu cuenta</h1>
            <p className="text-slate-500 text-sm mt-1">Únete a la Agencia Tsunami</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 italic">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tu nombre"
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Correo Electrónico</label>
              <input 
                type="email" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="email@ejemplo.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Contraseña</label>
              <input 
                type="password" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:bg-slate-400"
          >
            {loading ? 'Procesando...' : 'Registrarse ahora'}
          </button>

          <div className="text-center pt-2">
            <a href="#login" className="text-sm text-blue-600 font-bold hover:underline">
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}