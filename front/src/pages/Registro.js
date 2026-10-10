import React, { useState } from 'react';
import './Registro.css';

function Registro({ volverAlLogin }) {
  const [nombres, setNombres] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [distancia, setDistancia] = useState('');


  const registrar = async () => {
    if (!nombres || !apellidoPaterno || !apellidoMaterno || !correo || !rut || !password || !rol || !direccion || !telefono || !distancia)  {
      alert('Completa todos los campos obligatorios del registro.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:8000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          rut,
          nombres,
          apellidos: `${apellidoPaterno} ${apellidoMaterno}`,
          correo,
          password,
          rol,
          direccion,
          telefono,
          distancia,
          tipo_usuario: 'Estudiante'
        })
      });

      if (respuesta.ok) {
        alert('Registro completado. Ahora inicia sesion.');
        volverAlLogin();
        return;
      }

      const errorData = await respuesta.json().catch(() => null);
      const mensajeError = errorData?.message || errorData?.error || 'No se pudo completar el registro.';
      alert(mensajeError);
    } catch (error) {
      console.error('Error de conexion en registro', error);
      alert('No se pudo conectar al servidor.');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h1>Formulario de Registro</h1>
        
        <div className="registro-form">
          <label className="registro-label">
            Nombres 
            <input
              className="registro-input"
              type="text"
              placeholder="Tus nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </label>
          <div className="registro-row">
            <label className="registro-label">
              Apellido Paterno
              <input
                className="registro-input"
                type="text"
                placeholder="Apellido Paterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
              />
            </label>
            <label className="registro-label">
              Apellido Materno
              <input
                className="registro-input"
                type="text"
                placeholder="Apellido Materno"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
              />
            </label>
          </div>

          <label className="registro-label">
            Correo 
            <input
              className="registro-input"
              type="email"
              placeholder="ejemplo@alumnos.usm.cl"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>
          <div className="registro-row">
            <label className="registro-label">
              RUT 
              <input
                className="registro-input"
                type="text"
                placeholder="12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </label>
            <label className="registro-label">
              Rol USM 
              <input 
                className="registro-input" 
                type="text" 
                placeholder="202X73...-X" 
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                />
            </label>
          </div>

          <label className="registro-label">
            Contraseña
            <input
              className="registro-input"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="registro-label">
            Dirección 
            <input 
              className="registro-input" 
              type="text" 
              placeholder="Tu dirección" 
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              />
          </label>

          <div className="registro-row">
            <label className="registro-label">
              Número telefónico 
              <input 
                className="registro-input" 
                type="text" 
                placeholder="+56 9..." 
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                />
            </label>

            <label className="registro-label">
              Distancia máx. (Km) 
              <input 
                className="registro-input" 
                type="number" 
                placeholder="Ej: 20" 
                value={distancia}
                onChange={(e) => setDistancia(e.target.value)}
                />
            </label>
          </div>

          <label className="registro-label">
            Intereses 
            <select className="registro-input">
              <option value="">Seleccione un área de interés...</option>
              <option value="software">Desarrollo de Software</option>
              <option value="redes">Redes y Telecomunicaciones</option>
              <option value="datos">Ciencia de Datos</option>
              <option value="ciberseguridad">Ciberseguridad</option>
            </select>
          </label>

          <div className="registro-divider"></div>

          <div className="registro-buttons">
            <button className="btn-guardar" onClick={registrar}>Guardar</button>
            <button className="btn-volver" onClick={volverAlLogin}>Volver al Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
