import express from 'express';
// Ensure this path is correct based on your folder structure
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Show Pages
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Handle Form Submissions
// These MUST match the names in your authController (register and login)
router.post('/register', authController.register); 
router.post('/login', authController.login);

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

export default router;