const express = require('express')
const router = express.Router()
const Author = require('../models/AuthorSchema')
const BlogPost = require('../models/BlogPostSchema')
const uploadMiddleware = require('../middlewares/uploadMiddleware')
const { sendWelcomeEmail } = require('../utils/emailService')
const verifyToken = require('../middlewares/authMiddleware')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('passport')

// POST per il login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const author = await Author.findOne({ email });

        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }

        const isPasswordValid = await bcrypt.compare(password, author.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        const token = jwt.sign(
            { id: author._id, email: author.email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log('Generated token payload:', { id: author._id, email: author.email });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET autore loggato
router.get('/me', verifyToken, async (req, res) => {
    try {
        console.log('Author ID from token:', req.author.id);
        const author = await Author.findById(req.author.id).select('-password');
        
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }

        res.json(author);
    } catch (error) {
        console.error('Error in /me route:', error);
        res.status(500).json({ 
            message: 'Errore nel recupero dati utente',
            error: error.message 
        });
    }
});

// GET per ottenere gli autori
router.get('/', verifyToken, async (req, res) => {
    try {
        if (!req.query.page && !req.query.limit) {
            const authors = await Author.find()
            return res.json({
                totalAuthors: authors.length,
                authors
            })
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const totalAuthors = await Author.countDocuments();
        const totalPages = Math.ceil(totalAuthors / limit);

        const authors = await Author.find()
            .limit(limit)
            .skip(skip);

        res.json({
            currentPage: page,
            totalPages,
            totalAuthors,
            authors
        });
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// GET per ottenere un singolo autore

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (author) {
            res.json(author)
        } else {
            res.status(404).json({ message: 'Autore non trovato'})
        }
    } catch (error) {
        res.status(500).json( { message: error.message})
    }
})

// GET per ottenere i post di un autore

router.get('/:id/blogPosts', verifyToken, async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato'})
        }
        const posts = await BlogPost.find({ author: author.email })

        res.json({
            author: {
                nome: author.nome,
                cognome: author.cognome,
                email: author.email
            },
            totalPosts: posts.length,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// POST per creare un nuovo autore
router.post('/', async (req, res) => {
    try {
        // Verifica se l'email esiste già
        const existingAuthor = await Author.findOne({ email: req.body.email });
        if (existingAuthor) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        // Cripta la password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Crea il nuovo autore con la password criptata
        const newAuthor = new Author({
            ...req.body,
            password: hashedPassword,
            avatar: req.body.avatar || 'https://ui-avatars.com/api/?name=' + req.body.nome + '+' + req.body.cognome
        });

        const savedAuthor = await newAuthor.save();

        // Invia email di benvenuto
        await sendWelcomeEmail(savedAuthor);

        // Rimuovi la password dalla risposta
        const authorResponse = savedAuthor.toObject();
        delete authorResponse.password;

        res.status(201).json(authorResponse);
    } catch (error) {
        console.error('Error creating author:', error);
        res.status(500).json({ 
            message: 'Errore nella creazione dell\'autore',
            error: error.message 
        });
    }
});


// PUT per aggiornare un autore esistente

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (author) {
            Object.keys(req.body).forEach(key => {
                author[key] = req.body[key]
            })
            const updatedAuthor = await author.save()
            res.json(updatedAuthor)
        } else {
            res.status(404).json({ message: 'Autore non trovato'})
        }
    } catch (error) {
        res.status(400).json ({ message: error.message})
    }
})

// DELETE per eliminare un autore

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (author) {
            await author.deleteOne()
            res.json({ message: 'Autore eliminato con successo'})
        } else {
            res.status(404).json({ message: 'Autore non trovato'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// PATCH per aggiornare l'avatar di un autore
router.patch('/:id/avatar', verifyToken, uploadMiddleware, async (req, res) => {
    try {
        console.log('Request received:', {
            file: req.file,
            params: req.params,
            body: req.body
        });

        if (!req.file) {
            return res.status(400).json({ message: 'Nessun file caricato' });
        }

        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }

        author.avatar = req.file.path;
        await author.save();

        res.json({
            message: 'Avatar aggiornato con successo',
            avatar: author.avatar
        });
    } catch (error) {
        console.error('Route Error:', error);
        res.status(500).json({ 
            message: 'Errore nell\'aggiornamento dell\'avatar',
            error: error.message 
        });
    }
});

//GET iniziale Google OAuth
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

// GET per la callback OAuth
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login',
    session: false 
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.redirect(`http://localhost:5173/oauth-callback?token=${token}`);
  }
);

module.exports = router