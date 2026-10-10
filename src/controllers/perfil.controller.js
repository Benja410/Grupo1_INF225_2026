import usersDB from "../db/classes/users.db.js";
// 1. IMPORTAR LA HERRAMIENTA DE GEOCODIFICACIÓN
import { obtenerCoordenadas } from "../utils/Geocodeo.js"; 

export const obtenerPerfil = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No autorizado. Inicia sesión primero." });
    }

    try {
        const rut = req.user.rut;
        const usuario = await usersDB.getUserById(rut);
        const habilidades = usuario ? await usersDB.getHabilidadesEstudiante(rut) : [];

        if (!usuario) {
            return res.status(200).json({
                rut: req.user.rut,
                correo: req.user.correo,
                nombre: req.user.nombre,
                tipo: req.user.tipo,
                habilidades: []
            });
        }

        return res.status(200).json({
            ...usuario,
            habilidades
        });
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener el perfil." });
    }
};

export const actualizarPerfil = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No autorizado. Inicia sesión primero." });
    }

    const { habilidades, direccion, telefono, distancia } = req.body;

    if (habilidades && !Array.isArray(habilidades)) {
        return res.status(400).json({ error: "El campo habilidades debe ser un array." });
    }

    try {
        if (req.user.tipo === 'Estudiante' && habilidades) {
            await usersDB.ensureEstudiante(req.user);
            await usersDB.updateHabilidadesEstudiante(req.user.rut, habilidades);
        }

        // -------------------------------------------------------------
        // 2. LÓGICA DE TRADUCCIÓN DE DIRECCIÓN A COORDENADAS
        // -------------------------------------------------------------
        let lat = null;
        let lon = null;

        if (direccion) {
            const coordenadas = await obtenerCoordenadas(direccion);
            if (coordenadas) {
                lat = coordenadas.latitud;
                lon = coordenadas.longitud;
            } else {
                console.warn(`No se encontraron coordenadas para la dirección: ${direccion}`);
            }
        }

        // 3. PASAR LAS COORDENADAS A TU CLASE DE BASE DE DATOS
        await usersDB.updateInfoPersonal(req.user.rut, {
            direccion,
            telefono,
            distancia,
            latitud: lat,   // <-- Enviamos la latitud
            longitud: lon   // <-- Enviamos la longitud
        });

        return res.status(200).json({ mensaje: "Perfil actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar el perfil:", error.mensaje);
        return res.status(500).json({ error: "Error interno del servidor al actualizar el perfil." });
    }
};