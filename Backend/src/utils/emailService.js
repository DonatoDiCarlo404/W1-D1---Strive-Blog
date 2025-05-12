const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (author) => {
    try {
        const msg = {
            to: author.email,
            from: process.env.SENDER_EMAIL,
            subject: 'Benvenuto su Strive Blog!',
            text: `Ciao ${author.name},\n\nBenvenuto su Strive Blog! Siamo felici di averti con noi.`,
            html: `<h1>Ciao ${author.name}</h1><p>Benvenuto su Strive Blog! Siamo felici di averti con noi.</p>`
        };
        await sgMail.send(msg);
        console.log('Email di benvenuto inviata');
    } catch (error) {
        console.error('Errore invio email:', error);
    }
};

const sendNewPostEmail = async (author, post) => {
    try {
        const msg = {
            to: author.email,
            from: process.env.SENDER_EMAIL,
            subject: 'Nuovo post pubblicato!',
            text: `Ciao ${author.name},\n\nIl tuo post "${post.title}" è stato pubblicato con successo!`,
            html: `<h1>Post Pubblicato!</h1><p>Ciao ${author.name},</p><p>Il tuo post "${post.title}" è stato pubblicato con successo!</p>`
        };
        await sgMail.send(msg);
        console.log('Email di conferma post inviata');
    } catch (error) {
        console.error('Errore invio email:', error);
    }
};

module.exports = { sendWelcomeEmail, sendNewPostEmail };