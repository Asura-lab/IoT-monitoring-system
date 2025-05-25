// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Smart Gas Monitoring System</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Monitor your environment using connected ESP32 devices with CO, Methane, and Temperature sensors.
      </p>
      <div className="flex gap-6">
        <Link href="/dashboard">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            View Dashboard
          </button>
        </Link>
        <Link href="/register-device">
          <button className="bg-gray-800 px-6 py-2 rounded hover:bg-gray-700">
            Register Device
          </button>
        </Link>
      </div>
    </main>
  );
}
