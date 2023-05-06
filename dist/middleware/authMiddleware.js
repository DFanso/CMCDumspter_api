"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authMiddleware = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        return next({ status: 401, message: "No token provided." });
    }
    var parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return next({ status: 401, message: "Token error." });
    }
    var scheme = parts[0], token = parts[1];
    if (!/^Bearer$/i.test(scheme)) {
        return next({ status: 401, message: "Token malformatted." });
    }
    try {
        var payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.currentUser = payload;
        console.log(payload.id);
        req.body.id = payload.id;
        next();
    }
    catch (err) {
        return next({ status: 401, message: "Invalid token." });
    }
};
exports.authMiddleware = authMiddleware;
