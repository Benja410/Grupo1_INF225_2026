import connection from "../connection.db.js"

class users {
    async getUserById(rut) {
        const query = `
            SELECT
                u.rut,
                u.nombre,
                u.tipo,
                ul.correo,
                e.a_paterno,
                e.a_materno,
                e.rol,
                e.direccion,
                e.telefono,
                e.distancia
            FROM Usuarios u
            JOIN Usuarios_loggeo ul ON ul.rut = u.rut
            JOIN Estudiante e ON e.rut = u.rut
            WHERE u.rut = $1;
        `

        const result = await connection.query(query, [rut])
        return result.rows[0] || null
    }

    async getHabilidadesEstudiante(rut) {
        const query = `
            SELECT h.id, h.nombre, h.categoria
            FROM Habilidades_Estudiante he
            JOIN Habilidades h ON h.id = he.id_habilidad
            WHERE he.rut_estudiante = $1
            ORDER BY h.categoria, h.nombre;
        `

        const result = await connection.query(query, [rut])
        return result.rows
    }

    async ensureEstudiante(user) {
        const estudiante = await connection.query('SELECT rut FROM Estudiante WHERE rut = $1', [user.rut])
        if (estudiante.rows.length > 0) {
            return true
        }

        const partesNombre = (user.nombre || '').trim().split(/\s+/).filter(Boolean)
        const aPaterno = partesNombre.length >= 2 ? partesNombre[partesNombre.length - 2] : 'Sin apellido'
        const aMaterno = partesNombre.length >= 1 ? partesNombre[partesNombre.length - 1] : 'Sin apellido'

        await connection.query(
            `INSERT INTO Estudiante (rut, a_paterno, a_materno, rol)
             VALUES ($1, $2, $3, $4)`,
            [user.rut, aPaterno, aMaterno, 'Sin rol']
        )

        return true
    }

    async updateInfoPersonal(rut, datos) {
        const { direccion, telefono, distancia, latitud, longitud } = datos;

        const query = `
            UPDATE Estudiante 
            SET direccion = $1, telefono = $2, distancia = $3, latitud = $4, longitud = $5
            WHERE rut = $6
        `;
        
        await connection.query(query, [direccion, telefono, distancia, latitud, longitud, rut]);
    }

    async updateHabilidadesEstudiante(rut, ids) {
        const client = await connection.connect()

        try {
            await client.query('BEGIN')
            await client.query('DELETE FROM Habilidades_Estudiante WHERE rut_estudiante = $1', [rut])

            for (const idHabilidad of ids) {
                await client.query(
                    `INSERT INTO Habilidades_Estudiante (rut_estudiante, id_habilidad)
                     VALUES ($1, $2)`,
                    [rut, idHabilidad]
                )
            }

            await client.query('COMMIT')
            return true
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    }

}

export default new users()
