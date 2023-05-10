import { Request, Response } from "express";
import Incident, { IIncident } from "../models/incidentModel";
import multer from "multer";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Set up AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = "cmcdumspter";

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

const uploadFileToS3 = (filePath: string, key: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err: Error | null, data: Buffer) => {
      if (err) {
        return reject(err);
      }

      const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: data,
        ContentType: "image/jpeg", // Update the content type based on your image format
      };

      s3.upload(
        params,
        (err: Error | null, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            return reject(err);
          }
          resolve(data.Location);
        }
      );
    });
  });
};

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

      // Upload the file to S3 and store the S3 URL as imagePath
      const s3URL = await uploadFileToS3(
        newImagePath,
        path.basename(newImagePath)
      );
      savedIncident.imagePath = s3URL;

      await Incident.findByIdAndUpdate(savedIncident._id, savedIncident);
      res.status(201).json(savedIncident);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      // ...
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred." });
      }
    } finally {
      // Clean up the local image file
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  },
];


export const getIncidentById = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found." });
    }
    res.status(200).json(incident);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};
export const getAllIncidents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user } = req.body;
    let incidents;

    if (user === "admin" || user === "green_captain" || user === "GTF_Member") {
      if (user === "GTF_Member") {
        incidents = await Incident.find({ status: true });
      } else {
        incidents = await Incident.find({});
      }
      res.status(200).json({ incidents });
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching incidents", error });
  }
};
export const deleteIncidentByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let id = req.body.incidentID;
    if (!id) {
      res.status(400).json({ message: "No document ID provided." });
      return;
    }

    const incident = await Incident.findByIdAndDelete(id);

    if (!incident) {
      res.status(404).json({ message: "Incident not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Incident deleted successfully.", data: incident });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the incident.",
      error,
    });
  }
};
export const updateIncidentStatus = async (req: Request, res: Response) => {
  const incidentID = req.body.incidentID;

  if (!incidentID) {
    return res.status(400).json({ message: "incidentID is required" });
  }

  try {
    const incident = await Incident.findByIdAndUpdate(
      incidentID,
      { status: true },
      { new: true, runValidators: true }
    );

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res
      .status(200)
      .json({ message: "Incident status updated successfully", incident });
  } catch (error) {
    res.status(500).json({ message: "Error updating incident status", error });
  }
};
export const updateIncidentFlag = async (req: Request, res: Response) => {
  const { incidentID, flag } = req.body;

  if (!incidentID) {
    return res.status(400).json({ message: "incidentID is required" });
  }

  if (!flag || !["green", "red"].includes(flag)) {
    return res
      .status(400)
      .json({ message: "Valid flag value ('green' or 'red') is required" });
  }

  try {
    const updateData = { flag };
    const incident = await Incident.findByIdAndUpdate(incidentID, updateData, {
      new: true,
      runValidators: true,
    });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res
      .status(200)
      .json({ message: "Incident updated successfully", incident });
  } catch (error) {
    res.status(500).json({ message: "Error updating incident", error });
  }
};
