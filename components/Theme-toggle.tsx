// app/components/theme-toggle.tsx
"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Өдрийн горим" },
    { value: "dark", icon: Moon, label: "Шөнийн горим" },
    { value: "system", icon: Monitor, label: "Системийн горим" },
  ] as const;

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            p-2 rounded-md transition-all duration-200
            ${
              theme === value
                ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }
          `}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
