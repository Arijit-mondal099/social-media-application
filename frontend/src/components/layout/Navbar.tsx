import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { MessageCircle, Settings } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/feed" className="flex items-center space-x-2">
              <motion.h1
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 italic text-2xl font-bold text-black dark:text-white"
              >
                friends
              </motion.h1>
            </NavLink>

            <div className="flex items-center gap-4">
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `w-10 h-10 border rounded-full flex items-center justify-center ${
                    isActive ? "text-blue-500" : ""
                  }`
                }
              >
                <MessageCircle className="w-4 h-4" />
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `w-10 h-10 border rounded-full flex items-center justify-center ${
                    isActive ? "text-blue-500" : ""
                  }`
                }
              >
                <Settings className="w-4 h-4" />
              </NavLink>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
