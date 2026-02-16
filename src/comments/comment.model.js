import { Schema, model } from 'mongoose';

const commentSchema = Schema({
    text: {
        type: String,
        required: [true, 'El comentario no puede estar vacío'],
        trim: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default model('Comment', commentSchema);