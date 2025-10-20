import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface ConfirmModalProps {
  title: string;
  description: string;
  btnText: string;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  trigger?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  description,
  btnText,
  onConfirm,
  trigger,
}) => {
  const [isConfirm, setIsConfirm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    if (isConfirm.toLowerCase() !== "confirm") {
      toast.error('Please type "confirm" to proceed');
      return;
    }

    if (onConfirm) onConfirm();

    setIsConfirm("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button variant="destructive">Open</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div>
          <Label className="block mb-2 mt-4 font-medium text-sm">
            Type "confirm" to proceed
          </Label>
          <Input
            type="text"
            placeholder="Type confirm here"
            className="w-full border rounded-md p-2 bg-background text-foreground"
            value={isConfirm}
            onChange={(e) => setIsConfirm(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirm.toLowerCase() !== "confirm"}
          >
            {btnText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
