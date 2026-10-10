import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir= '/app/uploads';//Ruta a la carpeta para los informes

//Crea la carpeta si no existe
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        //Al nombre del archivo le agregamos la hora para que no se repitan los nombres (precaución)
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

export const upload = multer ({
    storage: storage,
    limits: {fileSize: 25 * 1024 * 1024} //Máximo 25 Mb
});