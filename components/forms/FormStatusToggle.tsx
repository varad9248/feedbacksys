"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store/form-store";

interface Props {
    formId: string;
    currentStatus: "draft" | "published" | "archived";
    onStatusChange?: (newStatus: "draft" | "published" | "archived") => void;
}

const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800 border-green-200",
    archived: "bg-gray-100 text-gray-800 border-gray-200",
};

const dropdownColors: Record<string, string> = {
    publish: "text-green-600 hover:bg-green-50",
    unpublish: "text-yellow-600 hover:bg-yellow-50",
    archive: "text-gray-600 hover:bg-gray-50",
};

export const StatusSwitcher = ({ formId, currentStatus, onStatusChange }: Props) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);
    const router = useRouter();

    useEffect(() => {
        setStatus(currentStatus);
    }, [currentStatus]);

    const { setShareCode, clearShareCode } = useFormStore.getState();

    const updateStatus = async (target: "publish" | "unpublish" | "archive") => {
        try {
            setLoading(true);
            const res = await fetch(`/api/forms/${formId}/${target}`, {
                method: "PATCH",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");

            toast.success(data.message || "Status updated");
            setStatus(data.form.status);
            onStatusChange?.(data.form.status);
            router.refresh();

            // ✅ Manage shareCode state based on new status
            if (data.form.status === "published" && data.form.shareCode) {
                setShareCode(data.form.shareCode);
            } else {
                clearShareCode();
            }

        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const getAvailableOptions = () => {
        if (status === "published") return ["unpublish", "archive"];
        if (status === "draft") return ["publish", "archive"];
        return ["publish", "unpublish"]; // archived
    };

    const displayLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`text-xs px-3 py-1 rounded-full border ${statusColors[status]} capitalize`}
                    disabled={loading}
                >
                    {displayLabel(status)}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-36">
                {getAvailableOptions().map((action) => (
                    <DropdownMenuItem
                        key={action}
                        onClick={() => updateStatus(action as any)}
                        disabled={loading}
                        className={`capitalize cursor-pointer ${dropdownColors[action]}`}
                    >
                        {displayLabel(action)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
