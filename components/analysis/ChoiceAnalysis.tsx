"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "../ui/card";
import { ResponciveStatistics } from "./ResponsiceStatestics";
import { Tooltip } from "../ui/tooltip";
import { COLORS } from "@/lib/Colours";


interface ChoiceAnalysisProps {
    optionCounts: Record<string, number>;
    type: 'multiple-choice' | 'checkbox';
    question: string;
  }
  
  export function ChoiceAnalysis({ optionCounts, type, question }: ChoiceAnalysisProps) {
    const data = Object.entries(optionCounts).map(([name, value]) => ({
      name,
      value,
    }));
  
  
    return (
      <Card className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-md border border-muted space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">{type == "checkbox" ? "Multiple-Choice" : "Single-Choice"} Analysis</h3>
          <p className="text-sm text-muted-foreground">
            User-selected responses for dropdown or choice inputs
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Stats */}
          <ResponciveStatistics key={type} data={data} question={question} />
  
          {/* Right - Chart */}
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    );
  }