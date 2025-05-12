const mongoose = require('mongoose');

// Creazione dello schema per i commenti
const commentSchema = new mongoose.Schema({
    author: { type: 'string', required: true },
    content: { type: 'string', required: true }
})

// Creazione dello schema per i post del blog
const blogPostSchema = new mongoose.Schema({
    category: { type: 'string', required: true },
    title: { type: 'string', required: true },
    cover: { type: 'string', required: true },
    readTime: { 
        value: { type: 'number', required: true },
        unit: { type: 'string', required: true }
    },
    author: { type: 'string', required: true },
    content: { type: 'string', required: true },
    comments: [commentSchema]
})

const BlogPostModel = mongoose.model('BlogPost', blogPostSchema)
module.exports = BlogPostModel