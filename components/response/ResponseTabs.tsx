"use client";

import { Response } from "@/app/responses/page";
import ResponseListView from "./ResponseListView";
import ResponseBoxView from "./ResponseBoxView";

interface Props {
  responses: Response[] | null | undefined;
  view: "list" | "box";
}

export default function ResponseView({ responses, view }: Props) {
  if (!responses || responses.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-20 text-sm">
        No responses available.
      </div>
    );
  }

  return view === "list" ? (
    <ResponseListView responses={responses} />
  ) : (
    <ResponseBoxView responses={responses} />
  );
}
