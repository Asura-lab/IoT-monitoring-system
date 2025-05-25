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

  // deviceId болон type-г topic-аас салгаж авна
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
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Realtime Sensor Data</h2>
      <ul>
        {Object.entries(data).map(([topic, value]) => (
          <li key={topic} className="mb-2">
            <strong>{topic}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
