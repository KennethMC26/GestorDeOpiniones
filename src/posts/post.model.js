import { Schema, model } from 'mongoose';

const postSchema = Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    },
    content: {
        type: String,
        required: [true, 'El contenido es obligatorio']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model('Post', postSchema);