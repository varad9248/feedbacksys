"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResponseViewType {
  response: any;
  form: any;
}

export default function ResponseViewPage() {
  const params = useParams();
  const router = useRouter();

  // Fetch response data using React Query
  const { data, isLoading } = useQuery<ResponseViewType>({
    queryKey: ["response", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/responses/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch response");
      return res.json();
    },
  });

  if (isLoading || !data) {
    return <div className="p-10 text-center text-muted-foreground">Loading response...</div>;
  }

  const { form, response: userResponse } = data;

  console.log(userResponse);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Response Details: {form.title}</h1> {/* Added a more descriptive title */}
          </div>

          {form.config.elements.map((element: any) => (
            <div key={element.id} className="mb-6 space-y-1">
              <Label className="text-base">
                {element.question}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {element.type === "short-text" && (
                <Input readOnly value={userResponse.data[element.id] || ""} />
              )}

              {element.type === "long-text" && (
                <Textarea readOnly value={userResponse.data[element.id] || ""} />
              )}

              {element.type === "multiple-choice" && (
                <div className="space-y-2">
                  {element.options?.map((option: any) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        disabled
                        checked={userResponse.data[element.id] === option}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {element.type === "checkbox" && (
                <div className="space-y-2">
                  {element.options?.map((option: any) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        checked={userResponse.data[element.id]?.includes(option)}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {element.type === "star-rating" && (
                <div className="flex gap-1">
                  {[...Array(element.maxStars || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${userResponse.data[element.id] > i ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              )}

              {element.type === "dropdown" && (
                <Select disabled value={userResponse.data[element.id]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {element.options?.map((option: any) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
