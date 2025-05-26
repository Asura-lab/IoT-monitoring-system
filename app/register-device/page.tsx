"use client";

import { useState } from "react";

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
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Төхөөрөмж бүртгүүлэх</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Device ID (e.g. MCO001)"
          className="border px-4 py-2 rounded"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Бүртгүүлэх
        </button>
        {message && <p className="text-sm text-center">{message}</p>}
      </form>
      <a href="/" className="border border-white rounded-2xl p-4 hover:bg-white transition duration-300 inline-block w-max mt-6 text-white hover:text-black font-bold text-xs">
        Буцах
      </a>
    </main>
  );
}
