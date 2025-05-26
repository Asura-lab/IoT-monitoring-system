// app/components/theme-toggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center gap-1 p-1 h-[38px] w-[100px] rounded-lg bg-gray-200 dark:bg-slate-800 animate-pulse"></div>;
  }

  const themeOptions = [
    { value: "light", label: "Light Mode", icon: Sun },
    { value: "dark", label: "Dark Mode", icon: Moon },
    { value: "system", label: "System Mode", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-slate-800 rounded-lg shadow">
      {themeOptions.map((option) => {
        const isActive = theme === option.value;
        let activeSpecificClasses = "";

        if (isActive) {
          switch (option.value) {
            case "light":
              activeSpecificClasses = "bg-white text-blue-500 shadow-sm";
              break;
            case "dark":
              activeSpecificClasses = "bg-slate-700 text-yellow-400 shadow-sm";
              break;
            case "system":
              activeSpecificClasses = "bg-white dark:bg-slate-600 text-slate-500 dark:text-slate-300 shadow-sm";
              break;
          }
        }

        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            title={option.label}
            aria-pressed={isActive}
            className={`
              p-1.5 rounded-md transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-1
              focus:ring-blue-500 dark:focus:ring-yellow-400
              focus:ring-offset-gray-200 dark:focus:ring-offset-slate-800
              ${
                isActive
                  ? activeSpecificClasses
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            <option.icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
          </button>
        );
      })}
    </div>
  );
}
