// routes/auth.js
const express = require('express');
const router = express.Router();
const sib = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { register, login } = require('../Controllers/authcontroller');
const User = require('../Models/User');

// Setup Brevo (Sendinblue) API client
const client = sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const sender = { email: 'your_email@domain.com', name: 'Movie App' };

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const apiInstance = new sib.TransactionalEmailsApi();
        const sendSmtpEmail = {
            to: [{ email }],
            sender,
            subject: 'Password Reset - Movie App',
            htmlContent: `<p>Click below to reset your password:</p>
                                        <a href="${resetLink}">${resetLink}</a>`,
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.json({ msg: 'Reset link sent to email' });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to send email' });
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();

        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        res.status(400).json({ msg: 'Invalid or expired token' });
    }
});

// Auth Routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
