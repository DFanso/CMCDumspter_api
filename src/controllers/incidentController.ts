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

// ... (the rest of your controller code)

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

export const getAllIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json(incidents);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};
