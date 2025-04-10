import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Form } from "@/lib/models/form";
import { authenticateUser } from "@/lib/middleware/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await Form.findOne({ _id: params.id, userId: user._id });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    form.status = "draft";
    form.publishedAt = null;
    form.shareCode = undefined; // ⬅️ Remove shareCode

    await form.save();

    return NextResponse.json({ message: "Form unpublished", form });
  } catch (error) {
    console.error("Failed to unpublish form:", error);
    return NextResponse.json(
      { error: "Failed to unpublish form" },
      { status: 500 }
    );
  }
}
