"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavItem {
  title: string;
  path: string;
  image: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={`bg-gray-800 text-white h-[calc(100vh-1rem)] transition-all duration-300 rounded-2xl ml-2 mt-2 ${
        isCollapsed ? "w-16" : "w-48"
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-xl font-bold">Menu</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-700"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <div
                  className={`p-2 hover:bg-gray-700 rounded flex items-center ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                >
                  {isCollapsed ? (
                    <Image src={item.image} width={40} height={40} alt={""} />
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
