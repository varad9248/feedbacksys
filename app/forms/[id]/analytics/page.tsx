"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Users,
  CheckCircle2,
  Star,
  MessageSquare,
  PieChart as PieChartIcon,
  BarChart2,
  ThumbsUp,
  Download,
  Share2,
  ArrowLeft,
  List,
  Text,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";

import { useRouter } from "next/navigation";
import { MetricCard } from "@/components/analysis/MetricCard";
import { StarRatingAnalysis } from "@/components/analysis/StartRatingAnalysis";
import { TextAnalysis } from "@/components/analysis/TextAnalysis";
import { ChoiceAnalysis } from "@/components/analysis/ChoiceAnalysis";
import { DropdownAnalysisBarChart } from "@/components/analysis/DropdownAnalysis";
import { ScaleAnalysis } from "@/components/analysis/ScaleAnaysis";
import { COLORS } from "@/lib/Colours";

interface AnalyticsProps {
  params: {
    id: string;
  };
}

interface AnalyticsData {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  trends: {
    date: string;
    responses: number;
  }[];
  perQuestion: {
    [questionId: string]: {
      type:
      | 'short-text'
      | 'long-text'
      | 'star-rating'
      | 'multiple-choice'
      | 'checkbox'
      | 'scale'
      | 'dropdown'
      | 'boolean';
      question: string;
      responses: any[];
      optionCounts: any;
    };
  };
}


export default function Analytics({ params }: AnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/forms/${params.id}/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-start sm:items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Survey Analysis</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {format(new Date(), "MMM d, yyyy HH:mm")}
            </p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <MetricCard
          title="Total Responses"
          value={analytics.totalResponses}
          icon={Users}
        />
        <MetricCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          icon={CheckCircle2}
        />
        <MetricCard
          title="Average Time"
          value={`${analytics.averageTime}s`}
          icon={Clock}
        />
        <MetricCard
          title="Daily Average"
          value={Math.round(analytics.trends.reduce((acc, curr) => acc + curr.responses, 0) / 7)}
          icon={BarChart2}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Move TabsList OUTSIDE of TabsContent */}
        <div className="sticky top-16 z-10 bg-background pb-2">
          <TabsList className="flex flex-wrap gap-2 w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Trends Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Response Trends</h3>
                  <p className="text-sm text-muted-foreground">Daily response patterns</p>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.trends ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="responses"
                      stroke={COLORS[0]}
                      strokeWidth={2}
                      dot={{ fill: COLORS[0] }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Question Types Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Question Types</h3>
                  <p className="text-sm text-muted-foreground">Distribution of question formats</p>
                </div>
              </div>
              <ScrollArea className="h-[400px] px-2">
                <div className="space-y-4">
                  {Object.entries(analytics?.perQuestion ?? {}).map(([id, question], index, array) => (
                    <div key={id}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {question.type === 'short-text' && <Text className="h-5 w-5 text-yellow-500" />}
                          {question.type === 'dropdown' && <List className="h-5 w-5 text-yellow-500" />}
                          {question.type === 'star-rating' && <Star className="h-5 w-5 text-yellow-500" />}
                          {question.type === 'long-text' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                          {question.type === 'checkbox' && <CheckSquare className="h-5 w-5 text-green-500" />}
                          {question.type === 'multiple-choice' && <PieChartIcon className="h-5 w-5 text-purple-500" />}
                          {question.type === 'scale' && <BarChart2 className="h-5 w-5 text-orange-500" />}
                          {question.type === 'boolean' && <ThumbsUp className="h-5 w-5 text-pink-500" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{question.question}</p>
                          <p className="text-xs text-muted-foreground">
                            {question.responses?.length ?? 0} responses
                          </p>
                        </div>
                      </div>

                      {/* Only show separator if not the last item */}
                      {index < array.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>

            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <div className="space-y-6">
            {Object.entries(analytics?.perQuestion ?? {}).map(([id, question]) => {
              const data = question.responses ?? [];
              switch (question.type) {
                case 'star-rating':
                  return <StarRatingAnalysis key={id} data={data} />;
                case 'long-text':
                  return <TextAnalysis key={id} data={data} type="long" />;
                case 'checkbox':
                  return <ChoiceAnalysis key={id} question={question.question} optionCounts={question.optionCounts} type={"checkbox"} />;
                case 'multiple-choice':
                  return <ChoiceAnalysis key={id} question={question.question} optionCounts={question.optionCounts} type={"multiple-choice"} />;
                case 'dropdown':
                  return <DropdownAnalysisBarChart key={id} question={question.question} optionsCounts={question.optionCounts} />;
                case 'scale':
                  return <ScaleAnalysis key={id} data={data} />;
                case 'short-text':
                  return <TextAnalysis key={id} data={data} type="short" />;
                default:
                  return null;
              }
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Response Timeline</h3>
                <p className="text-sm text-muted-foreground">View response patterns over time</p>
              </div>
              <Select defaultValue="daily">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.trends ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke={COLORS[0]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[0] }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}