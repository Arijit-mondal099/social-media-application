import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Loader2,
  Lock,
  Save,
  Shield,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppSelector } from "@/hooks/useAppSelector";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { deleteUserAccount, updatePassword } from "@/features/user/userThunks";
import ConfirmModal from "../modals/ConfirmModal";

export const Security: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (newPassword.length < 6) {
      toast.error("Password length should be getterthan 6!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Invalid confirm password!");
      return;
    }

    try {
      const res = await dispatch(updatePassword({ oldPassword, newPassword }));

      if (updatePassword.fulfilled.match(res)) {
        toast.success("Password changed successfully");
      } else {
        toast.error(res.payload);
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong...");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await dispatch(deleteUserAccount());

      if (deleteUserAccount.fulfilled.match(res)) {
        toast.success("Account deleted successfully");
        navigate("/login");
      } else {
        toast.error(res.payload);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong...");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto py-20 space-y-4"
    >
      <div
        className="flex items-center gap-2 text-gray-400 cursor-pointer"
        onClick={() => navigate("/settings")}
      >
        <ChevronLeft />
        Back to setting
      </div>

      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-left flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Security
          </CardTitle>

          <CardDescription className="text-left">
            Manage your account security here. Choose a strong, unique password
            and update it regularly to keep your account protected.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            {/* Password */}
            <div className="flex flex-col space-y-6 border p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Lock className="w-6 h-6" />
                <span className="text-xl font-semibold">Change Password</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="oldPassword">Old Password</Label>
                  <Input
                    type="password"
                    id="oldPassword"
                    placeholder="Enter old password"
                    className="w-full border rounded-md p-2 bg-background text-foreground"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password"
                    className="w-full border rounded-md p-2 bg-background text-foreground"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="Enter confirm password"
                    className="w-full border rounded-md p-2 bg-background text-foreground"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <ConfirmModal
                title="Confirm Password Change"
                description="Are you sure you want to change your password? Make sure you remember your new password."
                btnText="Change Password"
                onConfirm={handleSubmit}
                trigger={
                  <Button
                    type="button"
                    disabled={
                      loading ||
                      !oldPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" /> Updating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save
                      </span>
                    )}
                  </Button>
                }
              />
            </div>

            {/* Delete account */}
            <div className="flex flex-col space-y-6 border p-4 rounded-md">
              <div className="flex items-center gap-2 text-destructive">
                <TriangleAlert className="w-6 h-6" />
                <span className="text-xl font-semibold">Delete Account!</span>
              </div>

              <ConfirmModal
                title="Delete Account"
                description="Deleting your account is permanent and will remove all your data. This action cannot be undone — please export any important information before proceeding."
                btnText="Delete"
                onConfirm={handleDeleteAccount}
                trigger={
                  <Button type="button" variant="destructive">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" /> Updating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete Account
                      </span>
                    )}
                  </Button>
                }
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
