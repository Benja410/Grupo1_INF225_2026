import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

import connection from "../db/connection.db.js"
import { createHash, isValidHash } from "../utils/hash.js"
// IMPORTAMOS LA FUNCIÓN DE GEOCODIFICACIÓN (Asegúrate de que la ruta relativa sea correcta)
import { obtenerCoordenadas } from "../utils/Geocodeo.js"

const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "rut", passwordField: "password" }, async (req, username, password, done) => {
        try {
            // 1. Agregamos password y tipo_usuario a lo que extraemos del body
            const { rut, nombres, apellidos, correo, password, tipo_usuario, rol, direccion, telefono, distancia, resena } = req.body

            const userByRut = await connection.query('SELECT rut FROM Usuarios WHERE rut = $1', [rut])
            if (userByRut.rows.length > 0) {
                return done(null, false, { message: "Rut ya existente"})
            }

            const userByEmail = await connection.query('SELECT correo FROM Usuarios_loggeo WHERE correo = $1', [correo])
            if (userByEmail.rows.length > 0) {
                return done(null, false, { message: "Correo ya existente" })
            }

            const nombreCompleto = `${nombres} ${apellidos}`
            // 2. Usamos el tipo que venga del body, si no viene, asumimos Estudiante
            const tipo = tipo_usuario || 'Estudiante' 

            await connection.query(
                'INSERT INTO Usuarios (rut, nombre, tipo) VALUES ($1, $2, $3)',
                [rut, nombreCompleto, tipo]
            );

            // 3. Hasheamos la contraseña
            const hash = createHash(password)

            await connection.query(
                'INSERT INTO Usuarios_loggeo (rut, correo, contrasena) VALUES ($1, $2, $3)',
                [rut, correo, hash]
            );

            // 4. Si es empresa, la guardamos en su tabla para no romper las llaves foráneas
            if (tipo === 'Empresa') {
                await connection.query(
                    'INSERT INTO Empresa (rut, resena) VALUES ($1, $2)',
                    [rut, resena || 'No se ingresó reseña']
                );
            }

            if (tipo === 'Estudiante') {
                const partesApellido = (apellidos || '').trim().split(/\s+/).filter(Boolean)
                const aPaterno = partesApellido[0] || 'Sin apellido'
                const aMaterno = partesApellido.slice(1).join(' ') || 'Sin apellido'

                // --- LÓGICA DE GEOCODIFICACIÓN AÑADIDA AQUÍ ---
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
                // ----------------------------------------------

                // Se añaden latitud y longitud a la consulta
                await connection.query(
                    `INSERT INTO Estudiante (rut, a_paterno, a_materno, rol, direccion, telefono, distancia, latitud, longitud)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [rut, aPaterno, aMaterno, rol || 'Sin rol', direccion || null, telefono || null, distancia || null, lat, lon]
                );
            }

            return done(null, {
                rut,
                correo,
                nombre: nombreCompleto,
                tipo
            })
        }
        catch (e) {
            return done(e)
        }
    }))

    passport.use("login", new LocalStrategy(
        {
            usernameField: "correo",
            passwordField: "password"
        },
        async (correo, password, done) => {
            try {
                const result = await connection.query(
                    `SELECT ul.rut, ul.correo, ul.contrasena, u.nombre, u.tipo
                     FROM Usuarios_loggeo ul
                     JOIN Usuarios u ON u.rut = ul.rut
                     WHERE ul.correo = $1`,
                    [correo]
                )

                if (result.rows.length === 0) {
                    return done(null, false, { message: "Usuario no encontrado" })
                }

                const user = result.rows[0]
                const validPassword = isValidHash(password, user.contrasena)

                if (!validPassword) {
                    return done(null, false, { message: "Contrasena invalida" })
                }

                return done(null, {
                    rut: user.rut,
                    correo: user.correo,
                    nombre: user.nombre,
                    tipo: user.tipo
                })
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.rut)
    })

    passport.deserializeUser(async (rut, done) => {
        try {
            const result = await connection.query(
                `SELECT ul.rut, ul.correo, u.nombre, u.tipo
                 FROM Usuarios_loggeo ul
                 JOIN Usuarios u ON u.rut = ul.rut
                 WHERE ul.rut = $1`,
                [rut]
            )

            if (result.rows.length === 0) {
                return done(null, false)
            }

            return done(null, result.rows[0])
        } catch (error) {
            return done(error)
        }
    })
}

export default initializePassport