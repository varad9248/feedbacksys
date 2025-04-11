"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareCode: string;
}

export const ShareFormDialog = ({ open, onOpenChange, shareCode }: ShareFormDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share this form</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-2">
          <Input value={shareCode} readOnly className="text-sm" />
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Share this code with others so they can access the form.
        </p>
      </DialogContent>
    </Dialog>
  );
};
