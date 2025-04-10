"use client";

import { useState } from "react";
import { useFormStore } from "@/lib/store/form-store";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormElement, QuestionType } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, GripVertical, Plus, Save, Star, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "short-text", label: "Short Text" },
  { value: "long-text", label: "Long Text" },
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkbox" },
  { value: "star-rating", label: "Star Rating" },
  { value: "dropdown", label: "Dropdown" },
];

interface SortableQuestionProps {
  element: FormElement;
  onRemove: () => void;
  updateElement: (id: string, updates: Partial<FormElement>) => void;
}

function SortableQuestion({ element, onRemove, updateElement }: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(element.options || [])];
    newOptions[index] = value;
    updateElement(element.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`];
    updateElement(element.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = element.options?.filter((_, i) => i !== index);
    updateElement(element.id, { options: newOptions });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-6"
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
        </div>
        <div className="flex-1 space-y-4">
          <Select
            value={element.type}
            onValueChange={(value: QuestionType) => {
              const updates: Partial<FormElement> = { type: value };

              // Initialize options for types that need them
              if (["multiple-choice", "checkbox", "dropdown"].includes(value)) {
                updates.options = ["Option 1", "Option 2", "Option 3"];
              }

              // Initialize maxStars for star rating
              if (value === "star-rating") {
                updates.maxStars = 5;
              }

              updateElement(element.id, updates);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={element.question}
            onChange={(e) =>
              updateElement(element.id, { question: e.target.value })
            }
            placeholder="Enter question"
          />

          {/* Options for multiple choice, checkbox, and dropdown */}
          {["multiple-choice", "checkbox", "dropdown"].includes(element.type) && (
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value ? e.target.value : " ")}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={element.options?.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full mt-2"
              >
                Add Option
              </Button>
            </div>
          )}

          {/* Star rating configuration */}
          {element.type === "star-rating" && (
            <div className="space-y-2">
              <Label>Number of Stars</Label>
              <Select
                value={element.maxStars?.toString() || "5"}
                onValueChange={(value) =>
                  updateElement(element.id, { maxStars: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select max stars" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 7, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              checked={element.required}
              onCheckedChange={(checked) =>
                updateElement(element.id, { required: checked })
              }
            />
            <Label>Required</Label>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const { elements, addElement, removeElement, updateElement, reorderElements } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createFormMutation = useMutation({
    mutationFn: async (formData: { title: string; elements: FormElement[] }) => {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create form");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Form created successfully");
      if(typeof window !== "undefined"){
        router.push("/forms");
    }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create form");
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((item) => item.id === active.id);
      const newIndex = elements.findIndex((item) => item.id === over.id);
      reorderElements(oldIndex, newIndex);
    }
  };

  const handleAddElement = () => {
    addElement({
      id: crypto.randomUUID(),
      type: "short-text",
      question: "",
      required: false,
    });
  };

  const handleSave = () => {
    if (!title) {
      toast.error("Please enter a form title");
      return;
    }
    if (elements.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    // Validate all questions have titles
    const emptyQuestions = elements.some(element => !element.question.trim());
    if (emptyQuestions) {
      toast.error("All questions must have a title");
      return;
    }

    createFormMutation.mutate({ title, elements });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Create Form</h1>
        </div>
        <Button onClick={handleSave} disabled={createFormMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
              className="mt-2"
            />
          </Card>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={elements.map(e => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {elements.map((element) => (
                  <SortableQuestion
                    key={element.id}
                    element={element}
                    onRemove={() => removeElement(element.id)}
                    updateElement={updateElement}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button onClick={handleAddElement} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="lg:sticky lg:top-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">{title || "Untitled Form"}</h3>
              {elements.map((element) => (
                <div key={element.id} className="space-y-2">
                  <Label>
                    {element.question || "Untitled Question"}
                    {element.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {element.type === "short-text" && <Input disabled />}
                  {element.type === "long-text" && <Textarea disabled />}
                  {element.type === "multiple-choice" && (
                    <div className="space-y-2">
                      {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input type="radio" name={`radio-${element.id}`} disabled />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {element.type === "checkbox" && (
                    <div className="space-y-2">
                      {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input type="checkbox" disabled />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {element.type === "star-rating" && (
                    <div className="flex gap-2">
                      {Array.from({ length: element.maxStars || 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 text-muted-foreground"
                        />
                      ))}
                    </div>
                  )}
                  {element.type === "dropdown" && (
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option + " "}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}