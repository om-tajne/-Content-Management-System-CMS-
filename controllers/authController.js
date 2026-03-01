import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // 2. Save to DB (Default to 'Viewer' if no role is sent)
        await User.create(username, email, hashedPassword, role || 'Viewer');
        
        // 3. Success! Go to login
        res.redirect('/auth/login');
    } catch (err) {
        console.error("❌ REGISTRATION ERROR:", err.message);
        res.status(500).send(`Registration failed: ${err.message}`);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await User.findByEmail(email);

        // 2. If user exists, check password
        if (user && await bcrypt.compare(password, user.password)) {
            // 3. Create Session
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role // Admin, Editor, or Viewer
            };
            res.redirect('/dashboard');
        } else {
            res.status(401).send("Invalid email or password.");
        }
    } catch (err) {
        console.error("❌ LOGIN ERROR:", err.message);
        res.status(500).send("An error occurred during login.");
    }
};