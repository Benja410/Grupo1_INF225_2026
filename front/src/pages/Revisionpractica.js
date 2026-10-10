import React, { useState, useEffect } from 'react';
import './Revisionpractica.css';

function Revisionpractica({ volverAlHome }) {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);

  const [datosIA, setDatosIA] = useState(null);
  const [cargandoIA, setCargandoIA] = useState(false);
  useEffect(() => {
    cargarPostulaciones();
  }, []);

  useEffect(() => {
    setDatosIA(null);
  }, [seleccionada]);

  const cargarPostulaciones = async () => {
    try {
      const respuesta = await fetch('http://localhost:8000/api/encargado/postulaciones', {
        credentials: 'include'
      });
      const data = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw new Error(data?.error || 'Error al cargar las postulaciones.');
      }
      setPostulaciones(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analizarInformeConIA = async () => {
    if (!seleccionada?.id_practica) return;

    setCargandoIA(true);
    setDatosIA(null);

    try {
      const respuesta = await fetch(`http://localhost:8000/api/ia/resumen/${seleccionada.id_practica}`, {
        credentials: 'include' // Mantiene la cookie de sesión si usas Passport
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data?.error || 'Error al procesar el documento con la IA.');
      }

      // Guardamos el objeto JSON estructurado que viene del backend
      setDatosIA(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoIA(false);
    }
  };

  const enviarEvaluacion = async (evaluacion) => {

    try{
      const respuesta = await fetch('http://localhost:8000/api/practica/evaluar', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id_practica: seleccionada.id_practica,
          rut: seleccionada.rut_estudiante,
          estado: evaluacion
        })

      });

      if (respuesta.ok) {
        alert('Práctica evaluada correctamente');
        cargarPostulaciones();
        setSeleccionada(null);
      } else {
        alert('Error al evaluar');
      }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error de conexión al intentar evaluar la práctica.");
    }
  }

  const pendientes = postulaciones.filter(p => p.estado === 'Enviado para revisar');
  const revisadas = postulaciones.filter(p => p.estado === 'Aprobada' || p.estado === 'Rechazada');


  if (seleccionada) {
    return (
      <div className="home-layout">
        <aside className="sidebar">
          <h2 className="sidebar-title">Mi Plataforma</h2>
          <nav className="sidebar-menu">
            <button className="sidebar-item" onClick={() => setSeleccionada(null)}>
              ⬅ Volver a Listas
            </button>
            <button className="sidebar-item" onClick={volverAlHome}>
              Ir al Home
            </button>
          </nav>
        </aside>

        <main className="home-content">
          <div className="offer-container">
            <header className="offer-header">
              <h1>Evaluación: {seleccionada.nombre_estudiante}</h1>
            </header>

            <div className="revision-detail-grid">
              <div className="offer-card detail-card">
                <h3>Datos del Estudiante</h3>
                <p className="etiqueta"><strong>Nombre:</strong> {seleccionada.nombre_estudiante}</p>
                <p className="etiqueta"><strong>RUT:</strong> {seleccionada.rut_estudiante}</p>
                <p className="etiqueta"><strong>Empresa:</strong> {seleccionada.nombre_empresa}</p>
                <p className="etiqueta"><strong>Cargo:</strong> {seleccionada.cargo}</p>
              </div>
              <div className="offer-card detail-card">
                <h3>Documentación Adjunta</h3>
                <p className="etiqueta">📄 {seleccionada.ruta_archivo || 'Informe_Práctica_Final.pdf'} (2.5 MB)</p>
                <a href = {`http://localhost:8000${seleccionada.ruta_archivo}`} 
                  target = '_blank'
                  rel="noopener noreferrer"
                  className="btn-descargar">Descargar Documento
                </a>

                <button 
                    onClick={analizarInformeConIA} 
                    className="btn-action-primary" 
                    disabled={cargandoIA}
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {cargandoIA ? '⏳ Analizando PDF...' : '✨ Analizar con IA'}
                </button>

              </div>
              <div className="offer-card detail-card ia-card">
                <h3>Aspectos Clave (Validación IA)</h3>
                <p className="etiqueta">🔍 <strong>RUT en Documento:</strong> {seleccionada.rut_estudiante}</p>
                <p className="etiqueta">🏢 <strong>Empresa Detectada:</strong> {seleccionada.nombre_empresa}</p>
                <p className="etiqueta">⏱ <strong>Horas Declaradas:</strong> {seleccionada.cant_horas} hrs</p>
              </div>
              <div className="offer-card detail-card full-width-card">
                <h3>Resumen de Contenido por IA</h3>
                {cargandoIA && <div className="offer-state">Redactando síntesis académica...</div>}
                {!cargandoIA && !datosIA && <p className="etiqueta" style={{ color: '#888', fontStyle: 'italic' }}>El extracto generado por el asistente aparecerá en este cuadro al presionar el botón.</p>}
                {datosIA && (
                  <p className="etiqueta resumen-texto" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#2c3e50' }}>
                    {datosIA.resumen_ejecutivo}
                  </p>
                )}  
              </div>
            </div>

            <div className="action-buttons-container">
              <button className="btn-aprobar" onClick={() => enviarEvaluacion('Aprobada')}>Aprobar Práctica</button>
              <button className="btn-rechazar" onClick={() => enviarEvaluacion('Rechazada')}>Rechazar Práctica</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="home-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Mi Plataforma</h2>
        <nav className="sidebar-menu">
          <button className="sidebar-item active-view">
            Revisión de Práctica
          </button>
          <button className="sidebar-item" onClick={volverAlHome}>
            Volver al Panel
          </button>
        </nav>
      </aside>

      <main className="home-content">
        <div className="offer-container">
          <header className="offer-header">
            <h1>Panel de Revisiones</h1>
          </header>

          <div className="offer-body">
            {loading && <div className="offer-state">Cargando postulaciones...</div>}
            {error && <div className="offer-state offer-error">{error}</div>}

            {!loading && !error && (
              <div className="revision-sections-wrapper">
                <div className="revision-section-block">
                  <h2 className="section-subtitle subtitle-pendiente">⏳ Postulaciones por Revisar ({pendientes.length})</h2>
                  {pendientes.length === 0 ? (
                    <div className="offer-state">No quedan prácticas pendientes de revisión.</div>
                  ) : (
                    <div className="offer-grid">
                      {pendientes.map((post) => (
                        <div key={`${post.rut_estudiante}-${post.id_practica}`} className="offer-card card-pendiente">
                          <h3>{post.nombre_estudiante}</h3>
                          <p className="etiqueta"><strong>Empresa:</strong> {post.nombre_empresa}</p>
                          <p className="etiqueta"><strong>Cargo:</strong> {post.cargo}</p>
                          <p className="etiqueta"><strong>Horas:</strong> {post.cant_horas} hrs</p>
                          <button className="btn-action-primary" onClick={() => setSeleccionada(post)}>
                            Revisar Práctica
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="revision-section-block" style={{ marginTop: '40px' }}>
                  <h2 className="section-subtitle subtitle-revisada">✅ Postulaciones Revisadas ({revisadas.length})</h2>
                  {revisadas.length === 0 ? (
                    <div className="offer-state">Aún no se registran prácticas evaluadas.</div>
                  ) : (
                    <div className="offer-grid">
                      {revisadas.map((post) => (
                        <div key={`${post.rut_estudiante}-${post.id_practica}`} className="offer-card card-revisada">
                          <h3>{post.nombre_estudiante}</h3>
                          <p className="etiqueta"><strong>Empresa:</strong> {post.nombre_empresa}</p>
                          <p className="etiqueta"><strong>Cargo:</strong> {post.cargo}</p>
                          <p className="etiqueta">
                            <strong>Estado:</strong> <span className={`status-badge ${post.estado.toLowerCase()}`}>{post.estado}</span>
                          </p>
                          <button className="btn-action-secondary" onClick={() => setSeleccionada(post)}>
                            Ver Detalles
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Revisionpractica;
