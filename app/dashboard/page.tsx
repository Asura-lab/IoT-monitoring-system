"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Device {
  id: string;
  name: string;
}

interface DeviceData {
  type: string;
  value: number;
  timestamp: string;
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [data, setData] = useState<DeviceData[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch devices
  useEffect(() => {
    async function fetchDevices() {
      setIsLoadingDevices(true);
      try {
        const res = await fetch("/api/devices");
        if (!res.ok) {
          console.error("Failed to fetch devices");
          setDevices([]); // Set to empty array on error
          return;
        }
        const json = await res.json();
        setDevices(Array.isArray(json) ? json : []);
        if (Array.isArray(json) && json.length > 0) {
          setSelectedDeviceId(json[0].id);
        } else {
          setSelectedDeviceId(""); // No devices, so no selection
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

  // Fetch data when device changes
  useEffect(() => {
    if (!selectedDeviceId) {
      setData([]); // Clear data if no device is selected
      return;
    }
    async function fetchData() {
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
    }
    fetchData();
  }, [selectedDeviceId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header: Title and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Төхөөрөмжийн мэдээлэл 📊 
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              Буцах
            </Link>
          </div>
        </div>

        {/* Device Selector Card */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <label className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-md font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
              Төхөөрөмж сонгох:
            </span>
            <div className="relative w-full sm:w-auto flex-grow"> {/* Wrapper for select and custom arrow */}
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                disabled={isLoadingDevices || devices.length === 0}
                className="appearance-none w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // Added appearance-none and pr-10
              >
                {isLoadingDevices ? (
                  <option>Loading devices...</option>
                ) : devices.length === 0 ? (
                  <option>No devices found</option>
                ) : (
                  devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name || device.id}
                    </option>
                  ))
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700 dark:text-gray-300"> {/* Custom arrow container, right-3 positions it from the right edge */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </label>
        </div>

        {/* Data Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {isLoadingData ? (
            <p className="p-6 text-gray-600 dark:text-gray-400 text-center">
              Loading data...
            </p>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((entry, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {entry.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {entry.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-gray-600 dark:text-gray-400 text-center">
              {selectedDeviceId ? "Уг төхөөрөмж идэвхгүй байна" : "Та эхлээд төхөөрөмж сонгоно уу."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}