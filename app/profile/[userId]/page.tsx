"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface User {
  name: string;
  email: string;
  bio?: string;
  location?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  const userId = params?.userId as string;

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const fields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Location", key: "location" },
    { label: "Bio", key: "bio" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        User not found.
      </div>
    );
  }

  return (
    <motion.div
      className="container max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6 text-black dark:text-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-black dark:border-white text-black dark:text-white w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold">
          {user.name}&apos;s Profile
        </h1>
      </div>

      {/* Profile Card */}
      <Card className="bg-white dark:bg-black border border-black dark:border-white rounded-xl">
        <CardContent className="p-4 sm:p-6 space-y-6">
          {fields.map((field, idx) => {
            const value = user[field.key as keyof User];
            return (
              <div key={idx}>
                <Label className="text-sm text-muted-foreground">
                  {field.label}
                </Label>
                <p className="text-base font-medium mt-1 break-words">
                  {value || (
                    <span className="text-gray-500 dark:text-gray-400">
                      Not provided
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
