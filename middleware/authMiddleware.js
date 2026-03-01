export const checkRole = (roles) => {
    return (req, res, next) => {
        // 1. Check if user is even logged in
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        // 2. Check if the user's role is allowed to see this page
        if (roles.includes(req.session.user.role)) {
            return next(); // They are allowed! Continue to the page.
        }

        // 3. If they are logged in but have the wrong rank
        res.status(403).send("Access Denied: You do not have permission to view this page.");
    };
};