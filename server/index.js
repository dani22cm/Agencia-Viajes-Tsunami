import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 4000; // El puerto que muestra tu terminal

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors()); // Permite la comunicación con el frontend
app.use(express.json()); // Permite leer los datos JSON del login

// --- CONEXIÓN A LA BASE DE DATOS ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agencia-viajes' // Tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL: agencia-viajes');
});

// --- ENDPOINT: LOGIN ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?';
  
  db.execute(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      // Devolvemos los datos del usuario, incluyendo el rol para las estadísticas
      res.json({ user: results[0], token: 'token-sesion-practica-123' });
    } else {
      res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
  });
});

// --- ENDPOINT: ESTADÍSTICAS ---
app.get('/api/stats', (req, res) => {
  db.query('SELECT * FROM v_estadisticas_paises', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- ENDPOINT: ÚLTIMAS VENTAS ---
app.get('/api/ventas', (req, res) => {
  db.query('SELECT * FROM v_resumen_ventas ORDER BY fecha DESC LIMIT 10', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Tsunami Viajes corriendo en http://localhost:${PORT}`);
});