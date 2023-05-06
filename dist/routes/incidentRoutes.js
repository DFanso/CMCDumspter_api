"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var incidentController_1 = require("../controllers/incidentController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var router = express_1.default.Router();
router.post("/createIncident", authMiddleware_1.authMiddleware, incidentController_1.createIncident);
router.get("/getAllIncidents", authMiddleware_1.authMiddleware, incidentController_1.getAllIncidents);
router.get("/:id", authMiddleware_1.authMiddleware, incidentController_1.getIncidentById);
exports.default = router;
