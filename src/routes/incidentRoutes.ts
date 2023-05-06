import express from "express";
import {
  createIncident,
  getIncidentById,
  getAllIncidents,
  deleteIncidentByID,
  updateIncidentStatus,
  updateIncidentFlag,
} from "../controllers/incidentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/createIncident", authMiddleware, createIncident);
router.get("/getAllIncidents", authMiddleware, getAllIncidents);
router.delete("/deleteIncidentByID", authMiddleware, deleteIncidentByID);
router.patch("/updateIncidentStatus", authMiddleware, updateIncidentStatus);
router.patch("/updateIncidentFlag", authMiddleware, updateIncidentFlag);
router.get("/:id", authMiddleware, getIncidentById);

export default router;
