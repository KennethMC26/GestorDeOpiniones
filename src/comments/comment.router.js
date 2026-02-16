import { Router } from 'express';
import { addComment, updateComment, deleteComment } from './comment.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

router.post('/', validateJWT, addComment);
router.put('/:id', validateJWT, updateComment);
router.delete('/:id', validateJWT, deleteComment);

export default router;