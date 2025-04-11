// FormActions.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3,
  Eye,
  Pencil,
  Trash2,
  MessageSquare,
  MoreVertical,
  Share2,
} from "lucide-react";
import { Form } from "@/app/forms/page";
import { useState } from "react";
import { ShareFormDialog } from "@/components/forms/Share-form-dialog";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FormActions({ form }: { form: Form }) {
  const [openShare, setOpenShare] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/forms/${form._id}`);
      toast.success("Form deleted successfully.");
      router.push("/forms"); 
      router.refresh(); 
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.error || "Failed to delete form.");
    }
  };
  

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/forms/${form._id}/analytics`} className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/forms/${form._id}/responses`} className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Responses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/forms/${form._id}`} className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/forms/${form._id}/edit`} className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          {form.status === "published" && (
            <DropdownMenuItem onClick={() => setOpenShare(true)} className="flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete() }>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareFormDialog
        open={openShare}
        onOpenChange={setOpenShare}
        shareCode={form.shareCode || ""}
      />
    </>
  );
}
