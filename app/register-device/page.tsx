"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterDevice() {
  const [deviceId, setDeviceId] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/devices", {
      method: "POST",
      body: JSON.stringify({ deviceId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    setMessage(result.message || result.error);
    if (res.ok) setDeviceId("");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="absolute top-6 right-6">
      </div>
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Төхөөрөмж бүртгүүлэх
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="deviceId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Device ID
            </label>
            <input
              id="deviceId"
              type="text"
              placeholder="Төхөөрөмжийн ID оруулах"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition duration-150"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Бүртгүүлэх
          </button>
          {message && (
            <p
              className={`text-sm text-center ${
                message.includes("Error") || message.includes("error") || message.includes("required")
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              } pt-2`}
            >
              {message}
            </p>
          )}
        </form>
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 font-medium transition duration-150"
          >
            Буцах
          </Link>
        </div>
      </div>
    </main>
  );
}
