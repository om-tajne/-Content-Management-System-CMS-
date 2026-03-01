import pool from '../config/db.js';

export const createPost = async (req, res) => {
    // 1. Map 'content' from the form to 'body' for the database
    const { title, content, image_url, video_url } = req.body;
    
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    const authorId = req.session.user.id;

    try {
        // 2. USING 'body' INSTEAD OF 'content'
        await pool.query(
            `INSERT INTO content_nodes (title, body, author_id, image_url, video_url) 
             VALUES ($1, $2, $3, $4, $5)`,
            [title, content, authorId, image_url, video_url]
        );
        res.redirect('/dashboard');
    } catch (err) {
        console.error("❌ Database Error:", err.message);
        res.status(500).send(`Failed to create content: ${err.message}`);
    }
};

// Also update your getAllPosts function to select 'body'
export const getAllPosts = async () => {
    try {
        const result = await pool.query(`
            SELECT id, title, body AS content, image_url, video_url, author_id, created_at 
            FROM content_nodes 
            ORDER BY created_at DESC
        `);
        return result.rows;
    } catch (err) {
        console.error("Error fetching content:", err);
        return [];
    }
};

// 3. DELETE CONTENT
export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM content_nodes WHERE id = $1', [id]);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("❌ Error deleting content:", err);
        res.status(500).send("Failed to delete content.");
    }
};