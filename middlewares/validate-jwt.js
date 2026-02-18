import jwt from 'jsonwebtoken';
import User from '../src/users/user.model.js';

export const validateJWT = async (req, res, next) => {
    try {
        const token = req.header("x-token");

        if (!token) return res.status(401).json({ success: false, message: "No hay token" });

        const secret = process.env.SECRET_KEY || 'Llave_Secreta_Para_Opiniones_2026';
        const { uid } = jwt.verify(token, secret);

        const user = await User.findById(uid);
        if (!user || !user.status) return res.status(401).json({ message: "Usuario no válido" });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token no válido" });
    }
};