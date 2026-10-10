import { Router } from 'express'
import passport from 'passport'
import * as authController from '../controllers/authController.js'
import connection from '../db/connection.db.js'

// Fórmula de Haversine (Ponla al principio del archivo, después de los imports)
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1)); 
}

const router = Router()

router.post('/registro', (req, res, next) => {
  passport.authenticate('register', (error, user, info) => {
    if (error) {
      return next(error)
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || 'No se pudo registrar el usuario' })
    }

    req.user = user
    return authController.registrarConSesion(req, res, next)
  })(req, res, next)
})
//AQUÍ REGISTRO EMPRESA
router.post('/regempresa', (req, res, next) => {
  passport.authenticate('regempresa', (error, user, info) => {
    if (error) {
      return next(error)
    }
    if (!user){
      return res.status(401).json({ error: info?.message || 'No se puede registrar el usuario'})
    }
    req.user = user
    return authController.registrarConSesion(req, res, next)
  })(req, res, next)
})

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (error, user, info) => {
    if (error) {
      return next(error)
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || 'Credenciales invalidas' })
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError)
      }

      return authController.iniciarSesion(req, res, next)
    })
  })(req, res, next)
})

router.post('/logout', authController.cerrarSesion);
router.get('/session', authController.sesionActual);

// Encargado
router.get('/encargado/resumen', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Encargado') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    const rutEncargado = req.user.rut;

    try {

        const query = `
            SELECT 
                COUNT(*) AS total_postulaciones,
                COUNT(CASE WHEN estado = 'Enviado para revisar' THEN 1 END) AS pendientes,
                COUNT(CASE WHEN estado = 'Aprobada' OR estado = 'Rechazada' THEN 1 END) AS revisadas
            FROM practica_en_proceso
            WHERE rut_supervisor = $1
        `;
        
        const { rows } = await connection.query(query, [rutEncargado]);
        
        res.json({
            alumnosPostulados: parseInt(rows[0].total_postulaciones) || 0,
            pendientes: parseInt(rows[0].pendientes) || 0,
            revisadas: parseInt(rows[0].revisadas) || 0
        });

    } catch (error) {
        console.error("Error al obtener resumen de KPIs:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/encargado/postulaciones', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Encargado') {
        return res.status(403).json({ error: "Acceso denegado." });
    }

    try {
        const rutSupervisor = req.user.rut;
        const query = `
            SELECT 
                pep.rut AS rut_estudiante,
                u_est.nombre AS nombre_estudiante,
                p.id AS id_practica,
                p.cargo,
                p.cant_horas,
                u_emp.nombre AS nombre_empresa,
                pep.estado,
                pep.ruta_archivo
            FROM practica_en_proceso pep
            JOIN usuarios u_est ON pep.rut = u_est.rut
            JOIN practica p ON pep.id_practica = p.id
            JOIN usuarios u_emp ON p.rut_empresa = u_emp.rut
            WHERE pep.rut_supervisor = $1
        `;
        
        const { rows } = await connection.query(query, [rutSupervisor]);
        res.json(rows);

    } catch (error) {
        console.error("Error obteniendo postulaciones:", error);
        res.status(500).json({ error: "Error al cargar las postulaciones." });
    }
});

// Estudiante

router.post('/estudiante/postular', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Estudiante') {
        return res.status(403).json({ error: "Acceso denegado. Solo estudiantes pueden postular." });
    }

    const rutEstudiante = req.user.rut;
    const { id_practica } = req.body;

    try {
        const checkQuery = 'SELECT * FROM practica_en_proceso WHERE rut = $1 AND id_practica = $2';
        const { rowCount } = await connection.query(checkQuery, [rutEstudiante, id_practica]);

        if (rowCount > 0) {
            return res.status(400).json({ error: "Ya te encuentras postulado a esta práctica." });
        }
        const insertQuery = `
            INSERT INTO practica_en_proceso (rut, id_practica, rut_supervisor, estado)
            SELECT $1, $2, rut_supervisor, 'Pendiente'
            FROM practica 
            WHERE id = $2
            RETURNING *;
        `;
        
        await connection.query(insertQuery, [rutEstudiante, id_practica]);

        res.json({ mensaje: "Postulación exitosa" });
    } catch (error) {
        console.error("Error al postular:", error);
        res.status(500).json({ error: "Error interno al procesar la postulación." });
    }
});

router.get('/estudiante/mis-postulaciones-ids', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Estudiante') {
        return res.json([]); 
    }

    try {
        const query = 'SELECT id_practica FROM practica_en_proceso WHERE rut = $1';
        const { rows } = await connection.query(query, [req.user.rut]);
        const idsPostulados = rows.map(row => row.id_practica);
        res.json(idsPostulados);

    } catch (error) {
        console.error("Error obteniendo IDs de postulaciones:", error);
        res.status(500).json({ error: "Error interno" });
    }
});

router.get('/home', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No autorizado. Inicia sesión primero." });
    }

    const { rut, tipo } = req.user;

    try {
        if (tipo === 'Empresa') {
            const query = 'SELECT * FROM practica WHERE rut_empresa = $1';
            const { rows } = await connection.query(query, [rut]);
            return res.json(rows);
            
        } else if (tipo === 'Encargado') {
            const query = 'SELECT * FROM practica WHERE rut_supervisor = $1';
            const { rows } = await connection.query(query, [rut]);
            return res.json(rows);
            
        } else if (tipo === 'Estudiante') {
            const query = `
                SELECT 
                    p.id,
                    p.cargo,
                    p.descripcion,
                    p.modalidad,
                    p.ubicacion,
                    p.cant_horas,
                    p.remuneracion,
                    pep.estado,
                    u.nombre AS nombre_empresa
                FROM practica_en_proceso pep
                JOIN practica p ON pep.id_practica = p.id
                JOIN usuarios u ON p.rut_empresa = u.rut
                WHERE pep.rut = $1
            `;
            const { rows } = await connection.query(query, [rut]);
            return res.json(rows);
        }
        return res.json([]);

    } catch (error) {
        console.error("Error en /home:", error);
        res.status(500).json({ error: "Error interno al cargar el panel de control." });
    }
});

// --- 1. RESUMEN KPIs EMPRESA ---
router.get('/empresa/resumen', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Empresa') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        const rutEmpresa = req.user.rut;
        
        // Contamos cuántas postulaciones pendientes tienen sus ofertas
        const queryPostulando = `SELECT COUNT(*) FROM practica_en_proceso pep JOIN practica p ON pep.id_practica = p.id WHERE p.rut_empresa = $1 AND pep.estado = 'Pendiente'`;
        // Contamos el total de prácticas que ha publicado
        const queryAbiertas = `SELECT COUNT(*) FROM practica WHERE rut_empresa = $1`;
        // Contamos a cuántos alumnos ya han aceptado
        const queryCerradas = `SELECT COUNT(*) FROM practica_en_proceso pep JOIN practica p ON pep.id_practica = p.id WHERE p.rut_empresa = $1 AND pep.estado = 'Aceptado'`;

        const r1 = await connection.query(queryPostulando, [rutEmpresa]);
        const r2 = await connection.query(queryAbiertas, [rutEmpresa]);
        const r3 = await connection.query(queryCerradas, [rutEmpresa]);

        res.json({
            estudiantesPostulando: parseInt(r1.rows[0].count) || 0,
            practicasAbiertas: parseInt(r2.rows[0].count) || 0,
            practicasCerradas: parseInt(r3.rows[0].count) || 0
        });
    } catch (error) {
        console.error("Error en resumen empresa:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// --- 2. VER POSTULANTES (VISTA EMPRESA) ---
router.get('/empresa/postulantes', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Empresa') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        const query = `
            SELECT 
                pep.rut AS rut_estudiante,
                u.nombre AS nombre_estudiante,
                p.id AS id_practica,
                p.cargo,
                pep.estado
            FROM practica_en_proceso pep
            JOIN practica p ON pep.id_practica = p.id
            JOIN usuarios u ON pep.rut = u.rut
            WHERE p.rut_empresa = $1
        `;
        const { rows } = await connection.query(query, [req.user.rut]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo postulantes" });
    }
});

// --- 3. ACEPTAR/RECHAZAR POSTULANTE ---
router.put('/empresa/evaluar-postulante', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Empresa') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    const { rut_estudiante, id_practica, nuevo_estado } = req.body;

    try {
        const query = `
            UPDATE practica_en_proceso 
            SET estado = $1 
            WHERE rut = $2 AND id_practica = $3 
            RETURNING *;
        `;
        await connection.query(query, [nuevo_estado, rut_estudiante, id_practica]);
        res.json({ mensaje: `Estudiante ${nuevo_estado} exitosamente.` });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado" });
    }
});

export default router

// Ruta de Filtrado
router.get('/ofertas/filtradas', async (req, res) => {
    if (!req.isAuthenticated() || req.user.tipo !== 'Estudiante') {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    try {
        const rutEstudiante = req.user.rut;

        const queryEst = 'SELECT latitud, longitud, distancia AS radio_deseado FROM estudiante WHERE rut = $1';
        const { rows: estRows } = await connection.query(queryEst, [rutEstudiante]);
        
        if (estRows.length === 0) return res.status(404).json({ error: "Estudiante no encontrado" });
        
        const estLat = estRows[0].latitud;
        const estLon = estRows[0].longitud;
        const radioDeseado = parseFloat(estRows[0].radio_deseado) || 15; 

        const queryOfertas = `
            SELECT p.id, p.cargo, p.descripcion, p.ubicacion, p.modalidad, p.latitud, p.longitud, u.nombre AS nombre_empresa
            FROM practica p
            JOIN usuarios u ON p.rut_empresa = u.rut
        `;
        const { rows: ofertas } = await connection.query(queryOfertas);

        const resultado = { cercanas: [], misma_region: [], lejanas: [] };

        ofertas.forEach(oferta => {
            if (oferta.modalidad === 'Remoto') {
                oferta.distancia_km = 0;
                resultado.cercanas.push(oferta);
                return;
            }

            const distanciaRealkm = calcularDistanciaKm(estLat, estLon, oferta.latitud, oferta.longitud);

            if (distanciaRealkm === null) {
                oferta.distancia_km = 'Desconocida';
                resultado.lejanas.push(oferta);
                return;
            }

            oferta.distancia_km = distanciaRealkm;

            if (distanciaRealkm <= radioDeseado) {
                resultado.cercanas.push(oferta);
            } else if (distanciaRealkm <= 100) {
                resultado.misma_region.push(oferta);
            } else {
                resultado.lejanas.push(oferta);
            }
        });

        resultado.cercanas.sort((a, b) => a.distancia_km - b.distancia_km);
        resultado.misma_region.sort((a, b) => a.distancia_km - b.distancia_km);

        res.json(resultado);

    } catch (error) {
        console.error("Error filtrado GPS:", error);
        res.status(500).json({ error: "Error en el cálculo geoespacial." });
    }
});