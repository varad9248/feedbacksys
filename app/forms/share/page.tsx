"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";  // Import motion from framer-motion

export default function ShareFormLookup() {
  const [shareCode, setShareCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFindForm = async () => {
    if (!shareCode.trim()) {
      toast.warning("Please enter a share code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/forms/share/${shareCode.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid code");
      }

      toast.success("Form found! Redirecting...");
      if (typeof window !== "undefined") {
        router.push(`/forms/share/${shareCode.trim()}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Unable to find form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Main Card with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}  // Start with low opacity and translated down
          animate={{ opacity: 1, y: 0 }}   // Fade in and move to normal position
          exit={{ opacity: 0, y: -20 }}    // Fade out and translate up when exiting
          transition={{ duration: 0.5 }}    // Smooth transition
        >
          <Card className="p-5 sm:p-6 border bg-white dark:bg-inherit text-black dark:text-white rounded-xl shadow">
            <div className="mb-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold">Access Shared Form</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Use the code provided to view the form.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                placeholder="Enter share code"
                className="text-base"
              />

              <Button
                onClick={handleFindForm}
                className="w-full text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Form...
                  </>
                ) : (
                  "View Form"
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Info Card with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}  // Start with low opacity and translated down
          animate={{ opacity: 1, y: 0 }}   // Fade in and move to normal position
          transition={{ duration: 0.5, delay: 0.3 }}  // Smooth transition with slight delay
        >
          <Card className="p-4 sm:p-5 border-l-4 bg-white dark:bg-inherit text-black dark:text-white rounded-xl shadow">
            <div className="flex items-start gap-3">
              <Info className="text-black dark:text-white w-5 h-5 mt-1 shrink-0" />
              <div className="text-sm">
                <h3 className="font-semibold mb-1 text-base">How it works</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Get a valid <span className="font-medium">share code</span> from the form owner.
                  </li>
                  <li>
                    Paste it into the input field above and click <strong>View Form</strong>.
                  </li>
                  <li>
                    You&apos;ll be redirected to the form if the code is valid.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
