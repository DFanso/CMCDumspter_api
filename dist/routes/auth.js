"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authController_1 = require("../controllers/authController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = express_1.default.Router();
router.post('/signup', authController_1.signUp);
router.post('/signin', authController_1.signIn);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
router.get('/profile', authMiddleware_1.authMiddleware, authController_1.getUserProfile);
exports.default = router;
