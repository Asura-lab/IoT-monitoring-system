"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { ThemeToggle } from "@/components/Theme-toggle"; // Нэмэх

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) setError("Имэйл эсвэл нууц үг буруу байна");
    else router.push("/");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          Нэвтрэх
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
            Нэвтрэх
          </button>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}
        </form>
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-400 dark:text-gray-500 font-medium">
            эсвэл
          </span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>
        <button
          type="button"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/", // ← redirect home after login
            })
          }
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2 font-semibold transition"
        >
          <FcGoogle className="w-5 h-5" />
          Google-ээр нэвтрэх
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Бүртгэлгүй юу?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 underline font-medium"
          >
            Бүртгүүлэх
          </a>
        </p>
      </div>
    </main>
  );
}
