import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateRegister = [
    body('name', 'El nombre es obligatorio').notEmpty(),
    body('surname', 'El apellido es obligatorio').notEmpty(),
    body('username', 'El username es obligatorio').notEmpty(),
    body('email', 'Email inválido').isEmail(),
    body('password', 'Mínimo 6 caracteres').isLength({ min: 6 }),
    checkValidators
];

export const validateUpdate = [
    param('id', 'ID no válido').isMongoId(),
    body('username').optional().notEmpty(),
    checkValidators
];