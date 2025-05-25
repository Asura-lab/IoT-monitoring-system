import mongoose from "mongoose";

const SensorDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  type: { type: String, required: true }, // "co", "temperature", "humidity", "metan"
  value: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.SensorData || mongoose.model("SensorData", SensorDataSchema);
