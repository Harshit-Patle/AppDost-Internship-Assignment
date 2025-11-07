
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get the token from the request header
    // 'x-auth-token' is a common header name for this
    const token = req.header('x-auth-token');

    // 2. Check if no token is present
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' }); // 401 = Unauthorized
    }

    // 3. Verify the token
    try {
        // jwt.verify will decode the token
        // If it's valid, 'decoded' will contain our 'payload' (user.id and user.name)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Add the user from the payload to the request object
        // Now, any protected route can access 'req.user'
        req.user = decoded.user;

        // 5. Call 'next()' to proceed to the actual route
        next();
    } catch (err) {
        // This will run if the token is not valid
        res.status(401).json({ msg: 'Token is not valid' });
    }
};