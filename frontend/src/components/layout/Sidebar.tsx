import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, User, Settings, Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { defaultProfileImage } from "@/assets";

interface SidebarProps {
  onCreatePost?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreatePost }) => {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/feed" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Video, label: "Reels", path: "/reels" },
    { icon: User, label: "Profile", path: `/profile/${user?.username}` },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex fixed left-0 top-16 h-screen w-64 bg-background border-r border-border flex-col"
    >
      <div className="flex-1 p-4 space-y-2">
        <div className="p-4 rounded-lg bg-muted/50 mb-6">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profileImage || defaultProfileImage} />
            </Avatar>
            <div className="text-left">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="flex gap-2 p-6 w-full mb-4"
            size="lg"
            onClick={onCreatePost}
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </Button>
        </motion.div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-black dark:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Stats */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-semibold text-sm">{user?.posts?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.following}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
