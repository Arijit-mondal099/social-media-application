import React, { useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  ChevronRight,
  Palette,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/features/user/userSlice";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { useTheme } from "next-themes";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/modals/ConfirmModal";

export const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const nvaigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("token");
    nvaigate("/login");
  }, [dispatch, nvaigate]);

  const settingSections = [
    {
      title: "Account",
      icon: User,
      items: [
        {
          label: "Edit Profile",
          description: "Update your profile information",
          redirect: "/edit-profile",
        },
        {
          label: "Privacy",
          description: "Control your privacy settings & Email",
          redirect: "/privacy",
        },
        {
          label: "Security",
          description: "Password and security options",
          redirect: "/security",
        },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        {
          label: "Theme",
          description: `Currently using ${theme ?? "system"} mode`,
          component: <ModeToggle />,
          redirect: "/settings",
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <section.icon className="w-5 h-5" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1 text-left">
                        <Label className="text-base font-medium">
                          {item.label}
                        </Label>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {section.title === "Appearance" ? (
                          <ModeToggle />
                        ) : (
                          <Button variant="ghost" size="sm">
                            <ChevronRight
                              className="w-4 h-4"
                              onClick={() => nvaigate(item.redirect)}
                            />
                          </Button>
                        )}
                      </div>
                    </div>

                    {itemIndex < section.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <TriangleAlert />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-left">
                These actions cannot be undone. Please be careful.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <Label className="text-base font-medium">Sign Out</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign out of your account on this device
                  </p>
                </div>

                <ConfirmModal
                  title="Danger Zone!"
                  description="Are you sure you want to sign out?, if yes then click on confirm button!"
                  btnText="Confirm"
                  onConfirm={handleLogout}
                  trigger={
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
