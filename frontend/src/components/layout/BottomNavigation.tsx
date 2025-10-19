import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, User, Video, Compass } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/useAppSelector";

interface BottomNavigationProps {
  onCreatePost: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onCreatePost,
}) => {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/feed" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Plus, label: "Create", path: "#", action: onCreatePost },
    { icon: Video, label: "Reels", path: "/reels" },
    { icon: User, label: "Profile", path: "/profile", isProfile: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 lg:hidden"
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center py-2"
          >
            {item.action ? (
              <button
                onClick={item.action}
                className={`p-2 rounded-full ${
                  item.label === "Create"
                    ? "bg-primary text-primary-foreground"
                    : isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-6 h-6" />
              </button>
            ) : (
              <Link
                to={item.path}
                className={`p-2 rounded-full ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.isProfile ? (
                  <Avatar className="w-6 h-6 border-2 border-primary">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="text-xs">
                      {user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <item.icon className="w-6 h-6" />
                )}
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};
