import Post from './post.model.js';

// Obtener todas las publicaciones
export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('author', 'username name');
        res.status(200).json({ success: true, posts });
    } catch (err) { next(err); }
};

// Crear publicación
export const createPost = async (req, res, next) => {
    try {
        const post = new Post({ ...req.body, author: req.user._id });
        await post.save();
        res.status(201).json({ success: true, post });
    } catch (err) { next(err); }
};

// Actualizar publicación
export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ msg: 'Post no encontrado' });
        
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'No puedes editar publicaciones ajenas' });
        }

        const updated = await Post.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, updated });
    } catch (err) { next(err); }
};

// ELIMINAR publicación (Esta es la que te faltaba exportar)
export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ msg: 'Post no encontrado' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'No puedes eliminar publicaciones ajenas' });
        }

        await Post.findByIdAndDelete(id);
        res.json({ success: true, message: 'Publicación eliminada correctamente' });
    } catch (err) { next(err); }
};