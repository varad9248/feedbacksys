"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import FormListView from "./FormListView";
import FormBoxView from "./FormBoxView";
import { Form } from "@/app/forms/page";

interface Props {
  forms: Form[];
  view: "list" | "box";
}

export default function FormTabs({ forms, view }: Props) {
  const renderForms = (status: Form["status"]) => {
    const filtered = forms.filter((form) => form.status === status);

    if (filtered.length === 0) {
      return (
        <div className="text-muted-foreground text-center py-10 text-sm">
          No <span className="capitalize">{status}</span> forms found.
        </div>
      );
    }

    return view === "list" ? (
      <FormListView forms={filtered} />
    ) : (
      <FormBoxView forms={filtered} />
    );
  };

  return (
    <Tabs defaultValue="draft" className="w-full space-y-4">
      <TabsList className="flex justify-start gap-2">
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>

      <TabsContent value="draft">{renderForms("draft")}</TabsContent>
      <TabsContent value="published">{renderForms("published")}</TabsContent>
      <TabsContent value="archived">{renderForms("archived")}</TabsContent>
    </Tabs>
  );
}
