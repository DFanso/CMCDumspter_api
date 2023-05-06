// incidentModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IIncident extends Document {
  name: string;
  address: string;
  description: string;
  imagePath: string;
  flag: string;
}

const IncidentSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  flag: { type: String, enum: ["green", "red"], default: "green" },
  status: { type: Boolean, default: false },
});

export default mongoose.model<IIncident>("Incident", IncidentSchema);
