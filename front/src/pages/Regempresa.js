import React, { useState } from 'react';
import './Regempresa.css';

function Regempresa({ volverAlLogin }) {
  const [nombres, setNombres] = useState('');
  const [correo, setCorreo] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [resena, setResena] = useState('');

  const registrar = async () => {
    if (!nombres || !correo || !rut || !password) {
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
          apellidos: '',
          correo,
          password,
          resena,
          tipo_usuario: 'Empresa'
        })
      });

      if (respuesta.ok) {
        alert('Registro de empresa completado. Ahora inicia sesion.');
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
            Nombre de la Empresa 
            <input
              className="registro-input"
              type="text"
              placeholder="Tus nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </label>

          <label className="registro-label">
            Correo 
            <input
              className="registro-input"
              type="email"
              placeholder="ejemplo@empresa.cl"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>
          <div className="registro-row">
            <label className="registro-label">
              RUT de la Empresa
              <input
                className="registro-input"
                type="text"
                placeholder="12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
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
            Breve descripción de la empresa
            <input 
            className="registro-input" 
            type="text" 
            placeholder="Reseña"
            onChange={(e) => setResena(e.target.value)}
            />
          </label>

          <div className="registro-divider"></div>
          <br></br>
          <p style={{fontSize: "15px"}}>Luego de registrarse como cuenta de empresa, inicie sesión para crear ofertas de práctica</p>
          <br></br>
          <div className="registro-buttons">
            <button className="btn-guardar" onClick={registrar}>Guardar</button>
            <button className="btn-volver" onClick={volverAlLogin}>Volver al Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Regempresa;
