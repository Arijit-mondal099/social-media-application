import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, GlobeLock, Loader2, Mail, Save } from "lucide-react";
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
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { updateEmail } from "@/features/user/userThunks";

export const EditEmail: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await dispatch(updateEmail({ email }));

      if (updateEmail.fulfilled.match(res)) {
        toast.success("Email updated successfully");
      } else {
        toast.error(res.payload);
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("Something went worng!");
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
            <GlobeLock className="w-8 h-8" />
            Privacy
          </CardTitle>
          <CardDescription className="text-left">
            Update your registered email address. Make sure to use an active
            email, as it will be used for account verification and important
            notifications.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Email */}
            <div className="flex flex-col space-y-6 border p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6" />
                <span className="text-xl font-semibold">Change Email</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">New Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter new email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
