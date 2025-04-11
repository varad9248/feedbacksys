"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card } from "../ui/card";
import { Tooltip } from "../ui/tooltip";
import { ResponciveStatistics } from "./ResponsiceStatestics";
import { COLORS } from "@/lib/Colours";

export const DropdownAnalysisBarChart = ({
  question,
  optionsCounts,
}: {
  question: string;
  optionsCounts: any;
}) => {

  const data = Object.entries(optionsCounts).map(([option, count]) => ({
    name: option.trim(),
    value: count,
  }));

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-md border border-muted">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Dropdown Analysis</h3>
        <p className="text-sm text-muted-foreground">Dropdown Responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats */}
        <ResponciveStatistics key={question} data={data} question={question} />

        {/* Chart */}
        <div>
          <h4 className="text-base font-semibold mb-4 text-foreground">Visual Representation</h4>
          <div className="bg-muted/10 p-5 rounded-xl shadow-sm border border-border">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS[2]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};