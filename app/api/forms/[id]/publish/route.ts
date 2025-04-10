import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Form } from "@/lib/models/form";
import { authenticateUser } from "@/lib/middleware/auth";

function generateShareCode(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

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

    form.status = "published";
    form.publishedAt = new Date();

    // Add shareCode if not already present
    if (!form.shareCode) {
      form.shareCode = generateShareCode(8); // generate 8-character code
    }

    await form.save();

    return NextResponse.json({
      message: "Form published successfully",
      form,
    });
  } catch (error) {
    console.error("Failed to publish form:", error);
    return NextResponse.json(
      { error: "Failed to publish form" },
      { status: 500 }
    );
  }
}
