import React, { useEffect, useState } from 'react';
import './Filtrado.css';

function Filtrado({ volverAlHome }) {
    const [ofertas, setOfertas] = useState({ cercanas: [], misma_region: [], lejanas: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarOfertas = async () => {
            try {
                const respuesta = await fetch('http://localhost:8000/api/ofertas/filtradas', {
                    credentials: 'include'
                });

                const data = await respuesta.json().catch(() => null);
                if (!respuesta.ok) throw new Error(data?.error || 'Error de carga.');

                setOfertas({
                    cercanas: data.cercanas || [],
                    misma_region: data.misma_region || [],
                    lejanas: data.lejanas || []
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarOfertas();
    }, []);

    const renderOferta = (oferta, tipo) => {
        let colorBadge = 'verde';
        let textoBadge = '';

        if (tipo === 'misma_region') colorBadge = 'naranja';
        if (tipo === 'lejanas') colorBadge = 'rojo';

        if (oferta.modalidad === 'Remoto') {
            colorBadge = 'azul';
            textoBadge = '100% Remoto';
        } else {
            textoBadge = oferta.distancia_km === 'Desconocida' 
                ? 'Distancia GPS desconocida' 
                : `A ${oferta.distancia_km} km`;
        }

        return (
            <div key={oferta.id} className={`offer-card card-${colorBadge}`}>
                <div className="oferta-header">
                    <h3>{oferta.nombre_empresa}</h3>
                    <span className={`score-badge score-badge-${colorBadge}`}>
                        📍 {textoBadge}
                    </span>
                </div>
                <p className="etiqueta"><strong>Cargo:</strong> {oferta.cargo}</p>
                <p className="etiqueta"><strong>Ubicación:</strong> {oferta.ubicacion}</p>
                <p className="etiqueta" style={{ fontStyle: 'italic', marginTop: '10px', color: '#4a5568' }}>
                    {oferta.descripcion || 'Sin descripción disponible.'}
                </p>
            </div>
        );
    };

    return (
        <div className="home-layout">
            <aside className="sidebar">
                <h2 className="sidebar-title">Mi Plataforma</h2>
                <nav className="sidebar-menu">
                    <button className="sidebar-item active-view">Ver Filtrado</button>
                    <button className="sidebar-item" onClick={volverAlHome}>Volver al Panel</button>
                </nav>
            </aside>

            <main className="home-content">
                <div className="offer-container">
                    <header className="offer-header">
                        <h1>Filtro de Distancia Geográfica</h1>
                    </header>

                    <div className="offer-body">
                        {loading && <div className="offer-state">Calculando rutas...</div>}
                        {error && <div className="offer-state offer-error">{error}</div>}

                        {!loading && !error && (
                            <div className="filtrado-sections-wrapper">
                                
                                <div className="filtrado-section-block">
                                    <h2 className="section-subtitle subtitle-incluidas">
                                        ✅ En tu radio deseado ({ofertas.cercanas.length})
                                    </h2>
                                    <div className="offer-grid">
                                        {ofertas.cercanas.map((oferta) => renderOferta(oferta, 'cercanas'))}
                                    </div>
                                </div>

                                <div className="filtrado-section-block" style={{ marginTop: '40px' }}>
                                    <h2 className="section-subtitle subtitle-naranja">
                                        🚗 Un poco más lejos ({ofertas.misma_region.length})
                                    </h2>
                                    <div className="offer-grid">
                                        {ofertas.misma_region.map((oferta) => renderOferta(oferta, 'misma_region'))}
                                    </div>
                                </div>

                                <div className="filtrado-section-block" style={{ marginTop: '40px' }}>
                                    <h2 className="section-subtitle subtitle-excluidas">
                                        ✈️ Fuera de tu alcance ({ofertas.lejanas.length})
                                    </h2>
                                    <div className="offer-grid">
                                        {ofertas.lejanas.map((oferta) => renderOferta(oferta, 'lejanas'))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );    
}

export default Filtrado;