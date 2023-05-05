import { Request, Response } from "express";
import Incident, { IIncident } from "../models/incidentModel";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export const createIncident = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { name, address, description } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided." });
      }

      const incident = new Incident({
        name,
        address,
        description,
        imagePath: req.file.path,
      });

      const savedIncident = await incident.save();
      const newImagePath = path.join(
        path.dirname(savedIncident.imagePath),
        `${savedIncident._id}${path.extname(savedIncident.imagePath)}`
      );

      fs.renameSync(savedIncident.imagePath, newImagePath);
      savedIncident.imagePath = newImagePath;

      await Incident.findByIdAndUpdate(savedIncident._id, savedIncident);
      res.status(201).json(savedIncident);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred." });
      }
    }
  },
];
