export const iniciarSesion = async(req, res) =>{
    req.session.usuario = {
        rut: req.user.rut,
        correo: req.user.correo,
        nombre: req.user.nombre,
        tipo: req.user.tipo
    }

    req.session.save((error) => {
        if (error) {
            return res.status(500).json({ error: "No se pudo iniciar sesion" })
        }

        return res.status(200).json({
            mensaje: "Sesion iniciada",
            usuario: req.user
        })
    })
}

export const registrarConSesion = async (req, res) => {
    return res.status(201).json({
        mensaje: "Usuario registrado",
        usuario: req.user
    })
}

export const cerrarSesion = async (req, res) => {
    req.logout((logoutError) => {
        if (logoutError) {
            return res.status(500).json({ error: "No se pudo cerrar sesion" })
        }

        req.session.destroy((sessionError) => {
            if (sessionError) {
                return res.status(500).json({ error: "No se pudo destruir la sesion" })
            }

            res.clearCookie("connect.sid")
            return res.status(200).json({ mensaje: "Sesion cerrada" })
        })
    })
}

export const sesionActual = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No hay sesion activa" })
    }

    return res.status(200).json({ usuario: req.user })
}
