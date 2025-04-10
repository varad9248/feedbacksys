// app/loading.tsx
import { Loader2 } from "lucide-react";
import "@/app/globals.css"; // If you have global styles

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black transition-colors">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading, please wait...</p>
      </div>
    </div>
  );
}
