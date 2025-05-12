const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPostSchema');
const Author = require('../models/AuthorSchema');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// GET per tutti i post
router.get('/', async (req, res) => {
    try {
        // Modifica per cercare i post in base al titolo
        if (req.query.title) {
            const titlePost = new RegExp(req.query.title, 'i');
            const posts = await BlogPost.find({ title: titlePost})
            return res.json({
                totalPosts: posts.length,
                posts
            })
        }
        // Modifica per la paginazione
        if(!req.query.page && !req.query.limit) {
            const posts = await BlogPost.find()
            return res.json({
                totalPosts: posts.length,
                posts
            })
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const totalPosts = await BlogPost.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);


        const posts = await BlogPost.find()
            .limit(limit)
            .skip(skip);
            
        res.json({
            currentPage: page,
            totalPages,
            totalPosts,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// GET per un singolo post
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
        if (post) {
            res.json(post)
        } else {
            res.status(404).json({ message: 'Post inesistente!' });
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// POST per creare un nuovo post
router.post('/', async (req, res) => {
    try {
        const author = await Author.findOne({ email: req.body.author })
        if (!author) {
            return res.status(400).json({ message: 'Autore non trovato!' })
        }

        const blogPost = new BlogPost({
            category: req.body.category,
            title: req.body.title,
            cover: req.body.cover,
            readTime: {
                value: req.body.readTime.value,
                unit: req.body.readTime.unit
            },
            author: req.body.author,
            content: req.body.content
        })

        const newBlogPost = await blogPost.save()
        res.status(201).json(newBlogPost)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// PUT per modificare un post esistente
router.put('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
        if (post) {
            Object.keys(req.body).forEach(key => {
                if (key === 'readTime') {
                    post.readTime.value = req.body.readTime.value
                    post.readTime.unit = req.body.readTime.unit
                } else {
                    post[key] = req.body[key]
                }
        })
        const updatedPost = await post.save()
        res.json(updatedPost)
    } else {
        res.status(404).json({ message: 'Post inesistente!' });
    }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// DELETE per eliminare un post
router.delete('/:id', async (req,res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
        if (post) {
            await post.deleteOne()
            res.json({ message: 'Post eliminato con successo!' });
        } else {
            res.status(404).json({ message: 'Post inesistente!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// PATCH per caricare la cover
router.patch('/:id/cover', uploadMiddleware, async (req, res) => {
    try {
        console.log('Richiesta cover:', {
            file: req.file,
            params:req.params
        });

        if (!req.file) {
            return res.status(400).json({ message: 'Nessun file caricato' });
        }

        console.log('Cerco il post con ID:', req.params.id);

        const blogPost = await BlogPost.findById(req.params.id);
        console.log('Post trovato:', blogPost);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post inesistente!' });
        }

        blogPost.cover = req.file.path;
        await blogPost.save();

        res.json({
            message: 'Cover caricata con successo!',
            cover: blogPost.cover
        })
    } catch (error) {
        console.log('Errore caricamento:', error);
        res.status(500).json({
            message: 'Errore caricamento della cover',
            error: error.message});
    }
})

// GET per ottenere i commenti di un post
router.get('/:id/comments', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post inesistente!' });
        }

        res.json({
            postTitle: blogPost.title,
            totalComments: blogPost.comments.length,
            comments: blogPost.comments
        });
    } catch (error) {
        console.error('Errore nel recupero dei commenti:', error);
        res.status(500).json({ 
            message: 'Errore nel recupero dei commenti',
            error: error.message
        });
    }
})

// GET per ottenere un singolo commento
router.get('/:id/comments/:commentId', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post inesistente!' });
        }

        const comment = blogPost.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Commento inesistente!' });
        }

        res.json({
            postTitle: blogPost.title,
            comment: comment
        });
    } catch (error) {
        console.error('Errore nel recupero del commento:', error);
        res.status(500).json({ 
            message: 'Errore nel recupero del commento',
            error: error.message
        });
    }
})

// POST per aggiungere un commento
router.post('/:id/comments', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post inesistente!' });
        }

        const newComment = {
            author: req.body.author,
            content: req.body.content
        };

        blogPost.comments.push(newComment);
        await blogPost.save();

        res.status(201).json({
            message: 'Commento aggiunto con successo!',
            comment: newComment
        });
    } catch (error) {
        console.error('Errore nel salvataggio del commento:', error);
        res.status(500).json({ 
            message: 'Errore nel salvataggio del commento',
            error: error.message
        });
    }
})

// PUT per modificare un commento
router.put('/:id/comments/:commentId', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post inesistente!' });
        }

        const comment = blogPost.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Commento inesistente!' });
        }

        comment.author = req.body.author || comment.author;
        comment.content = req.body.content || comment.content;

        await blogPost.save();

        res.json({
            message: 'Commento modificato con successo!',
            comment: comment
        });
    } catch (error) {
        console.error('Errore nella modifica del commento:', error);
        res.status(500).json({ 
            message: 'Errore nella modifica del commento',
            error: error.message
        });
    }
})

// DELETE per eliminare un commento
router.delete('/:id/comments/:commentId', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Post inesistente!' });
        }

        const comment = blogPost.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Commento inesistente!'});
        }

        comment.deleteOne();
        await blogPost.save();

        res.json({
            message: 'Commento eliminato con successo!',
            deletedComment: comment
        });
    } catch (error) {
        console.error('Errore nell\'eliminazione del commento:', error);
        res.status(500).json({ 
            message: 'Errore nell\'eliminazione del commento',
            error: error.message
        });
    }
})

module.exports = router;