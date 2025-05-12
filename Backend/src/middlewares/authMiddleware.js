const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Token mancante' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.author = decoded;
            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Token scaduto, effettua nuovamente il login',
                    expired: true
                });
            }
            throw jwtError;
        }
    } catch (error) {
        console.error('Errore nella verifica del token:', error);
        res.status(401).json({ message: 'Token non valido' });
    }
};

module.exports = verifyToken;