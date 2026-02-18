import jwt from 'jsonwebtoken';

export const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        const secret = process.env.SECRET_KEY || 'Llave_Secreta_Para_Opiniones_2026';

        jwt.sign(payload, secret, { expiresIn: '4h' }, (err, token) => {
            if (err) reject('No se pudo generar el token');
            else resolve(token);
        });
    });
};