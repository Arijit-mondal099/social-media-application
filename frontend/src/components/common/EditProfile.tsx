import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Save, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { defaultProfileImage } from "@/assets";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { updateProfile, updateProfileImage } from "@/features/user/userThunks";
import { toast } from "sonner";

export interface FormState {
  name: string;
  username: string;
  link: string;
  bio: string;
}

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.user);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    username: "",
    link: "",
    bio: "",
  });
  const [isInputChanged, setIsInputChanged] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleChnage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIsInputChanged(false);
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setIsInputChanged(false);
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await dispatch(updateProfileImage(formData));

        if (updateProfileImage.fulfilled.match(res)) {
          toast.success("Profile updated successfully");
        } else {
          toast.error("Something went wrong!");
        }
      }

      if (
        user?.name !== formState.name ||
        user.username !== formState.username ||
        user.link !== formState.link ||
        user.bio !== formState.bio
      ) {
        const res = await dispatch(updateProfile(formState));

        if (updateProfile.fulfilled.match(res)) {
          toast.success("Profile updated successfully");
        } else {
          toast.error(res.payload);
        }
      }
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    setFormState({
      name: user?.name || "",
      username: user?.username || "",
      link: user?.link || "Not set yet",
      bio: user?.bio || "Not set yet",
    });
  }, [user]);

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
          <CardTitle className="text-2xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="space-y-4">
              {/* profile image */}
              <div className="relative w-32 md:w-44 h-32 md:h-44 mx-auto overflow-hidden rounded-full border-4 border-gray-400">
                <Label className="cursor-pointer group">
                  <img
                    src={
                      previewImage || user?.profileImage || defaultProfileImage
                    }
                    alt="profile image"
                    className="w-full h-full rounded-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50 z-10 hidden group-hover:flex items-center justify-center flex-col gap-2 transition-all duration-200">
                    <Upload className="w-10 h-10" />
                    <span className="text-sm font-semibold">Upload</span>
                  </div>

                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </Label>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formState.name}
                  onChange={handleChnage}
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formState.username}
                  onChange={handleChnage}
                />
              </div>

              {/* Link */}
              <div className="space-y-1">
                <Label htmlFor="phone">Link</Label>
                <Input
                  id="link"
                  name="link"
                  placeholder="Add link"
                  value={formState.link}
                  onChange={handleChnage}
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="w-full border rounded-md p-2 bg-background text-foreground"
                  placeholder="Tell us about yourself..."
                  value={formState.bio}
                  onChange={handleChnage}
                />
              </div>
            </div>

            <Button
              className="w-full disabled:opacity-40 disabled:cursor-pointer"
              type="submit"
              disabled={loading || isInputChanged}
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
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
