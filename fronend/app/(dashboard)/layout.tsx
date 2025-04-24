import { GameProvider } from "@/context/GameContext";
import { UserProvider } from "@/context/UserContext";
import TopNav from "@/components/TopNav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <GameProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
          <TopNav />
          <main className="max-w-[1400px] mx-auto py-4 px-4">
            {children}
          </main>
        </div>
      </GameProvider>
    </UserProvider>
  );
} 