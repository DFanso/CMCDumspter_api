"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var mongoose = __importStar(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var errorMiddleware_1 = require("./middleware/errorMiddleware");
var auth_1 = __importDefault(require("./routes/auth"));
var adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
var articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
var incidentRoutes_1 = __importDefault(require("./routes/incidentRoutes"));
dotenv_1.default.config();
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
mongoose
    .connect(process.env.MONGODB_URI, { retryWrites: true, w: "majority" })
    .then(function () { return console.log("Connected to MongoDB"); })
    .catch(function (error) { return console.log("Error connecting to MongoDB:", error); });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
app.use("/api/auth", auth_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/article", articleRoutes_1.default);
app.use("/api/incident", incidentRoutes_1.default);
app.use(errorMiddleware_1.errorMiddleware);
var port = process.env.PORT;
app.listen(port, function () {
    console.log("Server running at ".concat(port));
});
