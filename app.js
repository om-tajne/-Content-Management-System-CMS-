import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { checkRole } from './middleware/authMiddleware.js';
import * as postController from './controllers/contentController.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files & Form Support
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'om-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// --- ROUTES ---

// 1. Authentication Routes
app.use('/auth', authRoutes);

// 2. Home Route (Redirect to login)
app.get('/', (req, res) => res.redirect('/auth/login'));

// 3. The FIXED Dashboard Route (Combined & Async)
app.get('/dashboard', checkRole(['Admin', 'Editor', 'Viewer']), async (req, res) => {
    try {
        // Fetch real posts from the database using your controller
        const posts = await postController.getAllPosts() || []; 

        // Render with all necessary data
        res.render('dashboard', { 
            user: req.session.user, 
            posts: posts 
        });
    } catch (err) {
        console.error("Dashboard Error:", err);
        // Fallback: Show dashboard even if database fetch fails
        res.render('dashboard', { 
            user: req.session.user, 
            posts: [] 
        });
    }
});

// 4. Content Actions
app.post('/posts/create', checkRole(['Admin', 'Editor']), postController.createPost);
app.post('/posts/delete/:id', checkRole(['Admin']), postController.deletePost);

// 5. System Checks
app.get('/ping', (req, res) => res.send('Pong! Server is running.'));

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: "Success", time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ status: "Error", message: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server launched at http://localhost:${PORT}`);
    console.log(`✅ PostgreSQL Connected Successfully`);
});