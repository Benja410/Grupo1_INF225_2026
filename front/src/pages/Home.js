import React, { useEffect, useState } from 'react';
import './Home.css'; 


function Home({ usuario, volverAlLogin, revisar, filtradopordistancia, subir, crearOferta, miPerfil, agregarSupervisor, verPostulantesEmpresa, subirReporte }) {

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [resumen, setResumen] = useState({ alumnosPostulados: 0, pendientes: 0, revisadas: 0 });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuestaOfertas = await fetch('http://localhost:8000/api/home',{
          credentials: 'include'
        });

        const dataOfertas = await respuestaOfertas.json().catch(() => null);
        if (!respuestaOfertas.ok) {
          throw new Error(dataOfertas?.error || 'No se pudieron cargar las ofertas.');
        }
        setOfertas(dataOfertas);

        if (usuario?.tipo === 'Encargado') {
          const respuestaResumen = await fetch('http://localhost:8000/api/encargado/resumen', {
            credentials: 'include'
          });
          if (respuestaResumen.ok) {
            const dataResumen = await respuestaResumen.json();
            setResumen(dataResumen);
          }
        }

        if (usuario?.tipo === 'Empresa') {
          const respuestaResumen = await fetch('http://localhost:8000/api/empresa/resumen', {
            credentials: 'include'
          });
          if (respuestaResumen.ok) {
            const dataResumen = await respuestaResumen.json();
            setResumen(dataResumen);
          }
        }

      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuario]);

  const obtenerMensajeVacio = () => {
    if (usuario?.tipo === 'Empresa') return 'No hay ofertas publicadas.';
    if (usuario?.tipo === 'Encargado') return 'No tienes prácticas a cargo en este momento.';
    if (usuario?.tipo === 'Estudiante') return 'Aún no has postulado a ninguna práctica.';
    return 'No hay nada que mostrar.';
  };

  return (
    <div className="home-layout">
      
      {/* --- BARRA LATERAL --- */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Mi Plataforma</h2>
        <nav className="sidebar-menu">
          <button className="sidebar-item" onClick={miPerfil}>
            Mi Perfil
          </button>
        
          {usuario?.tipo === 'Empresa' && (
            <>
              <button className="sidebar-item" onClick={crearOferta}>Crear Oferta</button>
              <button className="sidebar-item" onClick={verPostulantesEmpresa}>Ver Postulantes</button>
            </>

          )}
          
          {usuario?.tipo === 'Estudiante' && (
            <>
              <button className="sidebar-item" onClick={filtradopordistancia}>Ver Filtrado</button>
              <button className="sidebar-item" onClick={subir}>Matching</button>
            </>
          )}
          
          {usuario?.tipo === 'Encargado' && (
            <button className="sidebar-item" onClick={revisar}>
              Revisión de Práctica
            </button>
          )}
          
          <button className="btn-logout" onClick={volverAlLogin}>
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="home-content">
        <div className="offer-container">
          
          <header className="offer-header">
            <h1>Panel de Control</h1>
          </header>

          <div className="offer-body">
            {loading && <div className="offer-state">Cargando información...</div>}
            {error && <div className="offer-state offer-error">{error}</div>}

            {/* --- KPIs ENCARGADO --- */}
            {usuario?.tipo === 'Encargado' && !loading && (
              <div className="resumen-kpi-container">
                <div className="kpi-card">
                  <div className="kpi-icono" style={{ backgroundColor: '#ebf4ff', color: '#3182ce' }}>👥</div>
                  <div className="kpi-info">
                    <h3>{resumen.alumnosPostulados}</h3>
                    <p>Postulaciones Totales</p>
                  </div>
                </div>
                
                <div className="kpi-card kpi-alerta">
                  <div className="kpi-icono" style={{ backgroundColor: '#fffaf0', color: '#dd6b20' }}>⏳</div>
                  <div className="kpi-info">
                    <h3>{resumen.pendientes}</h3>
                    <p>Pendientes por Revisar</p>
                  </div>
                </div>

                <div className="kpi-card kpi-exito">
                  <div className="kpi-icono" style={{ backgroundColor: '#f0fff4', color: '#38a169' }}>✅</div>
                  <div className="kpi-info">
                    <h3>{resumen.revisadas}</h3>
                    <p>Prácticas Revisadas</p>
                  </div>
                </div>
              </div>
            )}
            {/* --- KPIs EMPRESA --- */}
            {usuario?.tipo === 'Empresa' && !loading && (
              <div className="resumen-kpi-container">
                <div className="kpi-card">
                  <div className="kpi-icono" style={{ backgroundColor: '#ebf4ff', color: '#3182ce' }}>👨‍🎓</div>
                  <div className="kpi-info">
                    <h3>{resumen.estudiantesPostulando || 0}</h3>
                    <p>Estudiantes Postulando</p>
                  </div>
                </div>
                
                <div className="kpi-card kpi-exito">
                  <div className="kpi-icono" style={{ backgroundColor: '#f0fff4', color: '#38a169' }}>📂</div>
                  <div className="kpi-info">
                    <h3>{resumen.practicasAbiertas || 0}</h3>
                    <p>Prácticas Abiertas</p>
                  </div>
                </div>

                <div className="kpi-card kpi-alerta">
                  <div className="kpi-icono" style={{ backgroundColor: '#fffaf0', color: '#dd6b20' }}>🔒</div>
                  <div className="kpi-info">
                    <h3>{resumen.practicasCerradas || 0}</h3>
                    <p>Prácticas Cerradas</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- GRILLA DE TARJETAS --- */}
            {!loading && ofertas.length === 0 ? (
              <div className="offer-state">
                {obtenerMensajeVacio()}
              </div>
            ) : (
              !loading && (
                <div className="offer-grid">
                  {ofertas.map((offer) => (
                    <div key={offer.id} className="offer-card">

                      <h3>{usuario?.tipo === 'Empresa' ? (offer.descripcion || 'Oferta de práctica') : offer.cargo}</h3>
                      
                      {usuario?.tipo === 'Estudiante' && (
                        <p className="etiqueta"><strong>Empresa:</strong> {offer.nombre_empresa || 'No especificada'}</p>
                      )}

                      <p className="etiqueta">Modalidad: {offer.modalidad || 'No especificada'}</p>
                      <p className="etiqueta">Ubicación: {offer.ubicacion || 'No especificada'}</p> 
                      <p className="etiqueta">Horas: {offer.cant_horas || 'No especificada'}</p>
                      <p className="etiqueta">Remuneración: {offer.remuneracion ?? 'No especificada'}</p>
                      {offer.estado === 'Aceptado' && (
                        <button className="btn-logout" onClick={() => subirReporte(offer)}>Subir informe</button>
                      )}
                      
                      {/* VISTA EXCLUSIVA EMPRESA */}
                      {usuario?.tipo === 'Empresa' && (
                        <>
                          <p className="etiqueta">Rut Supervisor: {offer.rut_supervisor || 'No asignado aún'}</p>
                          <button className="btn-logout" onClick={() => agregarSupervisor(offer)}>Agregar Supervisor</button>
                        </>
                      )}

                      {/* VISTA EXCLUSIVA ENCARGADO */}
                      {usuario?.tipo === 'Encargado' && (
                        <>
                          <p className="etiqueta" style={{ fontStyle: 'italic' }}>Descripción: {offer.descripcion || 'Sin descripción'}</p>
                          <button className="btn-logout" onClick={() => revisar(offer)}>Ver Postulantes</button>
                        </>
                      )}

                      {/* VISTA EXCLUSIVA ESTUDIANTE: Muestra el estado de la postulación */}
                      {usuario?.tipo === 'Estudiante' && (
                        <p className="etiqueta" style={{ marginTop: '12px' }}>
                          <strong>Estado Postulación: </strong> 
                          <span className={`status-badge ${offer.estado ? offer.estado.toLowerCase() : 'pendiente'}`}>
                            {offer.estado || 'Pendiente'}
                          </span>
                        </p>
                      )}

                    </div>
                  ))}
                </div>
              )
            )}

          </div>
        </div>
      </main>

    </div>
  );
}

export default Home;