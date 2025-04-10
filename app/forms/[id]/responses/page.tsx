"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unparse } from "papaparse";
import axios from "axios";
import { toast } from "sonner";

interface Response {
  _id: string;
  data: Record<string, any>;
  submittedAt: string;
  userId?: string;
}

interface FormResponse {
  _id: string;
  title: string;
  config: {
    elements: Array<{
      id: string;
      question: string;
      type: string;
    }>;
  };
  responses: Response[];
}

interface ResponsesProps {
  params: {
    id: string;
  };
}

export default function Responses({ params }: ResponsesProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: formData, isLoading, refetch } = useQuery<FormResponse>({
    queryKey: ["form-responses", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/forms/${params.id}/responses`);
      return response.data;
    },
    refetchOnMount: true,
  });

  const formatResponseValue = (value: any, type: string) => {
    if (value === undefined || value === null) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (type === "star-rating") return `${value} stars`;
    return value.toString();
  };

  const filterResponses = (responses: Response[]) => {
    if (filter === "all") return responses;
    const days = parseInt(filter, 10);
    const cutoff = subDays(new Date(), days);
    return responses.filter((res) => new Date(res.submittedAt) >= cutoff);
  };

  const filteredResponses = formData
    ? filterResponses(formData.responses).filter((res) =>
        Object.values(res.data)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDownloadCSV = () => {
    if (!formData) return;

    const csvData = filteredResponses.map((res, i) => {
      const row: any = {
        "Sr No.": i + 1,
        "Submitted At": format(new Date(res.submittedAt), "MMM d, yyyy HH:mm"),
      };
      formData.config.elements.forEach((el) => {
        row[el.question] = formatResponseValue(res.data[el.id], el.type);
      });
      return row;
    });

    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${formData.title}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (responseId: string) => {
    try {
      await axios.delete(`/api/forms/${params.id}/responses/${responseId}`);
      await refetch();
      toast.success("Response deleted successfully");
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete response");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center flex-wrap gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Responses: {formData.title}
        </h1>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Responses</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full sm:w-64"
          />
        </div>

        <Button
          onClick={handleDownloadCSV}
          className="w-full sm:w-auto text-sm"
        >
          Download CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No.</TableHead>
                <TableHead>Submitted</TableHead>
                {formData.config.elements.map((element) => (
                  <TableHead key={element.id}>{element.question}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.length > 0 ? (
                filteredResponses.map((response, index) => (
                  <TableRow key={response._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {format(new Date(response.submittedAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    {formData.config.elements.map((element) => (
                      <TableCell key={element.id}>
                        {formatResponseValue(response.data[element.id], element.type)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                if (typeof window !== "undefined") {
                                  router.push(`/profile/${response.userId}`);
                                }
                              }}
                              className="flex items-center w-full justify-start"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View User
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              onClick={() => handleDelete(response._id)}
                              className="flex items-center w-full justify-start text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={formData.config.elements.length + 3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No responses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
