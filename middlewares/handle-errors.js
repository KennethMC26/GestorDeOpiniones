export const errorHandler = (err, req, res, next) => { // <--- CORRECCIÓN: 4 parámetros obligatorios
    console.error(`Error in Admin Server: ${err.message}`);
    
    // Error de duplicado de Mongoose (Email o Username ya existen)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `${Object.keys(err.keyValue)[0]} ya existe`,
            error: 'DUPLICATE_VALUE',
        });
    }

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message,
        }));
        return res.status(400).json({ success: false, message: 'Error de validación', errors });
    }

    // Error por defecto
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
    });
};