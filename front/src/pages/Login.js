import React, { useState } from "react"; 
import './Login.css';
import logoDI from "./Logo_inf.png";

function Login({aliniciarsesion, alregistrarse, alregistrarempresa, alrevisarproceso}){
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');


    const logear = async () => {
        if (usuario !== '' && password !== ''){
            try{
                const respuesta = await fetch('http://localhost:8000/api/login', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({correo: usuario, password: password})
                });
                if(respuesta.ok){
                    const data = await respuesta.json();
                    aliniciarsesion(data.usuario);
                }else{
                    alert("Correo o contraseña incorrectos");
                }
            }catch (error){
                console.error("Error de conexión", error);
                alert("No se pudo conectar al servidor");
            }
        }else{
            alert("Ingrese sus datos");
        }
    }

    const manejarSubmit = async (e) => {
        e.preventDefault();
        await logear();
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logoDI} className="Logo_DI" />
                <h1>Sistema de Prácticas</h1>
                
                <form className="login-form" onSubmit={manejarSubmit}>
                    <label className="login-label">
                        Usuario: 
                        <input 
                            className="login-input" 
                            type="text" 
                            placeholder="usuario@usm.cl"
                            value={usuario} 
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </label>
                    
                    <label className="login-label">
                        Contraseña: 
                        <input 
                            className="login-input" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    
                    <button className="btn-login" type="submit">Iniciar Sesión</button>
                </form>

                <div className="login-divider"></div>
                
                <p className="login-text">¿No has ingresado antes?</p>
                <button className="btn-register" onClick={alregistrarse}>Pertenezco a la UTFSM</button>
                <p className="login-text">¿Estás buscando un practicante? ¡Ingresa una oferta de práctica!</p>
                <button className="btn-reg-enterprise" onClick={alregistrarempresa}>Registrar Empresa</button>
                <p className="login-text">¿Quieres saber sobre el proceso de prácticas?</p>
                <button className="btn-reg-enterprise" onClick={alrevisarproceso}>Revisar Proceso</button>
                <p className="login-text">Revisa la charla de prácticas</p>
                <iframe width="315" height="165" 
                    src="https://www.youtube.com/embed/zCjyUdq32Ic?si=AYhifza_wz95EPI8" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowFullScreen={true}>
                </iframe>
                <button className="btn-presentation" onClick={() => {window.open("https://drive.google.com/file/d/1ka8OQcbP_Ob-FX9fzK0xNHdIjBgX2wOy/view")}}>Presentación de la charla</button>
                <p className="texto-final" style={{fontSize: "10px"}}>
                    <br></br> <br></br>
                    Sistema de Prácticas - 2026<br></br>
                    Contacto: ayud-pra@inf.utfsm.cl<br></br>
                    Desarrollado por Grupo 4 - INF236 2026.1 - Paralelo 200 CSJ
                </p>
            </div>
        </div>
    )
}

export default Login;
