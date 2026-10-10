import  reports from "../db/classes/reports.db.js"
import connection from "../db/connection.db.js"
import { resumes } from "../services/resumes/main.resumes.js"

const reportesDB = reports

export const generateResume = async (req, res) => {
    let { idReporte } = req.body

    if (!idReporte) {
        return res.status(400).json({
            status: "Error",
            message: "Falta información."
        })
    }

    try {
        let reporte = await reportesDB.getReportById(idReporte)

        if (!reporte || reporte?.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Reporte de usuario no encontrado"
            })
        }

        const resumen = await resumes(reporte)

        return res.status(200).json({
            status: "Success",
            payload: {
                text: resumen
            }
        })
    }
    catch(e) {
        console.error(e)
        return res.status(500).json({
            status: "Error",
            message: "Algo salió mal."
        })
    }
}

export const evaluarPractica = async (req, res) =>{
    const {id_practica, rut, estado} = req.body;

    try{

        const evaluar = await connection.query(`
        UPDATE practica_en_proceso
        SET estado = $1
        WHERE id_practica = $2
        AND rut = $3    
        RETURNING *;
        `, [estado, id_practica, rut]);

        return res.status(200).json(evaluar.rows);
    } catch (error) {
        console.error("Error al evaluar la practica", error);
        return res.status(500).json({ error: "Error interno del servidor al evaluar la practica." });
    }
};
