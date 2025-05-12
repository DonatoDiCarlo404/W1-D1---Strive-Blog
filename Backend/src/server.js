require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
require('./config/passport')
const authorsRouter = require('./routes/authorsRoutes')
const blogPostRouter = require('./routes/blogPostRoutes')
const authRoutes = require('./routes/authRoutes')



const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://strive-blog-frontend-8pjhhu59j-donatodicarlos-projects.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) 

// Configurazione sessione
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 
    }
}))

// Inizializza Passport
app.use(passport.initialize())
app.use(passport.session())

// Error middleware
app.use((err, req, res, next) => {
    console.error('Detailed Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        file: req.file
    });
    
    res.status(500).json({ 
        message: 'Errore interno del server',
        error: err.message, 
        path: req.path
    });
});

// Routes per gli autori
app.get('/', (req, res) => {
    res.json({ message: 'Benvenuto in Strive Blog'})
})
app.use('/auth', authRoutes)
app.use('/authors', authorsRouter)
app.use('/blogPosts', blogPostRouter)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});


// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connesso a MongoDB')
        app.listen(PORT, () => {
            console.log('Server aperto sulla porta 3001')
        })
    })
    .catch(err => console.error('Errore di connessione a MongoDB:', err))