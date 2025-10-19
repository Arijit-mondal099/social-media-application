import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

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
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
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

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {btnText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
