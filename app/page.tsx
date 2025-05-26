// app/page.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/Theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Ухаалаг утаа мэдрэгчийн систем
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Өөрийн гэр бүл, эд хөрөнгийг хамгаалах ухаалаг утаа мэдрэгчийн системд
          тавтай морилно уу.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              📊 Самбар харах
            </button>
          </Link>

          <Link href="/register-device">
            <button className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              📱 Төхөөрөмж бүртгүүлэх
            </button>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🚪 Гарах
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="text-3xl mb-4">🔥</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Утаа мэдрэх
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Өндөр нарийвчлалтай утаа мэдрэгч сенсорууд
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Шуурхай сэрэмжлүүлэг
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Утас болон имэйлээр тухайн мөчид мэдэгдэл
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Дэлгэрэнгүй тайлан
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Өгөгдлийн дүн шинжилгээ болон түүхийн мэдээлэл
          </p>
        </div>
      </div>
    </main>
  );
}
