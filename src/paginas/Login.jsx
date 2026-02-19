import { useState } from 'react'

function Login({ onLogin, backgroundImage }) {
  // Usamos 'email' porque así está definido en tu tabla 'users'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Conexión con el endpoint del server.js
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Pasamos el objeto usuario y el token al estado global de App.jsx
        onLogin(data) 
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    }
  }

  const containerStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }
    : {}

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={containerStyle}
    >
      {/* Tarjeta con Tailwind y efectos de entrada (Animaciones visibles) */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-300 animate-fadeIn">
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-black text-blue-900 mb-2">Bienvenido</h1>
            <p className="text-gray-500 text-sm">Ingresa a tu cuenta de Agencia Tsunami</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
              <input
                type="email"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contraseña</label>
              <input
                type="password"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Entrar a la Agencia
          </button>

          <p className="text-center text-gray-400 text-xs">
            Al entrar aceptas los términos de servicio y privacidad.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login