import mqtt from "mqtt";
import SensorData from "@/models/SensorData";
import { connectDB } from "./mongodb";

const client = mqtt.connect("wss://e79304a575334454a6e9ec4b702397fd.s1.eu.hivemq.cloud:8884/mqtt", {
  username: "asura",
  password: "ESP32project",
  clientId: "NextJs_Client_" + Math.random().toString(16).substr(2, 8),
  protocol: "wss",
});

client.on("connect", () => {
  console.log("✅ MQTT connected");

  // Бүх төхөөрөмжийн бүх сэдвийг subscribe хийх
  client.subscribe("+/co");
  client.subscribe("+/metan");
  client.subscribe("+/temperature");
  client.subscribe("+/humidity");
});

client.on("message", async (topic, message) => {
  const [deviceId, type] = topic.toString().split("/");

  await connectDB();

  const data = new SensorData({
    deviceId,
    type,
    value: parseFloat(message.toString()),
  });

  await data.save();
});
