import React, { useEffect, useState } from 'react';
import './Matching.css'; 

const Matching = ({ volverAlHome }) => {
  const [filtro, setFiltro] = useState('');
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postuladas, setPostuladas] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resMatching = await fetch('http://localhost:8000/api/ofertas/matching', {
          credentials: 'include'
        });
        const dataMatching = await resMatching.json().catch(() => null);
        
        if (!resMatching.ok) {
          throw new Error(dataMatching?.error || 'No se pudieron cargar las ofertas de matching.');
        }
        setOfertas(dataMatching);

        const resPostuladas = await fetch('http://localhost:8000/api/estudiante/mis-postulaciones-ids', {
          credentials: 'include'
        });
        
        if (resPostuladas.ok) {
          const historialIds = await resPostuladas.json();
          setPostuladas(historialIds); // Inicializa el estado con lo que ya está en la Base de Datos
        }

      } catch (err) {
        console.error('Error cargando datos de matching:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handlePostular = async (id_practica) => {
    try {
      const respuesta = await fetch('http://localhost:8000/api/estudiante/postular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_practica}),
        credentials: 'include'
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(data.error || 'No se pudo realizar la postulación.');
        return;
      }

      setPostuladas([...postuladas, id_practica]);
      
    } catch (error) {
      console.error('Error en postulación:', error);
      alert('Ocurrió un error de conexión al intentar postular.');
    }
  };

  const filtroNormalizado = filtro.toLowerCase();

  const matchesFiltrados = ofertas.filter(oferta => 
    oferta.nombre_empresa.toLowerCase().includes(filtroNormalizado) || 
    oferta.habilidades.some(habilidad => habilidad.toLowerCase().includes(filtroNormalizado))
  );

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-alta';
    if (score >= 30) return 'score-media';
    return 'score-baja';
  };

  return (
    <div className="home-layout">
      
      {/* --- BARRA LATERAL --- */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Mi Plataforma</h2>
        <nav className="sidebar-menu">
          <button className="sidebar-item active-view">
            Resultados Matching
          </button>
          <button className="sidebar-item" onClick={volverAlHome}>
            Volver al Panel
          </button>
        </nav>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="home-content">
        <div className="offer-container">
          
          <header className="offer-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <h1>Matching de Prácticas</h1>

            <input 
              type="text" 
              className="matching-search"
              placeholder="🔍 Filtrar por empresa o tecnología..." 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </header>

          <div className="offer-body">
            {loading && <div className="offer-state">Calculando tu porcentaje de compatibilidad...</div>}
            {error && <div className="offer-state offer-error">{error}</div>}

            {!loading && !error && (
              <>
                {matchesFiltrados.length === 0 ? (
                  <div className="offer-state">No hay ofertas que coincidan con tu búsqueda.</div>
                ) : (
                  <div className="offer-grid">
                    {matchesFiltrados.map((match) => {
                      const yaPostulo = postuladas.includes(match.id);
                      
                      return (
                        <div key={match.id} className="offer-card">
                          <div className="matching-card-header">
                            <h3>{match.descripcion || 'Oferta de práctica'}</h3>
                            <span className={`matching-badge ${getScoreClass(match.score)}`}>
                              {match.score}% Match
                            </span>
                          </div>

                          <p className="etiqueta"><strong>Empresa:</strong> {match.nombre_empresa}</p>
                          <p className="etiqueta"><strong>Modalidad:</strong> {match.modalidad || 'No especificada'}</p>
                          <p className="etiqueta"><strong>Ubicación:</strong> {match.ubicacion || 'No especificada'}</p>

                          <p className="etiqueta requisitos-box">
                            <strong>Requisitos:</strong> {match.habilidades.length > 0 ? match.habilidades.join(', ') : 'Sin habilidades especificadas'}
                          </p>

                          <button 
                            className={yaPostulo ? "btn-postulado" : "btn-action-primary"}
                            onClick={() => handlePostular(match.id)}
                            disabled={yaPostulo}
                            style={{ marginTop: 'auto' }}
                          >
                            {yaPostulo ? '✅ Postulado' : 'Postular a esta práctica'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </main>

    </div>
  );
};

export default Matching;