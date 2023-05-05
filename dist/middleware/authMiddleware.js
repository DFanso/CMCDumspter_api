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
        res.status(401).send({ message: 'No token provided.' });
        return;
    }
    var parts = authHeader.split(' ');
    if (parts.length !== 2) {
        res.status(401).send({ message: 'Token error.' });
        return;
    }
    var scheme = parts[0], token = parts[1];
    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).send({ message: 'Token malformatted.' });
        return;
    }
    try {
        var payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.currentUser = payload;
        next();
    }
    catch (err) {
        res.status(401).send({ message: 'Invalid token.' });
    }
};
exports.authMiddleware = authMiddleware;
