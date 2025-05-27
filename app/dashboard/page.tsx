"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DeviceChart from "@/components/DeviceChart";
import RealtimeData from "@/components/RealtimeData";

interface Device {
  id: string;
  name: string;
  status?: "online" | "offline";
  lastSeen?: string;
}

interface DeviceData {
  type: string;
  value: number;
  timestamp: string;
}

interface DataStats {
  total: number;
  latest: DeviceData | null;
  average: number;
  min: number;
  max: number;
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [data, setData] = useState<DeviceData[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [autoRefresh] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Fetch devices
  useEffect(() => {
    async function fetchDevices() {
      setIsLoadingDevices(true);
      try {
        const res = await fetch("/api/devices");
        if (!res.ok) {
          console.error("Failed to fetch devices");
          setDevices([]);
          return;
        }
        const json = await res.json();
        const devicesData = Array.isArray(json) ? json : [];
        setDevices(devicesData);
        if (devicesData.length > 0) {
          setSelectedDeviceId(devicesData[0].id);
        } else {
          setSelectedDeviceId("");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      } finally {
        setIsLoadingDevices(false);
      }
    }
    fetchDevices();
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedDeviceId) return;

    setIsLoadingData(true);
    try {
      const res = await fetch(`/api/data?deviceId=${selectedDeviceId}`);
      if (!res.ok) {
        console.error("Failed to fetch data for device:", selectedDeviceId);
        setData([]);
        return;
      }
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedDeviceId]);

  // Fetch data when device changes
  useEffect(() => {
    if (!selectedDeviceId) {
      setData([]);
      return;
    }
    fetchData();
  }, [selectedDeviceId, fetchData]);

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh && selectedDeviceId) {
      const interval = setInterval(() => {
        fetchData();
      }, 5000); // Refresh every 5 seconds
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, selectedDeviceId, fetchData, refreshInterval]);

  // Group entries by type
  const groupedData = data.reduce((acc, entry) => {
    if (!acc[entry.type]) acc[entry.type] = [];
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<string, DeviceData[]>);

  // Calculate statistics for each sensor type
  const getDataStats = (entries: DeviceData[]): DataStats => {
    if (entries.length === 0) {
      return { total: 0, latest: null, average: 0, min: 0, max: 0 };
    }

    const values = entries.map((e) => e.value);
    const latest = entries.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    return {
      total: entries.length,
      latest,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Төхөөрөмжийн мэдээлэл
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Бодит цагийн мэдээлэл болон статистик
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              disabled={isLoadingData || !selectedDeviceId}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Шинэчлэх
            </button>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Буцах
            </Link>
          </div>
        </div>

        {/* Device Selector and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Device Selection Card */}
          <div className="lg:col-span-2 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Төхөөрөмж сонгох
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  disabled={isLoadingDevices || devices.length === 0}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingDevices ? (
                    <option>Төхөөрөмж ачаалж байна...</option>
                  ) : devices.length === 0 ? (
                    <option>Төхөөрөмж олдсонгүй</option>
                  ) : (
                    devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name || device.id}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Controls Card */}
          <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Тохиргоо
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Харагдац:
                </span>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    viewMode === "cards"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Хүснэгт
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    viewMode === "table"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  График
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/50 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Мэдээллийн мэдээлэл
            </h2>
          </div>

          {isLoadingData ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Мэдээлэл ачаалж байна...
                </span>
              </div>
            </div>
          ) : Object.keys(groupedData).length > 0 ? (
            <div className="p-6">
              {viewMode === "cards" ? (
                // Cards View
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.entries(groupedData).map(([type, entries]) => {
                    const stats = getDataStats(entries);
                    return (
                      <div
                        key={type}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
                            {type}
                          </h3>
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Хамгийн сүүлийн:
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {stats.latest?.value ?? "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Дундаж:
                            </span>
                            <span className="font-medium">
                              {stats.average.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Мин/Макс:
                            </span>
                            <span className="font-medium">
                              {stats.min} / {stats.max}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Нийт:
                            </span>
                            <span className="font-medium">
                              {stats.total} өгөгдөл
                            </span>
                          </div>
                          {stats.latest && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Сүүлд шинэчлэгдсэн:{" "}
                              {new Date(
                                stats.latest.timestamp
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Chart View - Pass the actual data to DeviceChart
                <DeviceChart
                  selectedDeviceId={selectedDeviceId}
                  data={data}
                  isLoading={isLoadingData}
                />
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                {selectedDeviceId ? (
                  viewMode === "cards" ? (
                    <RealtimeData selectedDeviceId={selectedDeviceId} />
                  ) : (
                    // Don't pass empty array, let DeviceChart fetch its own data
                    <DeviceChart
                      selectedDeviceId={selectedDeviceId}
                      isLoading={isLoadingData}
                    />
                  )
                ) : (
                  "Төхөөрөмж сонгоно уу."
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
