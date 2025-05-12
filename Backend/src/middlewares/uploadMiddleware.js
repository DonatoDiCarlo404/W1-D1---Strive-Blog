const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utils/cloudinary');

// Configurazione dello storage per multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: (req, file) => {
            return file.fieldname === 'avatar' ? 'authors' : 'blog-covers';
        },
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
});

// Creazione del middleware multer
const uploadAvatar = multer({ storage }).single('avatar');
const uploadCover = multer({ storage }).single('cover');


// Middleware per la gestione degli errori
const uploadMiddleware = (req, res, next) => {
    const upload = req.path.includes('avatar') ? uploadAvatar : uploadCover;

    upload(req, res, (err) => {
        if (err) {
            console.error('Errore durante il caricamento:', err);
            return res.status(400).json({ 
                message: 'Errore durante il caricamento del file',
                error: err.message
            });
        }
        next();
    });
};
 

module.exports = uploadMiddleware
