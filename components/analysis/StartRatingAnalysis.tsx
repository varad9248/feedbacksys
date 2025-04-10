"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card } from "../ui/card";
import { Tooltip } from "../ui/tooltip";
import { COLORS } from "@/lib/Colours";

export function StarRatingAnalysis({ data }: { data: number[] }) {
    const distribution = Array(5).fill(0);
    data.forEach((rating) => {
      if (rating >= 1 && rating <= 5) distribution[rating - 1]++;
    });
  
    const chartData = distribution.map((count, index) => ({
      rating: `${index + 1} Star${index + 1 > 1 ? "s" : ""}`,
      count,
    }));
  
    const average =
      data.length > 0 ? data.reduce((sum, val) => sum + val, 0) / data.length : 0;
  
    return (
      <Card className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-md border border-muted space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Star Rating Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Overview of user ratings from 1 to 5 stars.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 📊 Statistics Section */}
          <div className="space-y-4 bg-muted/10 p-5 rounded-xl shadow-inner border border-border">
            <h4 className="text-base font-semibold text-foreground mb-2">Statistics</h4>
  
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Ratings:</span>
              <span className="font-medium text-foreground">{data.length}</span>
            </div>
  
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average Rating:</span>
              <span className=" font-bold text-lg">{average.toFixed(1)} ⭐</span>
            </div>
  
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ratings Breakdown:</p>
              <ul className="space-y-1 text-sm">
                {chartData.map((item, index) => (
                  <li key={index} className="flex justify-between px-2 py-1 rounded-md hover:bg-white/10">
                    <span className="text-foreground">{item.rating}</span>
                    <span className="font-medium text-muted-foreground">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* 📈 Graph Section */}
          <div className="h-[300px]">
            <h4 className="text-base font-semibold text-foreground mb-2">Graph View</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count">
                  {chartData.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    );
  }