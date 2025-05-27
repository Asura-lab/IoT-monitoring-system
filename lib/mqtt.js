// lib/mqtt.js
import mqtt from "mqtt";

export function createMqttClient(onMessage) {
  const client = mqtt.connect(
    "wss://e79304a575334454a6e9ec4b702397fd.s1.eu.hivemq.cloud:8884/mqtt",
    {
      username: "asura",
      password: "ESP32project",
      clientId: "NextJs_Client_" + Math.random().toString(16).substr(2, 8),
      protocol: "wss",
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      keepalive: 60,
    }
  );

  client.on("connect", () => {
    console.log("MQTT connected");
    if (client.connected) {
      client.subscribe("MCO001/+", { qos: 0 });
      client.subscribe("MME001/+", { qos: 0 });
    }
  });

  client.on("message", (topic, message) => {
    if (client.connected) {
      onMessage(topic, message.toString());
    }
  });

  client.on("error", (err) => {
    console.error("MQTT error:", err);
  });

  client.on("disconnect", () => {
    console.log("MQTT disconnected");
  });

  client.on("close", () => {
    console.log("MQTT connection closed");
  });

  return client;
}
