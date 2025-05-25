import { connectDB } from "@/lib/mongodb";
import SensorData from "@/models/SensorData";

(async () => {
  await connectDB();

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const result = await SensorData.deleteMany({ timestamp: { $lt: cutoff } });
  console.log(`Deleted ${result.deletedCount} old records`);
  process.exit(0);
})();
