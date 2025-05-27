"use client";
import { useEffect, useState, useRef } from "react";
import { createMqttClient } from "@/lib/mqtt";
import { MqttClient } from "mqtt";

type SensorData = {
  [topic: string]: {
    value: string;
    timestamp: number;
  };
};

interface RealtimeDataProps {
  selectedDeviceId?: string;
}

export default function RealtimeData({ selectedDeviceId }: RealtimeDataProps) {
  const [data, setData] = useState<SensorData>({});
  const clientRef = useRef<MqttClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [deviceStatus, setDeviceStatus] = useState<
    "online" | "offline" | "unknown"
  >("unknown");

  // Check device activity every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(data).length === 0) {
        setDeviceStatus("unknown");
        return;
      }

      const now = Date.now();
      const lastActivity = Math.max(
        ...Object.values(data).map((d) => d.timestamp)
      );
      const timeSinceLastActivity = now - lastActivity;

      // If no data received in last 2 minutes, consider device offline
      if (timeSinceLastActivity > 2 * 60 * 1000) {
        setDeviceStatus("offline");
      } else {
        setDeviceStatus("online");
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    let mounted = true;

    const client = createMqttClient((topic: string, message: string) => {
      if (!mounted) return;

      // Filter by selected device if provided
      if (selectedDeviceId) {
        const [deviceId] = topic.split("/");
        if (deviceId !== selectedDeviceId) return;
      }

      const timestamp = Date.now();
      setData((prev) => ({
        ...prev,
        [topic]: {
          value: message,
          timestamp: timestamp,
        },
      }));

      // Update device status to online when receiving data
      setDeviceStatus("online");

      const [deviceId, type] = topic.split("/");

      if (mounted) {
        fetch("/api/save-data", {
          method: "POST",
          body: JSON.stringify({ deviceId, type, value: message }),
          headers: { "Content-Type": "application/json" },
        }).catch((err) => console.error("Failed to save data:", err));
      }
    });

    client.on("connect", () => {
      if (mounted) {
        setConnectionStatus("Connected");
      }
    });

    client.on("disconnect", () => {
      if (mounted) {
        setConnectionStatus("Disconnected");
        setDeviceStatus("offline");
      }
    });

    client.on("error", (err) => {
      if (mounted) {
        setConnectionStatus("Error: " + err.message);
        setDeviceStatus("offline");
      }
    });

    clientRef.current = client;

    return () => {
      mounted = false;
      if (clientRef.current) {
        try {
          clientRef.current.end(true);
        } catch (err) {
          console.warn("Error closing MQTT client:", err);
        }
        clientRef.current = null;
      }
    };
  }, [selectedDeviceId]);

  // Filter data by selected device when device changes
  useEffect(() => {
    if (selectedDeviceId) {
      setData((prevData) => {
        const filteredData: SensorData = {};
        Object.entries(prevData).forEach(([topic, dataPoint]) => {
          const [deviceId] = topic.split("/");
          if (deviceId === selectedDeviceId) {
            filteredData[topic] = dataPoint;
          }
        });
        return filteredData;
      });
    }
  }, [selectedDeviceId]);

  if (!selectedDeviceId) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">Төхөөрөмж сонгоно уу</p>
      </div>
    );
  }

  const getStatusColor = () => {
    if (
      connectionStatus.startsWith("Error") ||
      connectionStatus === "Disconnected"
    ) {
      return "text-red-500";
    }
    if (deviceStatus === "offline") {
      return "text-orange-500";
    }
    if (deviceStatus === "online" && connectionStatus === "Connected") {
      return "text-green-500";
    }
    return "text-gray-500";
  };

  const getStatusText = () => {
    if (
      connectionStatus.startsWith("Error") ||
      connectionStatus === "Disconnected"
    ) {
      return connectionStatus;
    }
    if (deviceStatus === "offline") {
      return "Төхөөрөмж идэвхгүй";
    }
    if (deviceStatus === "online" && connectionStatus === "Connected") {
      return "Идэвхтэй";
    }
    return "Холбогдож байна...";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Төхөөрөмж: {selectedDeviceId}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                deviceStatus === "online" && connectionStatus === "Connected"
                  ? "bg-green-500 animate-pulse"
                  : deviceStatus === "offline"
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {Object.keys(data).length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500 dark:text-gray-400">
            {selectedDeviceId} төхөөрөмжийн бодит цагийн өгөгдөл хүлээж байна...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data).map(([topic, dataPoint]) => {
            const [deviceId, type] = topic.split("/");
            const timeSinceUpdate = Date.now() - dataPoint.timestamp;
            const isStale = timeSinceUpdate > 2 * 60 * 1000; // 2 minutes

            return (
              <div
                key={topic}
                className={`rounded-2xl shadow p-4 border hover:shadow-lg transition ${
                  isStale
                    ? "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 opacity-60"
                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Төхөөрөмж: {deviceId}
                  </p>
                  {isStale && (
                    <span className="text-xs text-orange-500 font-medium">
                      Хуучин
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-200">
                  {type}
                </h3>
                <p
                  className={`text-2xl mt-2 ${
                    isStale
                      ? "text-gray-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {dataPoint.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Сүүлд шинэчлэгдсэн:{" "}
                  {new Date(dataPoint.timestamp).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
