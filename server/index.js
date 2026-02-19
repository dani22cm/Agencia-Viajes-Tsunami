import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 4000;

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors()); // Permite que tu React (5173) hable con este servidor (4000)
app.use(express.json()); // Permite leer los datos que envías en el Login y Registro

// --- CONEXIÓN A LA BASE DE DATOS ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agencia-viajes' // Asegúrate de que este es el nombre en tu phpMyAdmin
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL: agencia-viajes');
});

// --- RUTA 1: LOGIN ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?';
  
  db.execute(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      res.json({ user: results[0], token: 'token-sesion-tsunami' });
    } else {
      res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
  });
});

// --- RUTA 2: OBTENER TODOS LOS VIAJES (PAÍSES) ---
app.get('/api/paises', (req, res) => {
  // Consultamos la tabla 'countries' que tienes en tu estructura
  const query = 'SELECT * FROM countries';
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- RUTA 3: ESTADÍSTICAS (RANKING) ---
app.get('/api/stats', (req, res) => {
  // Usamos la vista que creamos para el ranking de países
  db.query('SELECT * FROM v_estadisticas_paises', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- RUTA 4: VENTAS RECIENTES ---
app.get('/api/ventas', (req, res) => {
  // Usamos la vista de resumen de ventas
  db.query('SELECT * FROM v_resumen_ventas ORDER BY fecha DESC LIMIT 10', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Tsunami Viajes corriendo en http://localhost:${PORT}`);
});
// --- RUTA 5: CREAR UNA RESERVA (CORREGIDA) ---
app.post('/api/reservar', (req, res) => {
  // Recibimos también el id del usuario que hace la compra
  const { id_usuario, id_viaje, precio } = req.body;
  
  // Usamos 'bookings' porque es la tabla que ya tienes creada
  // 'package_id' en tu DB es un VARCHAR, por eso usamos el código del país o ID
  const query = 'INSERT INTO bookings (user_id, package_id, total_paid, status) VALUES (?, ?, ?, "confirmed")';

  db.execute(query, [id_usuario, id_viaje, precio], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar reserva:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({ 
      mensaje: 'Reserva realizada con éxito', 
      id_reserva: result.insertId 
    });
  });
});