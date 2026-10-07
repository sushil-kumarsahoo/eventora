const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const protect = async (req, res, next) => {
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


module.exports = protect