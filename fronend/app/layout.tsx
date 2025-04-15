import { createClient } from "@/utils/supabase/server";
import { GameProvider } from "@/context/GameContext";
import Sidebar from "@/components/Sidebar";
import { Inter } from "next/font/google";
import './globals.css';
import { Metadata } from 'next';
import { Sidebar as SidebarComponent } from "@/components/sidebar";
import { inter } from "@/utils/fonts";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social Media Scheduler',
  description: 'Schedule posts to your social media accounts',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
