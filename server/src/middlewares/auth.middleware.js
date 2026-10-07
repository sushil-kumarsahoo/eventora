const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authUser = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
        try {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({
                    message: "Not authorized, user not found",
                });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                message: "Not authorized, token failed",
            });
        }
    } else {
        res.status(401).json({
            message: "Not authorized, no token",
        });
    }
};


const authAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { authUser, authAdmin };


