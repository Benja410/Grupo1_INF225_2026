import connection from "../db/connection.db.js";

export const obtenerHabilidades = async (req, res) => {
    try {
        const query = `
            SELECT id, nombre, categoria
            FROM Habilidades
            ORDER BY categoria, nombre;
        `;

        const resultado = await connection.query(query);

        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Error al obtener las habilidades de la BD:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener las habilidades." });
    }
};
