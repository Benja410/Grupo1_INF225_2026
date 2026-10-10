import React, { useEffect, useState } from 'react';
import './Perfil.css';

function Perfil({ usuario, volverAlHome }) {
  const [catalogo, setCatalogo] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: '',
    correo: '',
    direccion: '',
    rol: '',
    rut: '',
    distancia: '',
    telefono: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const [respuestaCatalogo, respuestaPerfil] = await Promise.all([
          fetch('http://localhost:8000/api/habilidades'),
          fetch('http://localhost:8000/api/perfil', { credentials: 'include' })
        ]);

        if (!respuestaCatalogo.ok) {
          throw new Error('No se pudo cargar el catálogo de habilidades.');
        }

        if (!respuestaPerfil.ok) {
          throw new Error('No se pudo cargar el perfil.');
        }

        const [habilidadesCatalogo, perfil] = await Promise.all([
          respuestaCatalogo.json(),
          respuestaPerfil.json()
        ]);

        setCatalogo(habilidadesCatalogo);
        setSeleccionadas((perfil.habilidades || []).map((habilidad) => habilidad.id));
        setDatosPerfil({
          nombre: perfil.nombre || '',
          correo: perfil.correo || '',
          rol: perfil.rol || '',
          rut: perfil.rut || '',
          direccion: perfil.direccion || '',
          distancia: perfil.distancia || '',
          telefono: perfil.telefono || ''
        });
        
      } catch (error) {
        console.error('Error cargando el perfil:', error);
        setMensaje({ tipo: 'error', texto: error.message });
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const habilidadesPorCategoria = catalogo.reduce((categorias, habilidad) => {
    if (!categorias[habilidad.categoria]) {
      categorias[habilidad.categoria] = [];
    }

    categorias[habilidad.categoria].push(habilidad);
    return categorias;
  }, {});

  const toggleHabilidad = (idHabilidad) => {
    setSeleccionadas((actuales) => (
      actuales.includes(idHabilidad)
        ? actuales.filter((id) => id !== idHabilidad)
        : [...actuales, idHabilidad]
    ));
    setMensaje(null);
  };

  const cambiosInput = (e) =>{
    setDatosPerfil({
      ...datosPerfil, [e.target.name]: e.target.value});

    };


  const guardarPerfil = async () => {
    setGuardando(true);
    setMensaje(null);

    try {
      const respuesta = await fetch('http://localhost:8000/api/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ habilidades: seleccionadas, direccion: datosPerfil.direccion, telefono: datosPerfil.telefono, distancia: datosPerfil.distancia})
      });

      const data = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        throw new Error(data?.error || 'No se pudo guardar el perfil.');
      }

      setMensaje({ tipo: 'exito', texto: data?.mensaje || 'Perfil actualizado correctamente.' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando el perfil:', error);
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
            <h1>Mi Perfil</h1>
            <button className="perfil-btn-volver" onClick={volverAlHome}>Volver</button>
        </div>

        {loading ? (
          <div className="perfil-loading">Cargando habilidades...</div>
        ) : (
          <>
            <div className="perfil-avatar-section">
              <div className="perfil-avatar-ajuste">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png" // URL de una imagen de usuario predeterminada y neutra
                  alt="Foto de perfil predeterminada" 
                  className="perfil-avatar-img"
                />
              </div>
              <h2 className="perfil-usuario-nombre">
                {`${datosPerfil.nombre}`}
              </h2>
            </div>


            <div className="perfil-categorias" style={{ marginBottom: '32px' }}>
              <section className='perfil-categoria'>
                <h2>Información Personal</h2>
                <div className="perfil-info-block">
                  <div className='perfil-form-group'>
                    <label>RUT</label>
                    <input type="text" value={`${datosPerfil.rut}`} disabled className='input-disabled'/>
                  </div>
                  <div className='perfil-form-group'>
                    <label>Correo Electronico</label>
                    <input type="text" value={`${datosPerfil.correo}`} disabled className='input-disabled'/>
                  </div>
                  <div className='perfil-form-group'>
                    <label>ROL-USM</label>
                    <input type="text" value={`${datosPerfil.rol}`} disabled className='input-disabled'/>
                  </div>
                  <div className='perfil-form-group'>
                    <label>Telefono de Contacto</label>
                    <input type="text" name="telefono" value={`${datosPerfil.telefono}`} onChange={cambiosInput} disabled={!isEditing} className={isEditing ? 'input-enable' : ' input-disbaled'} placeholder='No especificada'/>
                  </div>
                  <div className='perfil-form-group'>
                    <label>Direccion de Residencia</label>
                    <input type="text" name="direccion" value={`${datosPerfil.direccion}`} onChange={cambiosInput} disabled={!isEditing} className={isEditing ? 'input-enable' : ' input-disbaled'} placeholder='No especificada'/>
                  </div>
                  <div className='perfil-form-group'>
                    <label>Distancia</label>
                    <input type="text" name="distancia" value={`${datosPerfil.distancia}`} onChange={cambiosInput} disabled={!isEditing} className={isEditing ? 'input-enable' : ' input-disbaled'} placeholder='No especificada'/>
                  </div>
                  <div className='perfil-toggle-edicion'>
                    {!isEditing ? (
                      <button 
                        type='button' 
                        className='perfil-btn-editar' 
                        onClick={() => setIsEditing(true)}
                        >
                          Editar Información Personal
                        </button>
                    ) : (
                      <button 
                        type='button' 
                        className='perfil-btn-cancelar' 
                        onClick={guardarPerfil}
                        disabled={guardando}
                        >
                          {guardando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {usuario?.tipo === 'Estudiante' && (
              <>
                <hr className='perfil-divider'></hr>
                <div className="perfil-resumen">
                  <span>{seleccionadas.length}</span>
                  Habilidades Seleccionadas
                </div>
                <p>Selecciona las habilidades que quieres destacar para el matching de prácticas.</p>
                <div className="perfil-categorias">
                  {Object.entries(habilidadesPorCategoria).map(([categoria, habilidades]) => (
                    <section key={categoria} className="perfil-categoria">
                      <h2>{categoria}</h2>
                      <div className="perfil-checkbox-grid">
                        {habilidades.map((habilidad) => (
                          <label key={habilidad.id} className="perfil-checkbox-label">
                            <input
                              type="checkbox"
                              value={habilidad.id}
                              checked={seleccionadas.includes(habilidad.id)}
                              onChange={() => toggleHabilidad(habilidad.id)}
                            />
                            {habilidad.nombre}
                          </label>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}
            

            {mensaje && (
              <div className={`perfil-mensaje perfil-mensaje-${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}

            <button className="perfil-btn-guardar" onClick={guardarPerfil} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Perfil'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Perfil;
