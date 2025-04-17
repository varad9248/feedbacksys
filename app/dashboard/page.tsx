"use client";
import { Card } from "@/components/ui/card";
import { useDashboardData } from "@/lib/hooks/useDashboard";
import { Users, FileText, FileEdit } from "lucide-react";
import FormListView from "@/components/forms/FormListView";
import { motion } from "framer-motion";  // Import motion from framer-motion

export default function Dashboard() {
  const { data: HomeData, isLoading, error } = useDashboardData();

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Overview of your form analytics
          </p>
        </div>
      </div>

      {/* State */}
      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error loading data</p>
      ) : (
        <>
          {/* Stats Grid with Animation */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
            initial={{ opacity: 0 }}  // Start with zero opacity
            animate={{ opacity: 1 }}  // Fade in
            transition={{ duration: 0.5 }}  // Smooth transition
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}  // Fade in with slide up effect
              animate={{ opacity: 1, y: 0 }}   // Fade in and slide to original position
              transition={{ duration: 0.5 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  <div>
                    <h2 className="text-base font-bold">{HomeData?.activeForms ?? 0}</h2>
                    <p className="text-muted-foreground text-sm">Active Forms</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  <div>
                    <h2 className="text-base font-bold">{HomeData?.totalResponses ?? 0}</h2>
                    <p className="text-muted-foreground text-sm">Total Responses</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <FileEdit className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  <div>
                    <h2 className="text-base font-bold">{HomeData?.draftedForms ?? 0}</h2>
                    <p className="text-muted-foreground text-sm">Drafted Forms</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Recent Forms with Animation */}
          <motion.div
            className="w-full py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent Forms</h3>

              {HomeData?.recentForms && HomeData?.recentForms.length > 0 ? (
                <FormListView forms={HomeData?.recentForms} />
              ) : (
                <div className="text-muted-foreground text-center py-10 text-sm">
                  No recent forms found.
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
