// models/DeviceData.ts
import mongoose from "mongoose";

const deviceDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, enum: ["co", "metan", "temperature", "humidity"], required: true },
  value: Number,
  timestamp: String,
});

export const DeviceData =
  mongoose.models.DeviceData || mongoose.model("DeviceData", deviceDataSchema);
