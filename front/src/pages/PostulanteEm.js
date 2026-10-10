import React, { useState, useEffect } from 'react';
import './PostulanteEm.css';

function PostulantesEmpresa({ volverAlHome }) {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPostulantes();
  }, []);

  const cargarPostulantes = async () => {
    try {
      const respuesta = await fetch('http://localhost:8000/api/empresa/postulantes', {
        credentials: 'include'
      });
      const data = await respuesta.json();
      if (respuesta.ok) setPostulantes(data);
    } catch (error) {
      console.error("Error al cargar postulantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const evaluarEstudiante = async (rut_estudiante, id_practica, nuevo_estado) => {
    try {
      const respuesta = await fetch('http://localhost:8000/api/empresa/evaluar-postulante', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut_estudiante, id_practica, nuevo_estado }),
        credentials: 'include'
      });

      if (respuesta.ok) {
        setPostulantes(postulantes.map(p => 
          (p.rut_estudiante === rut_estudiante && p.id_practica === id_practica) 
            ? { ...p, estado: nuevo_estado } 
            : p
        ));
        alert(`Has ${nuevo_estado.toLowerCase()} al estudiante.`);
      }
    } catch (error) {
      alert("Error al procesar la evaluación.");
    }
  };

  return (
    <div className="home-layout">
      <main className="home-content" style={{ width: '100%', margin: '0 auto' }}>
        <div className="offer-container">
          <header className="offer-header">
            <h1>Gestión de Postulantes</h1>
            <button className="btn-volver" onClick={volverAlHome}>Volver al Panel</button>
          </header>

          {loading ? <p>Cargando postulantes...</p> : (
            <div className="offer-grid">
              {postulantes.length === 0 ? <p>Aún no hay estudiantes postulando a tus ofertas.</p> : null}
              
              {postulantes.map((postulante) => (
                <div key={`${postulante.rut_estudiante}-${postulante.id_practica}`} className="offer-card">
                  <h3>{postulante.nombre_estudiante}</h3>
                  <p className="etiqueta"><strong>Cargo postulado:</strong> {postulante.cargo}</p>
                  <p className="etiqueta">
                    <strong>Estado actual:</strong> <span className={`status-badge ${postulante.estado.toLowerCase()}`}>{postulante.estado}</span>
                  </p>
                  
                  {postulante.estado === 'Pendiente' && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button 
                        style={{ flex: 1, backgroundColor: '#38a169', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={() => evaluarEstudiante(postulante.rut_estudiante, postulante.id_practica, 'Aceptado')}
                      >
                        ✅ Aceptar
                      </button>
                      <button 
                        style={{ flex: 1, backgroundColor: '#e53e3e', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={() => evaluarEstudiante(postulante.rut_estudiante, postulante.id_practica, 'Rechazado')}
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PostulantesEmpresa;