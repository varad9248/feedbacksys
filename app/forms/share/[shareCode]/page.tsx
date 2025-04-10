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
import PublishedUserBlock from "@/components/forms/FormInformation";

interface FormData {
    _id: string;
    title: string;
    config: {
        elements: FormElement[];
    };
    userId: string;
    status: string;
}

interface CompleteData {
    form: FormData;
    user: any;
}

interface FormViewProps {
    params: {
        shareCode: string;
    };
}

export default function ShareFormView({ params }: FormViewProps) {
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const { data: form, isLoading } = useQuery<CompleteData>({
        queryKey: ["form", params.shareCode],
        queryFn: async () => {
            const response = await fetch(`/api/forms/share/${params.shareCode}`);
            if (!response.ok) throw new Error("Failed to fetch shared form");
            return response.json();
        },
        refetchOnMount: true,
    });

    const { data: responsesData, isLoading: responseLoading } = useQuery<any[]>({
        queryKey: ["responses", form?.form?._id],
        queryFn: async () => {
            if (!form?.form?._id) return [];
            const response = await fetch(`/api/forms/${form?.form?._id}/responses`);
            if (!response.ok) return []; // <- fallback to an empty array
            return response.json();
        },
        enabled: !!form?.form?._id,
        refetchOnMount: true,
    });


    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        if (form && user && responsesData && Array.isArray(responsesData)) {
            const alreadySubmitted = responsesData.some(
                (r: any) => r.userId === user._id
            );
            setHasSubmitted(alreadySubmitted);
        }

        if (form && user) {
            setIsOwner(form?.form?.userId === user._id);
        }
    }, [responsesData, user, form]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (hasSubmitted) {
            toast.error("You have already submitted this form.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/forms/${form?.form?._id}/responses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: responses }),
            });

            if (!response.ok) throw new Error("Failed to submit form");

            toast.success("Form submitted successfully");
            setResponses({});
            setHasSubmitted(true);
        } catch (error: any) {
            toast.error(error.message);
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

    if (hasSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="max-w-xl w-full p-8 shadow-xl rounded-2xl bg-white text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-green-600">🎉 Thank You!</h2>
                    <p className="text-gray-700 text-base">
                        We’ve received your response. Your feedback means a lot!
                    </p>
                    <p className="text-sm text-gray-500">
                        You've already submitted this form. If you think there’s been a mistake, please reach out to the form owner.
                    </p>
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="mt-4"
                    >
                        Go back
                    </Button>
                </Card>
            </div>
        );
    }


    if (!form) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <PublishedUserBlock
                nm={form.user.firstName + " " + form?.user?.lastName}
                email={form.user.email}
                _id={form.user._id}
            />
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
                    <h1 className="text-3xl font-bold mb-8">{form.form.title}</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {form?.form.config.elements.map((element) => (
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
