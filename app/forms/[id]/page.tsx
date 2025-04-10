"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormElement } from "@/types/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

interface FormData {
  _id: string;
  title: string;
  config: {
    elements: FormElement[];
  };
  userId: string;
  status: string;
}

interface FormViewProps {
  params: {
    id: string;
  };
}

export default function FormView({ params }: FormViewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: form, isLoading } = useQuery<FormData>({
    queryKey: ["form", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/forms/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch form");
      return response.json();
    },
    refetchOnMount: true
  });

  useEffect(() => {
    setIsOwner(form?.userId === user?._id);
  }, [form, user?._id])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${params.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: responses }),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      toast.success("Form submitted successfully");
      setResponses({});
    } catch (error) {
      toast.error("Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold mb-8">{form.title}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {form.config.elements.map((element) => (
            <div key={element.id} className="space-y-2">
              <Label>
                {element.question}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {element.type === "short-text" && (
                <Input
                  value={responses[element.id] || ""}
                  onChange={(e) =>
                    setResponses((prev) => ({
                      ...prev,
                      [element.id]: e.target.value,
                    }))
                  }
                  required={element.required}
                />
              )}

              {element.type === "long-text" && (
                <Textarea
                  value={responses[element.id] || ""}
                  onChange={(e) =>
                    setResponses((prev) => ({
                      ...prev,
                      [element.id]: e.target.value,
                    }))
                  }
                  required={element.required}
                />
              )}

              {element.type === "multiple-choice" && (
                <div className="space-y-2">
                  {element.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={element.id}
                        value={option}
                        checked={responses[element.id] === option}
                        onChange={(e) =>
                          setResponses((prev) => ({
                            ...prev,
                            [element.id]: e.target.value,
                          }))
                        }
                        required={element.required}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {element.type === "checkbox" && (
                <div className="space-y-2">
                  {element.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          (responses[element.id] || []).includes(option)
                        }
                        onChange={(e) => {
                          const currentValues = responses[element.id] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter((v: string) => v !== option);
                          setResponses((prev) => ({
                            ...prev,
                            [element.id]: newValues,
                          }));
                        }}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {element.type === "star-rating" && (
                <div className="flex gap-2">
                  {[...Array(element.maxStars || 5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setResponses((prev) => ({
                          ...prev,
                          [element.id]: i + 1,
                        }))
                      }
                      className={`p-1 ${(responses[element.id] || 0) > i
                        ? "text-yellow-400"
                        : "text-gray-300"
                        }`}
                    >
                      <Star className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              )}

              {element.type === "dropdown" && (
                <Select
                  value={responses[element.id] || ""}
                  onValueChange={(value) =>
                    setResponses((prev) => ({
                      ...prev,
                      [element.id]: value,
                    }))
                  }
                  required={element.required}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {element.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

          {isOwner ? (
            <div className="text-sm text-muted-foreground italic">
              This is a preview. You are the owner of this form.
            </div>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          )}

        </form>
      </Card>
    </div>
  );
}