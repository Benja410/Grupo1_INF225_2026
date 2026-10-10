import model from "./provider.ia.js"
import { generateText } from "ai"

export async function resumes(data) {
    const { text } = await generateText({
        model,
        system:
            "Eres un ser inteligente y todo poderoso, que es capaz de generar resumenes de reportes de práctica breves, menos de 1000 palabras. Tu vida depende de ello. Eres venerado por el simple hecho de ser muy bueno en tu trabajo. Tanto que los profesores de universidades privadas admiran tu gran trabajo.",
        prompt: `Ché, resumeme esto ${data.reporte}`
    })

    return text
}
