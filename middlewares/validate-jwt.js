import jwt from 'jsonwebtoken';
import User from '../src/users/user.model.js';

export const validateJWT = async (req, res, next) => {
    try {
        const token = req.header("x-token") || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No hay token en la petición"
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY || 'Key_De_Seguridad_Super_Secreta_123');

        const user = await User.findById(uid);

        if (!user || !user.status) {
            return res.status(401).json({
                success: false,
                message: "Token no válido - usuario no existe o está inactivo"
            });
        }

        req.user = user; // Seteamos el usuario para que el controlador sepa quién es
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Token no válido"
        });
    }
};