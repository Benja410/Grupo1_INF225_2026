import React, {useState} from 'react';
import '../components/FormularioOferta.css';

function FormSupervisor({usuario, practica, volverAlHome}){
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const empresa = usuario?.nombre;


    const registrar = async (e) => {
        e.preventDefault();
        if (!nombre || !rut ) {
            alert('Completa todos los campos obligatorios del registro.');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:8000/api/supervisor', {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    rut,
                    nombre,
                    empresa,
                    id: practica?.id,
                    tipo_usuario: 'Supervisor'
                })
            });

            if (respuesta.ok) {
                alert('Supervisor asignado de forma exitosa');
                volverAlHome();
                return;
            }

            const errorData = await respuesta.json().catch(() => null);
            const mensajeError = errorData?.message || errorData?.error || 'No se pudo completar la asignación.';
            alert(mensajeError);
        } catch (error) {
            console.error('Error de conexion en asignación de supervisor', error);
            alert('No se pudo conectar al servidor.');
        }
    };


    return(
        <div className="formulario-container">
            <div className="formulario-card">
                
                <div className="formulario-header">
                <h2>Registrar Supervisor</h2>
                </div>
                
                <form>
                    <div className="form-group">
                        <label className="main-label">Nombre Completo</label>
                        <input type="text" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}></input>  
                    </div>

                    <div className="form-group">
                        <label className="main-label">Rut</label>
                        <input type="text" name="rut" value={rut} onChange={(e) => setRut(e.target.value)}></input>  
                    </div>

                    <button type="submit" className="btn-submit" onClick={registrar}>Asignar</button>
                    <button className="volveralhome" onClick={volverAlHome}>Volver al Home</button>
                </form>
            </div>
        </div>


    );
}

export default FormSupervisor;