"use client";
import { useEffect, useState } from "react";
import { createMqttClient } from "@/lib/mqtt";

type SensorData = {
  [topic: string]: string;
};

export default function RealtimeData() {
  const [data, setData] = useState<SensorData>({});

  useEffect(() => {
    const client = createMqttClient((topic: string, message: string) => {
      setData((prev) => ({
        ...prev,
        [topic]: message,
      }));

      const [deviceId, type] = topic.split("/");

      fetch("/api/save-data", {
        method: "POST",
        body: JSON.stringify({ deviceId, type, value: message }),
        headers: { "Content-Type": "application/json" },
      });
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">📡 Realtime Sensor Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data).map(([topic, value]) => {
          const [deviceId, type] = topic.split("/");
          return (
            <div
              key={topic}
              className="bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-500">Device: {deviceId}</p>
              <h3 className="text-lg font-semibold capitalize">{type}</h3>
              <p className="text-2xl text-blue-600 mt-2">{value}</p>
              <p className="text-xs text-gray-400 mt-1">Topic: <code>{topic}</code></p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
