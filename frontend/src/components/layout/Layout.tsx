import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
  onCreatePost?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onCreatePost }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center items-center">
        <Sidebar onCreatePost={onCreatePost} />
        <main className="flex-1 pb-20 md:pb-0 w-full max-w-xl text-center overflow-auto">
          {children}
        </main>
      </div>
      {onCreatePost && <BottomNavigation onCreatePost={onCreatePost} />}
    </div>
  );
};
