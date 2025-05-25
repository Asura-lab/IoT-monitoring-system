"use client";

import { useEffect, useState } from "react";

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

  // Fetch devices
  useEffect(() => {
    async function fetchDevices() {
      const res = await fetch("/api/devices"); // Төхөөрөмжийн жагсаалтыг авах
      const json = await res.json();
      setDevices(json);
      if (json.length > 0) setSelectedDeviceId(json[0].id); // Эхний төхөөрөмж сонгоно
    }
    fetchDevices();
  }, []);

  // Fetch data when device changes
  useEffect(() => {
    if (!selectedDeviceId) return;
    async function fetchData() {
      const res = await fetch(`/api/data?deviceId=${selectedDeviceId}`);
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, [selectedDeviceId]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Төхөөрөмжийн мэдээлэл</h1>

      <label className="block mb-4">
        <span className="text-sm">Төхөөрөмж сонгох:</span>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="border p-2 rounded mt-1 w-full sm:w-auto"
        >
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name || device.id}
            </option>
          ))}
        </select>
      </label>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Value</th>
              <th className="border px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="text-sm text-center">
                <td className="border px-4 py-2">{entry.type}</td>
                <td className="border px-4 py-2">{entry.value}</td>
                <td className="border px-4 py-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
