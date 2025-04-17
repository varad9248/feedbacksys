"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import ResponseTabs from "@/components/response/ResponseTabs";

export interface Response {
  _id: string;
  formId: string;
  userId: string;
  createdAt: string;
  answers: Record<string, any>;
  form: {
    title: string;
    status: "draft" | "published" | "archived";
    config: {
      elements: any[];
    };
  };
}

export default function Responses() {
  const [view, setView] = useState<"list" | "box">("list");

  const { data: responses, isLoading } = useQuery<Response[]>({
    queryKey: ["responses"],
    queryFn: async () => {
      const response = await fetch("/api/responses");
      if (!response.ok) throw new Error("Failed to fetch responses");
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Responses</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            View and manage your form responses
          </p>
        </div>

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
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-center">Loading responses...</div>
      ) : (
        <Tabs defaultValue="published" className="space-y-4">
          <ResponseTabs responses={responses || []} view={view} />
        </Tabs>
      )}
    </div>
  );
}
