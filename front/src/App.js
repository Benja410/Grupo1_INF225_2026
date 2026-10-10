import React, { useState } from 'react';

import Revisionpractica from './pages/Revisionpractica';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Filtrado from './pages/Filtrado';
import Matching from './pages/Matching';
import FormularioOferta from './components/FormularioOferta';
import Perfil from './pages/Perfil';
import Regempresa from './pages/Regempresa';
import Revisarproceso from './pages/Revisarproceso';
import FormSupervisor from './pages/FormSupervisor';
import PostulantesEmpresa from './pages/PostulanteEm';
import SubirReporte from './pages/SubirReporte';

import './App.css';


function App() {
  const [vista, setVista] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [practicaSeleccionada, setpracticaSeleccionada] = useState(null);

  const cerrarSesion = () => {
    setUsuario(null);
    setVista('login');
  };

  const irPostulantes = () => setVista('postulantes');

  const iraAgregarSupervisor = (oferta) => {
    setpracticaSeleccionada(oferta);
    setVista('agregar-supervisor')
  }
  const irasubirReporte = (oferta) => {
    setpracticaSeleccionada(oferta);
    setVista('subir_reporte')
  }

  return (
    <div className="App">
        {vista === 'login' && (
          <Login 
            aliniciarsesion={(usuarioAutenticado) => {
              setUsuario(usuarioAutenticado);
              setVista('home');
            }} 
            alregistrarse= {() =>setVista('registro')}
            alregistrarempresa= {() =>setVista('regempresa')}
            alrevisarproceso = {() => setVista('revisarproceso')}
          />
        )}
        {vista === 'registro' && (
            <Registro volverAlLogin={() => setVista('login')} />
        )}
        {vista === 'home' && (
            <Home 
              usuario={usuario}
              volverAlLogin={cerrarSesion} 
              revisar= {() => setVista('revision')}
              filtradopordistancia={() => setVista('filtrado')}
              subir= {() => setVista('matching')}
              crearOferta={() => setVista('crearOferta')}
              miPerfil={() => setVista('perfil')}
              agregarSupervisor={iraAgregarSupervisor}
              verPostulantesEmpresa={irPostulantes}
              subirReporte={irasubirReporte}
            />
        )}
        {vista === 'revision' && (
            <Revisionpractica volverAlHome={() => setVista('home')} />
        )}
        {vista === 'filtrado' && (
            <Filtrado volverAlHome={() => setVista('home')}/>
        )}
        {vista === 'matching' && (
            <Matching volverAlHome={() => setVista('home')}/>
        )}

        {vista === 'crearOferta' && (
            <div>
              <FormularioOferta volverAlHome={() => setVista('home')}/>
            </div>
        )}
        {vista === 'perfil' && (
            
            <Perfil 
              volverAlHome={() => setVista('home')} 
              usuario={usuario}
              />
        )}

        {vista === 'regempresa' && (
            <Regempresa volverAlLogin={() => setVista('login')}/>
        )}
        {vista === 'revisarproceso' && (
            <Revisarproceso volverAlLogin={() => setVista('login')}/>
        )}
        {vista === 'postulantes' && (
            <PostulantesEmpresa volverAlHome={() => setVista('home')}/>
        )}
        {vista === 'agregar-supervisor' && (
          <FormSupervisor
            usuario={usuario}
            practica = {practicaSeleccionada}
            volverAlHome = {() => setVista('home')}/>
        )}
        {vista === 'subir_reporte' && (
          <SubirReporte 
            usuario={usuario}
            practica={practicaSeleccionada}
            volverAlHome = {() => setVista('home')}/>
        )}
    </div>
  );
}

export default App;
