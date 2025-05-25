// lib/mqtt.js
import mqtt from "mqtt";

export function createMqttClient(onMessage) {
  const client = mqtt.connect("wss://e79304a575334454a6e9ec4b702397fd.s1.eu.hivemq.cloud:8884/mqtt", {
    username: "asura",
    password: "ESP32project",
    clientId: "NextJs_Client_" + Math.random().toString(16).substr(2, 8),
    protocol: "wss",
  });

  client.on("connect", () => {
    console.log("MQTT connected");
    client.subscribe("MCO001/+", { qos: 0 });
    client.subscribe("MME001/+", { qos: 0 });
  });

  client.on("message", (topic, message) => {
    onMessage(topic, message.toString());
  });

  client.on("error", (err) => {
    console.error("MQTT error:", err);
  });

  return client;
}
