import session from 'express-session';
import passport from 'passport';
// Ajustado según la estructura que me acabas de mostrar en la imagen
import initializePassport from './config/passport.config.js';

// Modules
import express from "express"
import cors from 'cors' 
import connection from "./db/connection.db.js"

// Router
import reportRouter from "./routes/reports.router.js"
import authRoutes from "./routes/authRoutes.js" 
import ofertasRouter from "./routes/ofertas.router.js" 
import habilidadesRouter from "./routes/habilidades.router.js"
import perfilRouter from "./routes/perfil.router.js"
import uploadRouter from './routes/upload.router.js'
import iaRouter from './routes/ia.routes.js'

// App
const app = express()
const PORT = process.env.PORT || 8000
const URL = `${process.env.URL}:${PORT}`

// 1. Cors CONFIGURADO para aceptar cookies
app.use(cors({
    origin: 'http://localhost:3000', // 
    credentials: true 
}))


app.use(express.json())

app.use(session({
    secret: 'clave_secreta_usm', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // false porque es localhost (http)
        maxAge: 1000 * 60 * 60 * 24 // 1 día de sesión
    }
}));

initializePassport(); 
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('/app/uploads')); //Hacemos pulica la carpeta de informes

// Routes
app.use("/api", reportRouter)
app.use("/api/", authRoutes)
app.use("/api/", ofertasRouter) 
app.use("/api/", habilidadesRouter)
app.use("/api/", perfilRouter)
app.use("/api/", uploadRouter)
app.use('/api', iaRouter)

async function handleConnection() {
    try {
        await connection.connect()
        console.log("Database connected.")
    }
    catch(e) {
        console.error("Error connecting to database:", e)
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} -> ${URL}`)
    handleConnection()
})
