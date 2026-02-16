import { Router } from 'express';
import { createPost, updatePost, deletePost, getPosts } from './post.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

// Rutas públicas
router.get('/', getPosts);

// Rutas protegidas (Requieren Token)
router.post('/', validateJWT, createPost);
router.put('/:id', validateJWT, updatePost);
router.delete('/:id', validateJWT, deletePost); // <--- Ahora ya encontrará la función

export default router;