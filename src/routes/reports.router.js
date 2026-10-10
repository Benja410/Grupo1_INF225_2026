import { Router } from "express";
import * as reportController from "../controllers/reports.controller.js";


const router = Router()

router.post(
    "/informes/resumir",
    reportController.generateResume
)

router.put("/practica/evaluar", reportController.evaluarPractica)

export default router