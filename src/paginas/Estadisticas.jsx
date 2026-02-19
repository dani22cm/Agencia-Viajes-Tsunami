import React, { useEffect, useState } from 'react';

const Estadisticas = () => {
  const [stats, setStats] = useState([]);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    // Aquí tu compañero conectará con el servidor
    // Ejemplo: fetch('/api/stats').then(res => res.json()).then(data => setStats(data))
  }, []);

  return (
    <div className="admin-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>📊 Panel de Control - Estadísticas</h1>
      
      <section>
        <h2>🌍 Ranking de Países más Rentables</h2>
        <table border="1" style={{ width: '100%', textAlign: 'left', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>País</th>
              <th>Total Reservas</th>
              <th>Ingresos Totales</th>
              <th>Rating Medio</th>
            </tr>
          </thead>
          <tbody>
            {/* Estos datos vienen de v_estadisticas_paises */}
            {stats.map((s, index) => (
              <tr key={index}>
                <td>{s.pais}</td>
                <td>{s.total_reservas}</td>
                <td>{s.ingresos_totales} €</td>
                <td>{s.rating_medio_paquetes} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>🧾 Historial de Ventas Recientes</h2>
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Cliente</th>
              <th>Paquete</th>
              <th>Importe</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {/* Estos datos vienen de v_resumen_ventas */}
            {ventas.map((v, index) => (
              <tr key={index}>
                <td>{v.cliente}</td>
                <td>{v.paquete}</td>
                <td>{v.importe} €</td>
                <td>{new Date(v.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Estadisticas;