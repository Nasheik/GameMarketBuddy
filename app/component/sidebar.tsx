"use client";
import Link from "next/link";
import { useState } from "react";

interface NavItem {
  title: string;
  path: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-gray-800 text-white h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
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
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
