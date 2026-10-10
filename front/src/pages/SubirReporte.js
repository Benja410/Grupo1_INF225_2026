import React, {useState} from 'react';
import '../components/FormularioOferta.css';

function SubirReporte({usuario, practica, volverAlHome}){
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [subiendo, setSubiendo] = useState(false);

    const handleFileChange = (e) => {
        const fileSelected = e.target.files[0];
        setArchivo(fileSelected);
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!archivo) {
            setMensaje('Debes seleccionar un archivo PDF primero.');
            return;
        }
        setSubiendo(true);
        setMensaje('');

        const formData = new FormData();
        formData.append('pdf_documento', archivo);
        formData.append('rut_estudiante', usuario?.rut);
        formData.append('id_practica', practica?.id)
        formData.append('rut_supervisor', practica?.rut_supervisor);

        try{
            const subir_reporte = await fetch('http://localhost:8000/api/subir_informe', {
                method: 'POST',
                body: formData
            });

            if(subir_reporte.ok){
                setMensaje('Documento enviado con éxito');
                setArchivo(null);
            } else{
                setMensaje('Error: No se pudo subir el archivo');
            }
        } catch (error){
            console.error('Error al conectar con el servidor:', error);
            setMensaje('No se pudo conectar con el servidor.');
        } finally {
            setSubiendo(false);
        }
    };


    return(
        <div className="formulario-container">
            <div className="formulario-card">
                
                <div className="formulario-header">
                <h2>Subir Informe de Práctica</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <input type='file' accept='.pdf' onChange={handleFileChange} disabled={subiendo}/>


                    <button type="submit" disabled={subiendo || !archivo} className="btn-submit">{subiendo ? 'Subiendo...' : 'Subir Archivo'}</button>
                    <button type='button' className="volveralhome" onClick={volverAlHome}>Volver al Home</button>
                </form>
                {mensaje && <p style={{marginTop: '10px', fontWeight: 'bold'}}>{mensaje}</p>}
            </div>
        </div>


    );
}

export default SubirReporte;