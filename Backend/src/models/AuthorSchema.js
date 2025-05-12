const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Crea lo schema per gli autori
const authorSchema = new mongoose.Schema({
    nome: { type : 'string', required : true },
    cognome: { type: 'string', required: true },
    email: { type: 'string', required: true },
    password: { type: 'string', required: function() {
            return !this.googleId;
        } },
    dataDiNascita: { type: 'string', required: true },
    avatar: { type: 'string', required: true, default: function() {
        return 'https://ui-avatars.com/api/?name=' + this.nome + '+' + this.cognome
    } },
    googleId: { type: 'string', sparse: true }
})

// Hash password
authorSchema.pre('save', async function(next) {
    if (this.isModified('password') && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const authorModel = mongoose.model('Author', authorSchema)
module.exports = authorModel