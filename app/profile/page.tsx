"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Save, Lock, LockOpen, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import framer-motion

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setFormData(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setUser(data.user);
      toast.success("Profile updated!");
      setEditMode(false);
    } else {
      toast.error(data.error || "Something went wrong");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordLoading) return;

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ password: newPassword }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Password updated successfully");
        setShowPasswordEdit(false);
        setNewPassword("");
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (!user || !formData) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Unauthorized access or user not found.
      </div>
    );
  }

  const fields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email", readonly: true },
    { label: "Location", key: "location" },
    { label: "Bio", key: "bio" },
  ];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/profile/${user._id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setFormData(user);
            }}
          >
            {editMode ? "Cancel" : <><Pencil className="h-4 w-4 mr-2" /> Edit</>}
          </Button>
          <Button
            variant={showPasswordEdit ? "default" : "outline"}
            onClick={() => setShowPasswordEdit(!showPasswordEdit)}
          >
            {showPasswordEdit ? (
              <LockOpen className="h-4 w-4 mr-2" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Password
          </Button>
        </div>
      </div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="space-y-4 p-6">
            {fields.map((field, idx) => (
              <div key={idx}>
                <Label>{field.label}</Label>
                <Input
                  value={(formData[field.key as keyof User] || "")}
                  onChange={(e) => handleChange(field.key as keyof User, e.target.value)}
                  readOnly={!editMode || field.readonly}
                />
              </div>
            ))}

            {editMode && (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Change Section */}
      {showPasswordEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button onClick={handlePasswordChange} disabled={passwordLoading}>
                {passwordLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
