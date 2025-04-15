import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import './globals.css';
import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GameProvider } from "@/context/GameContext";

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
