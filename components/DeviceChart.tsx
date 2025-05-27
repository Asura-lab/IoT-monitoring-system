"use client";
import React, { useEffect, useState } from "react";

interface DeviceData {
  _id?: string;
  deviceId?: string;
  type: string;
  value: number;
  timestamp: string;
}

interface DeviceChartProps {
  selectedDeviceId?: string;
  data?: DeviceData[];
  isLoading?: boolean;
}

export default function DeviceChart({
  selectedDeviceId,
  data: propData,
  isLoading: propIsLoading,
}: DeviceChartProps) {
  const [data, setData] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Debug log to see what data is being passed
  useEffect(() => {
    console.log("DeviceChart props:", {
      selectedDeviceId,
      propData: propData?.length || 0,
      propIsLoading,
      hasPropData: !!propData,
    });
  }, [selectedDeviceId, propData, propIsLoading]);

  // If data is passed as prop and has content, use it instead of fetching
  useEffect(() => {
    // Only use prop data if it's explicitly provided and has content
    if (propData !== undefined && propData.length > 0) {
      console.log("Using prop data:", propData);
      setData(propData);
      setIsLoading(propIsLoading || false);
      setError("");
      return;
    }

    // If no prop data or empty prop data, fetch our own data
    if (!selectedDeviceId) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        console.log("Fetching data for device:", selectedDeviceId);

        const response = await fetch(`/api/data?deviceId=${selectedDeviceId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", response.status, errorText);
          setError(`API Error: ${response.status} ${errorText}`);
          setData([]);
          return;
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (Array.isArray(result)) {
          setData(result);
        } else if (result.error) {
          setError(result.error);
          setData([]);
        } else {
          console.warn("Unexpected API response format:", result);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Сервертэй холбогдоход алдаа гарлаа");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data if no valid prop data
    if (propData === undefined || propData.length === 0) {
      fetchData();

      // Auto refresh every 30 seconds only if not using props
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedDeviceId, propData, propIsLoading]);

  if (!selectedDeviceId) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">Төхөөрөмж сонгоно уу</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400">
            График ачаалж байна...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 dark:text-red-400 mb-4">Алдаа: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-8 space-y-4">
        <p className="text-gray-500 dark:text-gray-400">
          {selectedDeviceId} төхөөрөмжийн өгөгдөл олдсонгүй
        </p>
        <div className="text-sm text-gray-400">
          <p>Шалгах зүйлс:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Төхөөрөмж идэвхтэй эсэх</li>
            <li>MQTT сервертэй холбогдсон эсэх</li>
            <li>Өгөгдөл илгээсэн эсэх</li>
            <li>API /api/data endpoint ажиллаж байгаа эсэх</li>
          </ul>
        </div>
        <div className="text-xs text-gray-500 mt-4 bg-gray-100 dark:bg-gray-800 p-2 rounded">
          Debug: Prop data = {propData?.length || 0}, Is Loading ={" "}
          {propIsLoading}, Has prop data ={" "}
          {propData !== undefined ? "Yes" : "No"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Хуудас дахин ачаалах
        </button>
      </div>
    );
  }

  // Group data by sensor type
  const groupedData = data.reduce((acc, entry) => {
    if (!acc[entry.type]) acc[entry.type] = [];
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<string, DeviceData[]>);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {selectedDeviceId} төхөөрөмжийн график
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Нийт {data.length} өгөгдөл олдлоо
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedData).map(([type, entries]) => {
          // Sort by timestamp
          const sortedEntries = entries.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          // Simple chart visualization using CSS
          const values = sortedEntries.map((e) => e.value);
          const maxValue = Math.max(...values);
          const minValue = Math.min(...values);
          const range = maxValue - minValue || 1;

          return (
            <div
              key={type}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 capitalize">
                {type} мэдрэгчийн график ({entries.length} өгөгдөл)
              </h4>

              {/* Simple bar chart */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Мин: {minValue}</span>
                  <span>Макс: {maxValue}</span>
                  <span>
                    Дундаж:{" "}
                    {(
                      values.reduce((a, b) => a + b, 0) / values.length
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-end space-x-1 h-32 border-b border-gray-200 dark:border-gray-600">
                  {sortedEntries.slice(-20).map((entry, idx) => {
                    const height = ((entry.value - minValue) / range) * 100;
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-t cursor-pointer relative group"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${entry.value} (${new Date(
                          entry.timestamp
                        ).toLocaleString()})`}
                      >
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {entry.value}
                          <br />
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent values table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">
                        Утга
                      </th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">
                        Огноо цаг
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries
                      .slice(-10)
                      .reverse()
                      .map((entry, idx) => (
                        <tr
                          key={entry._id || idx}
                          className="border-b border-gray-100 dark:border-gray-700"
                        >
                          <td className="py-2 font-medium text-gray-900 dark:text-gray-100">
                            {entry.value}
                          </td>
                          <td className="py-2 text-gray-500 dark:text-gray-400">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
