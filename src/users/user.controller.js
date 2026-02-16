import User from './user.model.js';
import bcryptjs from 'bcryptjs';
import { generateJWT } from '../../helpers/generate-jwt.js';
import { cloudinary } from '../../middlewares/file-uploader.js';

// LOGIN: Acceso con Email o Username
export const login = async (req, res) => {
    const { credential, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: credential }, { username: credential }]
        });

        if (!user || !user.status) {
            return res.status(400).json({ success: false, msg: 'Usuario no encontrado' });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, msg: 'Contraseña incorrecta' });
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            success: true,
            user,
            token
        });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Error en el servidor' });
    }
};

export const updateProfile = async (req, res) => {

    try {

        const { id } = req.params;

        const { oldPassword, newPassword, ...data } = req.body;

        const currentUser = await User.findById(id);



        if (newPassword) {

            if (!oldPassword) return res.status(400).json({ msg: 'Ingresa la contraseña anterior' });

            const valid = bcryptjs.compareSync(oldPassword, currentUser.password);

            if (!valid) return res.status(400).json({ msg: 'La contraseña anterior no coincide' });



            const salt = bcryptjs.genSaltSync();

            data.password = bcryptjs.hashSync(newPassword, salt);

        }



        if (req.file) {

            if (currentUser.profilePicture && currentUser.profilePicture !== 'users/default_user_pic') {

                const photoPath = currentUser.profilePicture.split('.')[0];

                const publicId = `opinionManager/${photoPath}`;

                await cloudinary.uploader.destroy(publicId);

            }

            const extension = req.file.path.split('.').pop();

            data.profilePicture = `${req.file.filename.substring(req.file.filename.indexOf('users/'))}.${extension}`;

        }



        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({ success: true, user });

    } catch (error) {

        res.status(400).json({ success: false, error: error.message });

    }
};

// REGISTRO: Guardado en DB y Cloudinary
export const register = async (req, res, next) => {
    try {
        const data = req.body;

        if (req.file) {
            data.profilePicture = req.file.path; // URL de Cloudinary
        }

        const user = new User(data);
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(data.password, salt);

        await user.save();
        res.status(201).json({ success: true, user });
    } catch (err) {
        next(err); // Va al errorHandler de 4 parámetros
    }
};