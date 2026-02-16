import { Router } from 'express';
import { register, login, updateProfile } from './user.controller.js';
import { validateRegister, validateUpdate } from '../../middlewares/user-validators.js';
import { uploadUserImage } from '../../middlewares/file-uploader.js';
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js';

const router = Router();

// Login - JSON
router.post('/login', login);

// Registro - Form-Data (incluye imagen)
router.post(
    '/register',
    uploadUserImage.single('image'), 
    cleanupUploadedFileOnFinish,
    validateRegister,
    register
);

// Actualización - Form-Data
router.put(
    '/:id',
    uploadUserImage.single('image'),
    validateUpdate,
    updateProfile
);

export default router;