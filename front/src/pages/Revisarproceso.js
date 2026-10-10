import React, {useState} from 'react';
import './Revisarproceso.css';
import logoDI from "./Logo_inf.png";

function Revisarproceso({volverAlLogin}){
    const [seccionAbierta, setSeccionAbierta] = useState('info');

    const ManejarSeccion = (seccion) =>{
        if (seccionAbierta === seccion) {
            setSeccionAbierta(null);
        } else {
            setSeccionAbierta(seccion);
        }
    };


    return(
        <div className="acordeon-container">
            <div className="acordeon-card">
                <img src={logoDI} className="Logo_DI" />
                <div className="acordeon-item">
                    <div className="titulo-acordeon" onClick={() => ManejarSeccion('info')}>
                        <h2 style={{fontSize: "15px"}}>Información del Proceso de Práctica</h2>
                        <span className={`flecha ${seccionAbierta === 'info'? 'open' : ''}`}>⌵</span>
                    </div>
                    {seccionAbierta === 'info' && (
                        <div className="info-acordeon">
                            <h2 style={{textAlign: "left", fontSize: "15px"}}>Bienvenidos al Proceso de Prácticas</h2>
                            <p style={{textAlign: "justify", fontSize: "12px"}}>
                                Bienvenidos a la página del proceso de prácticas del Departamento de Informática de la Universidad Técnica Federico Santa María (Documento oficial aqui), donde los estudiantes tienen la oportunidad de completar su formación mediante dos prácticas esenciales: la Práctica Industrial y la Práctica Profesional. 
                                Estas experiencias no solo permiten a los estudiantes aplicar sus conocimientos en ambientes laborales reales, sino que también ofrecen a las organizaciones la posibilidad de evaluar el potencial de los futuros profesionales en el campo de la informática.<br></br><br></br>                            
                                Aquí, los estudiantes podrán encontrar toda la información necesaria, realizar sus prácticas, desde los requisitos previos hasta las instrucciones detalladas para cada etapa del proceso. Además, ofrecemos acceso a un sistema de gestión de prácticas online que facilita el registro y seguimiento de cada práctica, asegurando que cada estudiante cumpla con los objetivos de aprendizaje y competencias requeridas.<br></br><br></br> 
                                Esperamos que esta página sea un recurso valioso para guiar a los estudiantes a través de sus prácticas y hacia un exitoso inicio en su carrera profesional. ¡Les deseamos mucho éxito!<br></br>
                            </p>
                            <div className="hbox">
                                <p style={{fontSize: "12px"}}><strong>Profesor Encargado Jose Luis Marti<br></br>jmarti@inf.utfsm.cl</strong></p>
                                <p style={{fontSize: "12px"}}><strong>Profesor Encargado Pedro Godoy<br></br>pgodoy@inf.utfsm.cl</strong></p>
                                <p style={{fontSize: "12px"}}><strong>Encargado Jose González Pasten<br></br>jose.gonzalezpa@usm.cl</strong></p>
                                <p style={{fontSize: "12px"}}><strong>Ayudante de prácticas<br></br>ayud-pra@inf.utfsm.cl</strong></p>
                            </div>
                        </div>
                )}
                </div>

                <div className="acordeon-item">
                    <div className="titulo-acordeon" onClick={() => ManejarSeccion('proceso')}>
                        <h2 style={{fontSize: "15px"}}>Sobre el proceso</h2>
                        <span className={`flecha ${seccionAbierta === 'proceso'? 'open' : ''}`}>⌵</span>
                    </div>
                    {seccionAbierta === 'proceso' && (
                        <div className="info-acordeon">
                            <p style={{textAlign: "justify", fontSize: "12px"}}>
                                El proceso de prácticas de en departamento de Informática de la UTFSM consta de 2 prácticas en la carrera del estudiante:<br></br>
                                <strong>1. Práctica Industrial (PI):</strong> Esta tiene como objetivo introducir al estudiante en el ambiente laboral de una Organización (empresa o institución) y se puede realizar tras haber aprobado asignaturas tales como Bases de datos y Lenguajes de programación. La duración es de 1 o 2 meses continuos con la jornada que establezca la Org. que sea equivalente a <strong>162 o 324</strong> horas de trabajo, que además se podrían realizar en más meses.<br></br><br></br>
                                <strong>2. Práctica Profesional (PP):</strong> La PP tiene como objetivo participar en un proyecto o trabajo pre-profesional de la especialidad en una Organización y se debe realizar tras hecha ya la PI. Su duración es de 2 o 3 meses continuos según la jornada que establezca la Org. que sea equivalente a <strong>324 o 486</strong> hrs respectivamente en varios meses.  Se recomienda hacerla post FeriaSW. De realizar la PP en la UTFSM se requiere consultar antes de a su inicio, pues lo ideal es hacerlo en Org. externas.<br></br><br></br>
                                El total de tiempo de realización de prácticas debe ser equivalente a 4 meses o 648 hrs entre las PI y PP, tiempo que puede ser repartido de las siguientes maneras:<br></br><br></br>
                                - 162 hrs de Práctica industrial + 486 hrs de Práctica profesional.<br></br>- 324 hrs de Práctica industrial + 324 hrs de Práctica profesional.<br></br><br></br>
                                Además el DI admite que la realización de la práctica se haga en modalidad hibrida o remota si así lo establece la Organización y en cuyo caso debe ser realizada en modalidad de horas distribuidas durante varios meses para lograr las horas requeridas.<br></br><br></br>
                                En las prácticas se evaluarán las siguientes competencias:<br></br><br></br>
                                - Capacidad<br></br>- Confianza<br></br>- Capacidad para resolver problemas<br></br>- Adaptabilidad<br></br>
                                - Iniciativa<br></br>- Aptitud para trabajar en equipo<br></br>- Conocimientos<br></br>- Asistencia y puntualidad<br></br>
                                - Compromiso con la calidad<br></br>- Comunicacón efectiva<br></br>- Manejo de TIC<br></br><br></br>
                                Y cada una de estas será evaluada en la siguiente escala: <br></br><br></br>
                                - 1 nulo<br></br>- 2 deficiente<br></br>- 3 aceptable<br></br>- 4 bueno<br></br>- 5 excelente<br></br><br></br>
                                El DI exige una calificación de alto nivel en cada ítem. Se aceptan hasta dos competencias con nota 3, el resto deben ser superiores.<br></br><br></br>
                                <strong>En caso de que la organización requiera un certificado de postulación a práctica, se debe solicitar vía SIGA solamente a Dirección de Estudios (DE), además se debe solicitar un seguro estudiantil simple por este mismo medio para presentarlo a la organización.</strong>
                            </p>
                        </div>
                    )}
                </div>

                <div className="acordeon-item">
                    <div className="titulo-acordeon" onClick={() => ManejarSeccion('buscando')}>
                        <h2 style={{fontSize: "15px"}}>Buscando Práctica</h2>
                        <span className={`flecha ${seccionAbierta === 'buscando'? 'open' : ''}`}>⌵</span>
                    </div>
                    {seccionAbierta === 'buscando' && (
                        <div className="info-acordeon">
                            <p style={{textAlign: "justify", fontSize: "12px"}}>
                                Los estudiantes pueden encontrar prácticas por su propia iniciativa o pueden postular a las ofertas realizadas por la universidad. Vinculación con el Medio de la Universidad e Informática publican ofertas de práctica que son enviadas por Organizaciones (Empresas e Instituciones) en busca de practicantes de la UTFSM. Esta difusión se realiza mediante la lista de correo del Profesor Encargado o en https://gestal.usm.cl/todo-sobre-tu-practica/.<br></br><br></br>
                                - Para postular a una buena práctica es recomendable que el estudiante confeccione un destacable currículo en papel y LinkedIn más una carta de presentación.<br></br><br></br>
                                - Debe estar atento a documentos extras que las empresas soliciten, además, se sugiere estar atento a los Requerimientos exigidos y Beneficios ofrecidos.<br></br><br></br>
                                En el mes de octubre el DI convocará a los estudiantes a una reunión de asistencia obligatoria para dar inicio al proceso de prácticas 2024, en donde conocerán sobre como es el proceso y resolverán las dudas existentes respecto a este mismo.<br></br><br></br>

                            </p>
                        </div>
                    )}
                </div>

                <div className="acordeon-item">
                    <div className="titulo-acordeon" onClick={() => ManejarSeccion('realizando')}>
                        <h2 style={{fontSize: "15px"}}>Realizando la Práctica</h2>
                        <span className={`flecha ${seccionAbierta === 'realizando'? 'open' : ''}`}>⌵</span>
                    </div>
                    {seccionAbierta === 'realizando' && (
                        <div className="info-acordeon">
                            <p style={{textAlign: "justify", fontSize: "12px"}}>
                                Una vez ya aceptado por la organización, el estudiante debe registrarse en el sistema de gestión de prácticas (http://practicas.inf.utfsm.cl) e inscribir la práctica en el formato que se realizará. Al momento de ingresarla se pedirán algunos datos de la organización y del supervisor a cargo, al cual luego se le enviará un correo de confirmación de práctica (en caso de que el correo no llegue, levantar una solicitud en el sistema solicitando el reenvío).<br></br><br></br>
                                Durante el desarrollo de la práctica, el estudiante tendrá que hacer ingreso de bitácoras por cada día de trabajo realizado, estas deben ser ingresadas en el sistema web de prácticas, en el cual se facilita el registro de cada una de estas con las respectivas horas realizadas para hacer el conteo de horas totales.<br></br><br></br>
                                - Durante el año podrán existir posibles sesiones virtuales exigiendo la asistencia de estudiantes en práctica. <br></br><br></br>
                                - CUIDADO CON POSIBLES SITUACIONES DE ACOSO O ABUSO. Consultar en Protocolo USM. <br></br><br></br>
                            </p>
                        </div>
                    )}
                </div>

                <div className="acordeon-item">
                    <div className="titulo-acordeon" onClick={() => ManejarSeccion('finalizando')}>
                        <h2 style={{fontSize: "15px"}}>Finalizando la Práctica</h2>
                        <span className={`flecha ${seccionAbierta === 'finalizando'? 'open' : ''}`}>⌵</span>
                    </div>
                    {seccionAbierta === 'finalizando' && (
                        <div className="info-acordeon">
                            <p style={{textAlign: "justify", fontSize: "12px"}}>
                                Una vez ya terminada la práctica la/el alumno tiene hasta un mes para finalizar el proceso en el sistema de web en el cual se deberá:<br></br><br></br>
                                <strong>1.</strong> Completar una encuesta ad-hoc<br></br><br></br>
                                <strong>2.</strong> Rellenar campos que consideran la descripción general de la Empresa/Institución y de la Unidad donde trabajo (cargos, lugar, etc.), su organigrama, las tareas principales realizadas, la plataforma tecnológica utilizada, el aporte personal realizado, beneficios recibidos y las fechas en las que realizó la práctica.<br></br><br></br>
                                <strong>3.</strong> Una vez ya ingresados estos datos, el sistema enviará un mail al Supervisor registrado con un enlace para realizar la evaluación, en el cual se revisarán las bitácoras y datos ingresados anteriormente, además de completar la evaluación general y evaluación de competencias mencionadas en un principio. Es importante avisar al supervisor que se está finalizando el proceso y que se le enviará un mail con la evaluación (en caso de que el correo no llegue, levantar una solicitud en el sistema solicitando el reenvío).<br></br><br></br>
                                Los aspectos a evaluar son el cumplimiento del proceso de práctica (incluye  la información exigida), una buena evaluación de Competencias, y la opinión del Supervisor/Evaluador.<br></br><br></br>
                                Los resultados de la calificación de la práctica por el DI son comunicados en los meses de abril, julio, octubre y enero, enviados al mail del DI y a la DE, entidad responsable de su ingreso en el SIGA.<br></br><br></br>
                                La/el alumno deberá verificar (en hasta 4 meses después) que su práctica aprobada haya sido registrada efectivamente en el SIGA.<br></br><br></br>
                            </p>
                        </div>
                    )}
                </div>

                <div className="acordeon-item">
                    <div className="titulo-acordeon" onClick={() => ManejarSeccion('convalidaciones')}>
                        <h2 style={{fontSize: "15px"}}>Convalidaciones y casos especiales</h2>
                        <span className={`flecha ${seccionAbierta === 'convalidaciones'? 'open' : ''}`}>⌵</span>
                    </div>
                    {seccionAbierta === 'convalidaciones' && (
                        <div className="info-acordeon">
                            <p style={{textAlign: "justify", fontSize: "12px"}}>
                                EL DI considera las siguientes situaciones excepcionales, que deberán ser aprobadas por las Jefaturas de Carrera, y recomendación del Encargado de Practicas:<br></br><br></br>
                                <strong>1.</strong> Que la PI sea desarrollada como una práctica social, es decir, que tiene como objetivo aportar a la comunidad, o bien, reconocer un trabajo remunerado que lo ayude a solventar su situación socioeconómica complicada.<br></br><br></br>
                                <strong>2.</strong> Que una de las practicas sea equivalente a una estadía en un Centro o proyecto de Investigación. Requiere una carta de patrocinio de un profesor del DI.<br></br><br></br>
                                <strong>3.</strong> Que la PI y PP se realicen de manera continua en una misma empresa. En este caso deberá desarrollarla en modalidad hibrida (Debido a que el tiempo de práctica será más extendido la/el estudiante debe poder continuar sus estudios) y ser por un total de 648 horas. <br></br><br></br>
                                <strong>4.</strong> Que una de las prácticas se realice el extranjero, tarea que la/el estudiante asume bajo su propia responsabilidad.  En Chile la/el estudiante es cubierto en su práctica por un seguro simple que se da a todo alumno universitario nacional, de modo que quien la desarrolle en el extranjero debe contratar un seguro internacional ad-hoc. (Dado que el sistema de prácticas pedirá un RUT de esa empresa al momento de ingresar los datos de la organización, ingrese 11.111.111-1 )<br></br><br></br>
                                <strong>5.</strong> Que una de las prácticas sea equivalente al planteamiento y desarrollo de un Proyecto de Emprendimiento. Si su solicitud es aceptada deberá subir al sistema de gestión lo siguiente: <br></br><br></br>
                                {"\u00A0"}1. Plan Operacional (procesos claves de Producción) y Modelo de Negocios (incluye Ingresos y Egresos)<br></br>
                                {"\u00A0"}2. Bitácora detallada del trabajo realizado<br></br>
                                {"\u00A0"}3. Link a página Web y RRSS del emprendimiento con indicadores de tráfico. Incluyen fotografías (de avances logrados), video (para motivar a clientes o beneficiarios a usar la solución ofrecida), y definiciones como son Misión, Visión y Valores. (Dado que el sistema exigirá un RUT de su emprendimiento al momento de ingresar los datos de la organización, ingrese 00.000.000-0)<br></br><br></br>
                                <strong>6.</strong> Que sus prácticas sean equivalentes a un trabajo profesional desarrollado en UNA empresa o institución durante al menos el triple del periodo a reconocer. Esta alternativa es para el caso de estudiantes que partieron a trabajar previamente en una empresa de la especialidad y están próximo a titularse.<br></br><br></br>
                                Si desea convalidar, deberá ingresar la práctica en el sistema en modo de convalidación, rellenar los datos correspondientes y subir los siguienes documentos:<br></br><br></br>
                                {"\u00A0"}1. Currículo de una página en que detalla las actividades desarrolladas<br></br>
                                {"\u00A0"}2. Carta de su Jefe en la Empresa en que éste avala la calidad del aporte realizado<br></br>
                                {"\u00A0"}3. RUT de la empresa<br></br>
                                {"\u00A0"}4. Certificado de imposiciones previsionales o copia de las boletas con glosa adhoc de los meses a convalidar <br></br>

                            </p>
                        </div>
                    )}
                </div>
                    

                <button className="btn-volver" onClick={volverAlLogin}>Volver al Login</button>
            </div>
            
        </div>

        
    )
}

export default Revisarproceso;