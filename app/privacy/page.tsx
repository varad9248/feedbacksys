"use client";
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800">
          <CardContent className="p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black dark:text-white">Privacy Policy</h1>
            <p className="mb-4 text-black dark:text-white">
              FeedForms takes your privacy seriously. This is how we handle your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-black dark:text-white">
              <li>We collect only the necessary information for feedback management.</li>
              <li>Your data will never be shared with third parties without consent.</li>
              <li>All feedback submissions are stored securely.</li>
              <li>You can contact us to request data deletion.</li>
            </ul>
            <p className="mt-6 text-sm text-zinc-500">Last updated: April 2025</p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
