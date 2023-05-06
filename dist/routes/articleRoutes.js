"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var articleController_1 = require("../controllers/articleController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = express_1.default.Router();
router.get("/fetchArticle", authMiddleware_1.authMiddleware, articleController_1.fetchArticle);
exports.default = router;
