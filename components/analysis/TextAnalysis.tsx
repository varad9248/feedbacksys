"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "../ui/card";
import { Tooltip } from "../ui/tooltip";
import Sentiment  from "sentiment";
import { COLORS } from "@/lib/Colours";

const sentiment = new Sentiment();

export function TextAnalysis({ data, type }: { data: string[]; type: 'short' | 'long' }) {
  const sentiments = data.map((text) => sentiment.analyze(text));

  const sentimentData = [
    { name: 'Positive', value: sentiments.filter((s) => s.score > 0).length },
    { name: 'Neutral', value: sentiments.filter((s) => s.score === 0).length },
    { name: 'Negative', value: sentiments.filter((s) => s.score < 0).length },
  ];

  const avgLength = data.length
    ? Math.round(data.reduce((acc, text) => acc + text.length, 0) / data.length)
    : 0;

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-md border border-muted">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Text Analysis</h3>
        <p className="text-sm text-muted-foreground">
          {type === 'short' ? 'Short Answer' : 'Long Answer'} Responses
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Block */}
        <div className="bg-muted/10 p-5 rounded-xl shadow-sm border border-border">
          <h4 className="text-base font-semibold text-foreground mb-4">Response Statistics</h4>
          <dl className="space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Total Responses</dt>
              <dd className="text-base font-medium">{data.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Average Length</dt>
              <dd className="text-base font-medium">{avgLength} characters</dd>
            </div>
          </dl>
        </div>

        {/* Pie Chart Block */}
        <div className="bg-muted/10 p-5 rounded-xl shadow-sm border border-border">
          <h4 className="text-base font-semibold text-foreground mb-4">Sentiment Breakdown</h4>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>

  );
}