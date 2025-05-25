// models/Device.ts
import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: String,
  userEmail: { type: String, required: true },
});

export default mongoose.models.Device || mongoose.model("Device", DeviceSchema);
