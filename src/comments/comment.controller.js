import Comment from './comment.model.js';

export const addComment = async (req, res, next) => {
    try {
        const { text, postId } = req.body;
        const comment = new Comment({
            text,
            post: postId,
            author: req.user._id // Obtenido del token por validateJWT
        });
        await comment.save();
        res.status(201).json({ success: true, comment });
    } catch (err) { next(err); }
};

export const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const comment = await Comment.findById(id);

        if (!comment) return res.status(404).json({ msg: 'Comentario no encontrado' });

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'No tienes permiso para editar este comentario' });
        }

        comment.text = text;
        await comment.save();
        res.json({ success: true, message: 'Comentario actualizado', comment });
    } catch (err) { next(err); }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) return res.status(404).json({ msg: 'Comentario no encontrado' });

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'No tienes permiso para eliminar este comentario' });
        }

        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: 'Comentario eliminado' });
    } catch (err) { next(err); }
};