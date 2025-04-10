"use client";

import { useQuery } from "@tanstack/react-query";

interface Form {
  _id: string;
  title: string;
  status: "draft" | "published" | "archived";
  shareCode : string;
  createdAt: string;
  config: {
    elements: any[];
  };
}

interface ApiData {
  activeForms: number;
  totalResponses: number;
  draftedForms: number;
  recentForms: Form[] | [];
}

const fetchDashboardData = async (): Promise<ApiData> => {
  const response = await fetch("/api/dashboard");
  if (!response.ok) throw new Error("Failed to fetch dashboard data");
  return response.json();
};

export function useDashboardData() {
  return useQuery<ApiData>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    staleTime: 60000, 
    refetchOnWindowFocus: true, 
    retry: 2,
  });
}
