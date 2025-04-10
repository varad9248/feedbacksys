"use client";
import { Card } from "../ui/card";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string | React.ReactNode;
};

export function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="h-8 w-8 text-primary opacity-75" />
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          {trend}
        </div>
      )}
    </Card>
  );
}