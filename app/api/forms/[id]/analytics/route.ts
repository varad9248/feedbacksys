import { connectDB } from "@/lib/db";
import { Response as FormResponse } from "@/lib/models/response";
import { Form } from "@/lib/models/form";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(request);
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();

    const form = await Form.findById(params.id);
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const responses = await FormResponse.find({ formId: params.id });
    const totalResponses = responses.length;

    const completedResponses = responses.filter(
      (response) => response.data && Object.keys(response.data).length > 0
    ).length;

    const completionRate = totalResponses
      ? Math.round((completedResponses / totalResponses) * 100)
      : 0;

    // Trends for the last 7 days
    const trends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayResponses = responses.filter((response) => {
        const submitted = new Date(response.submittedAt);
        return submitted >= date && submitted < nextDate;
      }).length;

      return {
        date: date.toLocaleDateString(),
        responses: dayResponses,
      };
    }).reverse();

    const elements = form.config?.elements || [];
    const perQuestion: Record<string, any> = {};

    elements.forEach((element: any) => {
      const { id, question, type, options = [] } = element;
      if (!id || !type) return;

      const fieldResponses = responses
        .map((r) => r.data?.[id])
        .filter((r) => r !== undefined && r !== null);

      const analysis: any = {
        question,
        type,
        responses: fieldResponses,
      };

      if (
        ["multiple-choice", "dropdown", "checkbox", "star-rating", "single-choice"].includes(type)
      ) {
        const counts: Record<string, number> = {};
        options.forEach((option: string) => {
          counts[option] = 0;
        });

        fieldResponses.forEach((value: any) => {
          if (Array.isArray(value)) {
            value.forEach((v: string) => {
              counts[v] = (counts[v] || 0) + 1;
            });
          } else {
            counts[value] = (counts[value] || 0) + 1;
          }
        });

        analysis.optionCounts = counts;
      } else if (["short-text", "long-text"].includes(type)) {
        analysis.responseCount = fieldResponses.length;
        analysis.averageLength = fieldResponses.length
          ? Math.round(
              fieldResponses.reduce((sum, val) => sum + val.length, 0) / fieldResponses.length
            )
          : 0;
      } else if (["number", "rating", "scale"].includes(type)) {
        const numericVals = fieldResponses.map(Number).filter((v) => !isNaN(v));
        analysis.count = numericVals.length;
        analysis.average = numericVals.length
          ? Number((numericVals.reduce((a, b) => a + b, 0) / numericVals.length).toFixed(2))
          : 0;
        analysis.min = numericVals.length ? Math.min(...numericVals) : null;
        analysis.max = numericVals.length ? Math.max(...numericVals) : null;
      } else if (type === "boolean") {
        const counts = { true: 0, false: 0 };
        fieldResponses.forEach((v) => {
          if (v === true || v === "true") counts.true += 1;
          else if (v === false || v === "false") counts.false += 1;
        });
        analysis.optionCounts = counts;
      } else if (["date", "time"].includes(type)) {
        analysis.count = fieldResponses.length;
      }

      perQuestion[id] = analysis;
    });

    return NextResponse.json({
      totalResponses,
      completionRate,
      averageTime: 120, // Placeholder
      trends,
      perQuestion,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
