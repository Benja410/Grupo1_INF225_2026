import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai'; // Importamos Type para estructurar el JSON
import fs from 'fs';
import path from 'path';
import connection from '../db/connection.db.js'; 

const router = Router();

// Inicializamos Gemini con la API KEY guardada en tu archivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.get('/ia/resumen/:id_practica', async (req, res) => {
    const { id_practica } = req.params;

    try {
        // 1. Buscamos la ruta del archivo asociada a esta práctica en la base de datos
        const query = 'SELECT ruta_archivo FROM practica_en_proceso WHERE id_practica = $1';
        const resultado = await connection.query(query, [id_practica]);

        if (resultado.rows.length === 0 || !resultado.rows[0].ruta_archivo) {
            return res.status(404).json({ error: 'No se encontró un informe subido para esta práctica.' });
        }

        const rutaRelativa = resultado.rows[0].ruta_archivo; // Ejemplo: "/uploads/informe-123.pdf"
        
        // 2. Construimos la ruta absoluta dentro del volumen del contenedor Docker (/app/uploads)
        const nombreArchivo = rutaRelativa.replace('/uploads/', '');
        const rutaAbsolutaPDF = path.join('/app/uploads', nombreArchivo);

        // Validamos que el archivo realmente exista físicamente en el disco
        if (!fs.existsSync(rutaAbsolutaPDF)) {
            return res.status(404).json({ error: 'El archivo físico no se encuentra en el servidor.' });
        }

        // 3. Leemos el archivo PDF y lo transformamos a Base64 (así lo recibe el SDK de Gemini de forma directa)
        const pdfBuffer = fs.readFileSync(rutaAbsolutaPDF);
        const pdfBase64 = pdfBuffer.toString('base64');

        // 4. Llamamos a gemini-2.5-flash forzando una respuesta JSON con estructura predecible
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: pdfBase64
                    }
                },
                "Eres un asistente académico experto de la USM. Analiza minuciosamente el informe de práctica profesional adjunto. Extrae con la mayor precisión posible las horas de práctica registradas, las áreas o departamentos de la empresa donde trabajó el alumno, y elabora una síntesis directa de las actividades y proyectos que ejecutó durante su estadía."
            ],
            config: {
                // Configuramos el comportamiento para asegurar formato estructurado
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        rut_detectado: { 
                            type: Type.STRING, 
                            description: "El RUT del estudiante escrito dentro del documento PDF (ej: 12.345.678-9)." 
                        },
                        empresa_detectada: { 
                            type: Type.STRING, 
                            description: "Nombre de la empresa o institución donde se llevó a cabo la práctica." 
                        },
                        horas_detectadas: { 
                            type: Type.STRING, 
                            description: "Cantidad total de horas trabajadas o declaradas que se mencionen en el informe." 
                        },
                        resumen_ejecutivo: { 
                            type: Type.STRING, 
                            description: "Un texto fluido de un párrafo que actúe como resumen de contenido del informe, detallando proyectos, herramientas y aportes clave." 
                        }
                    },
                    required: ["rut_detectado", "empresa_detectada", "horas_detectadas", "resumen_ejecutivo"],
                }
            }
        });

        // 5. Transformamos el string JSON de Gemini en un objeto real de JavaScript
        const datosIA = JSON.parse(response.text);

        // 6. Respondemos con todo el objeto estructurado listo para tu frontend
        return res.status(200).json(datosIA);

    } catch (error) {
        console.error('Error al generar el resumen con IA:', error);
        return res.status(500).json({ error: 'Ocurrió un error al procesar el documento con Inteligencia Artificial.' });
    }
});

export default router;