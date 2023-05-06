"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var adminController_1 = require("../controllers/adminController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = express_1.default.Router();
router.post("/addArticle", authMiddleware_1.authMiddleware, adminController_1.addArticle);
exports.default = router;
