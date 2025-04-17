"use client";

import { Form } from "@/app/forms/page";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import FormActions from "./FormActions";
import { StatusSwitcher } from "./FormStatusToggle";
import { motion } from "framer-motion";  // Import motion from framer-motion

export default function FormBoxView({ forms }: { forms: Form[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <motion.div
          key={form._id}
          initial={{ opacity: 0, scale: 0.95 }}  // Start with low opacity and scale
          animate={{ opacity: 1, scale: 1 }}  // Animate to full opacity and normal scale
          exit={{ opacity: 0, scale: 0.95 }}  // Fade out and scale down on exit
          transition={{ duration: 0.3 }}  // Animation duration
        >
          <Card
            className="p-5 shadow-md border border-border bg-muted/10 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-foreground">{form.title}</h3>
              <FormActions form={form} />
            </div>

            <div className="text-sm text-muted-foreground mb-3">
              {form.config.elements.length}{" "}
              {form.config.elements.length === 1 ? "Question" : "Questions"}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <StatusSwitcher
                formId={form._id}
                currentStatus={form.status}
                onStatusChange={(newStatus) => {
                  form.status = newStatus; // Local update (will persist after reload via API)
                }}
              />
              <span>{format(new Date(form.createdAt), "MMM d, yyyy")}</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
