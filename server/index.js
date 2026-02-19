import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 4000;

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- CONEXIÓN A LA BASE DE DATOS ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agencia-viajes' 
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
  const query = 'SELECT * FROM countries';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en SELECT paises:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// --- RUTA 3: ESTADÍSTICAS (RANKING) ---
app.get('/api/stats', (req, res) => {
  db.query('SELECT * FROM v_estadisticas_paises', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- RUTA 4: VENTAS RECIENTES ---
app.get('/api/ventas', (req, res) => {
  db.query('SELECT * FROM v_resumen_ventas ORDER BY fecha DESC LIMIT 10', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- RUTA 5: COMPRA CON SALDO (PROCEDURE) ---
// --- RUTA 5: COMPRA CON SALDO (PROCEDURE CORREGIDO) ---
app.post('/api/comprar', (req, res) => {
  // Recibimos id_viaje (ej: 'JPN') desde el frontend
  const { id_usuario, id_viaje } = req.body;

  // 1. Buscamos el ID real del paquete ('JPN-01')
  const queryGetPackage = 'SELECT id FROM packages WHERE country_code = ? LIMIT 1';

  db.execute(queryGetPackage, [id_viaje], (err, packageResults) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (packageResults.length === 0) {
      return res.status(404).json({ error: 'No hay paquetes disponibles para este destino' });
    }

    const packageId = packageResults[0].id; // Ej: 'JPN-01'

    // 2. Ahora sí, llamamos al procedimiento con el ID correcto
    const queryProcedure = 'CALL sp_comprar_paquete(?, ?)';

    db.query(queryProcedure, [id_usuario, packageId], (err, results) => {
      if (err) {
        console.error('❌ Error en la compra:', err.message);
        return res.status(400).json({ error: err.message });
      }
      
      res.json({ mensaje: 'Compra realizada con éxito y saldo descontado' });
    });
  });
});

// --- RUTA 6: OBTENER SALDO DEL USUARIO ---
app.get('/api/wallet/:userId', (req, res) => {
  db.query('SELECT balance FROM wallets WHERE user_id = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || { balance: 0 });
  });
});
// --- RUTA 7: HISTORIAL DE RESERVAS DEL USUARIO ---
app.get('/api/reservas/:userId', (req, res) => {
  // Mezclamos las tablas para devolver la foto, el nombre del país y el precio pagado
  const query = `
    SELECT b.id, b.booking_date, b.total_paid, b.status, p.title, c.name as country_name, c.image_url
    FROM bookings b
    JOIN packages p ON b.package_id = p.id
    JOIN countries c ON p.country_code = c.code
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;
  
  db.execute(query, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- INICIO DEL SERVIDOR (AL FINAL) ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Tsunami Viajes corriendo en http://localhost:${PORT}`);
});