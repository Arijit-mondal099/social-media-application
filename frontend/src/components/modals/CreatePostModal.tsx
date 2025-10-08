import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Video, FileText, User, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { imagePost, textPost, videoPost } from "@/features/user/userThunks";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");
  const { user } = useAppSelector((state) => state.user);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const removeVideo = () => {
    setSelectedVideo(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", "");
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePost = async () => {
    if (postType === "text" && !content.trim()) {
      toast.error("Please add some content");
      return;
    }
    if (postType === "image" && !selectedImage && !content.trim()) {
      toast.error("Please add an image or text");
      return;
    }
    if (postType === "video" && !selectedVideo && !content.trim()) {
      toast.error("Please add a video or text");
      return;
    }

    let result;

    try {
      if (postType === "text") {
        result = await dispatch(textPost({ text: content, tags }));

        if (textPost.fulfilled.match(result)) {
          toast.success("Text post created successfully!");
        } else {
          throw new Error(result.payload || "Please try again");
        }
      } else if (postType === "image") {
        const data = new FormData();
        if (selectedImage) data.append("image", selectedImage);
        if (content) data.append("text", content);
        tags.forEach((tag) => data.append("tags", tag));

        result = await dispatch(imagePost(data));

        if (imagePost.fulfilled.match(result)) {
          toast.success("Image post created successfully!");
        } else {
          throw new Error(result.payload || "Please try again");
        }
      } else if (postType === "video") {
        const data = new FormData();
        if (selectedVideo) data.append("video", selectedVideo);
        if (content) data.append("text", content);
        tags.forEach((tag) => data.append("tags", tag));

        result = await dispatch(videoPost(data));

        if (videoPost.fulfilled.match(result)) {
          toast.success("Video post created successfully!");
        } else {
          throw new Error(result.payload || "Please try again");
        }
      } else {
        toast.error("Please select a post type!");
        return;
      }
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error(err.message || "Something went wrong");
      else 
        toast.error("Something went wrong");
    }

    setContent("");
    setSelectedImage(null);
    setSelectedVideo(null);
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              Create {postType.charAt(0).toUpperCase() + postType.slice(1)} Post
            </span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>

          <Select
            value={postType}
            onValueChange={(val) =>
              setPostType(val as "text" | "image" | "video")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select post type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Text
                </div>
              </SelectItem>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" /> Image
                </div>
              </SelectItem>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" /> Video
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-none focus:ring-0 text-base"
            maxLength={280}
          />

          <div className="flex justify-end">
            <span
              className={`text-xs ${
                content.length > 250 ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {content.length}/280
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" /> Add Tags
            </label>
            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded-full"
                >
                  #{tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </span>
              ))}
            </div>
          </div>

          {postType === "image" && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group w-full h-64"
                  >
                    <img
                      src={selectedImage && URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <X
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 p-2 rounded-full bg-black/50 hover:bg-black/70 cursor-pointer"
                    />
                  </motion.div>
                )}
              </motion.div>

              {!selectedImage && (
                <label htmlFor="image-upload">
                  <div className="p-2 rounded-md border border-dashed border-gray-500 cursor-pointer mt-2 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Upload Images
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </AnimatePresence>
          )}

          {postType === "video" && (
            <div className="space-y-2">
              {selectedVideo && (
                <div className="relative">
                  <video
                    src={selectedVideo && URL.createObjectURL(selectedVideo)}
                    controls
                    className="w-full rounded-lg"
                  />
                  <X
                    onClick={removeVideo}
                    className="absolute top-2 right-2 w-8 h-8 p-2 rounded-full bg-black/50 hover:bg-black/70 cursor-pointer"
                  />
                </div>
              )}

              {!selectedVideo && (
                <label htmlFor="video-upload">
                  <div className="p-2 rounded-md border border-dashed border-gray-500 cursor-pointer flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" /> Upload Video
                  </div>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handlePost} disabled={loading} className="px-6">
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
