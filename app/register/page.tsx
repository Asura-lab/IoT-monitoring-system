"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/Theme-toggle"; // Нэмэх

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Бүртгэл амжилттай! Нэвтрэх хуудас руу шилжиж байна...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage(data.error || "Бүртгэл амжилтгүй боллоо");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          Бүртгүүлэх
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Имэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Бүртгүүлэх
          </button>
          {message && (
            <p
              className={`text-center ${
                message.includes("амжилттай")
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Өмнө нь бүртгүүлсэн үү?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 underline font-medium"
          >
            Нэвтрэх
          </a>
        </p>
      </div>
    </main>
  );
}
