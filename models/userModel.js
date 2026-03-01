// FILE TO HANDLE SQL LOGIC
import pool from '../config/db.js';

const User = {
    // Find user for login
    findByEmail: async (email) => {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`, 
            [email]
        );
        return result.rows[0];
    },

    // Create a new user with a default role
    create: async (username, email, hashedPassword, role = 'Viewer') => {
        const result = await pool.query(
            `INSERT INTO users (username, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, role`,
            [username, email, hashedPassword, role]
        );
        return result.rows[0];
    }
};

export default User;