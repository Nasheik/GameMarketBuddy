import { GameProvider } from "@/context/GameContext";
import Sidebar from "@/components/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GameProvider>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white shadow-lg">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </GameProvider>
  );
} 