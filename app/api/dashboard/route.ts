import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Form } from "@/lib/models/form";
import { authenticateUser } from "@/lib/middleware/auth";
import { Response } from "@/lib/models/response";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allForms = await Form.find({ userId: user._id });

    const sortedForms = [...allForms].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    const activeForms = allForms.filter((form) => form.status === "published");

    const allResponses = await Response.find({ userId: user._id });

    const totalResponses = allResponses.length;

    const submittedForms = allForms.filter((form) =>
      allResponses.some((resp) => resp.formId?.toString() === form._id.toString())
    );

    const draftedForms = allForms.filter((form) => form.status === "draft");

    const DraftedCount = draftedForms.length;

    return NextResponse.json({
      activeForms: activeForms.length,
      totalResponses,
      draftedForms : DraftedCount || 0,
      recentForms: sortedForms.slice(0, 5),
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
