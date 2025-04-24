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
        <div className="min-h-screen bg-gray-100">
          <TopNav />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </GameProvider>
    </UserProvider>
  );
} 