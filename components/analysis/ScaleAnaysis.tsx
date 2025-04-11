"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card } from "../ui/card";
import { Tooltip } from "../ui/tooltip";
import { COLORS } from "@/lib/Colours";

export function ScaleAnalysis({ data }: { data: number[] }) {
    const distribution = Array(10).fill(0);
    data.forEach((rating) => {
      if (rating >= 1 && rating <= 10) distribution[rating - 1]++;
    });
  
    const chartData = distribution.map((count, index) => ({
      rating: index + 1,
      count,
    }));
  
    const average = data.length ? data.reduce((a, b) => a + b, 0) / data.length : 0;
  
    return (
      <Card className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-md border border-muted">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">Scale Distribution</h3>
          <p className="text-sm text-muted-foreground">Average: {average.toFixed(1)}</p>
        </div>
  
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }