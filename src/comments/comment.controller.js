import Comment from './comment.model.js';

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find().populate('author', 'username').populate('post', 'title');
        res.status(200).json({ success: true, comments });
    } catch (err) { next(err); }
};

// Agregar un comentario
export const addComment = async (req, res, next) => {
    try {
        const { text, postId } = req.body;
        const comment = new Comment({
            text,
            post: postId,
            author: req.user._id // Viene del validateJWT
        });
        await comment.save();
        res.status(201).json({ success: true, message: 'Comentario creado', comment });
    } catch (err) {
        next(err);
    }
};

// Editar un comentario (Solo el autor)
export const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const comment = await Comment.findById(id);

        if (!comment) return res.status(404).json({ msg: 'Comentario no encontrado' });

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'No puedes editar comentarios de otros' });
        }

        comment.text = text;
        await comment.save();
        res.json({ success: true, message: 'Comentario actualizado', comment });
    } catch (err) {
        next(err);
    }
};

// Eliminar un comentario (Esta es la que causaba el error)
export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) return res.status(404).json({ msg: 'Comentario no encontrado' });

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'No puedes eliminar comentarios de otros' });
        }

        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: 'Comentario eliminado correctamente' });
    } catch (err) {
        next(err);
    }
};