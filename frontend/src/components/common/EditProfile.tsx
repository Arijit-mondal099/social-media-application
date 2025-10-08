import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  username: string;
  phone?: string;
  bio?: string;
}

interface EditProfileProps {
  user?: UserProfile;
  onSave?: (data: UserProfile) => Promise<void> | void;
  onCancel?: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  user,
  onSave,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfile>({
    defaultValues: user,
  });
  const navigate = useNavigate();

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const onSubmit = async (data: UserProfile) => {
    try {
      await onSave(data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto pt-20 space-y-4"
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
          <CardTitle className="text-2xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                {...register("phone")}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={3}
                className="w-full border rounded-md p-2 bg-background text-foreground"
                placeholder="Tell us about yourself..."
                {...register("bio")}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
