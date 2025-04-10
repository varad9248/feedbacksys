'use client';
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800">
          <CardContent className="p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black dark:text-white">Terms & Conditions</h1>
            <p className="mb-4 text-black dark:text-white">By using FeedForms, you agree to the following:</p>
            <ul className="list-disc pl-6 space-y-2 text-black dark:text-white">
              <li>You must provide accurate feedback and not impersonate others.</li>
              <li>Your account information must be kept secure.</li>
              <li>FeedForms reserves the right to update these terms at any time.</li>
              <li>We may suspend accounts that violate our policies.</li>
            </ul>
            <p className="mt-6 text-sm text-zinc-500">Last updated: April 2025</p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}