const cloudinary = require('cloudinary').v2;

// Configurazione di Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Debug
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
});


module.exports = { cloudinary }