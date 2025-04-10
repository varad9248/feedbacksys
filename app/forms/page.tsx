"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, LayoutList, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import FormTabs from "@/components/forms/FormTabs";

export interface Form {
  shareCode: string;
  _id: string;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  config: {
    elements: any[];
  };
}

export default function Forms() {
  const [view, setView] = useState<"list" | "box">("list");

  const { data: forms, isLoading } = useQuery<Form[]>({
    queryKey: ["forms"],
    queryFn: async () => {
      const response = await fetch("/api/forms");
      if (!response.ok) throw new Error("Failed to fetch forms");
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Forms</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Manage your feedback forms
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            size="icon"
            title="List View"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "box" ? "default" : "outline"}
            onClick={() => setView("box")}
            size="icon"
            title="Box View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/forms/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">Create Form</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      {isLoading ? (
        <div className="text-muted-foreground text-center">Loading forms...</div>
      ) : (
        <Tabs defaultValue="draft" className="space-y-4">
          <FormTabs forms={forms || []} view={view} />
        </Tabs>
      )}
    </div>
  );
}
