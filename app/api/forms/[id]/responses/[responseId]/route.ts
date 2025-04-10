import { connectDB } from "@/lib/db";
import { authenticateUser } from "@/lib/middleware/auth";
import { Form } from "@/lib/models/form";
import { Response } from "@/lib/models/response";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Delete all responses of a form (only by owner)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string , responseId : string } }
) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log(user);

    const form = await Form.findById(params.id);
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    console.log(form);

    if (form.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await Response.deleteOne({ _id : params.responseId });

    console.log(deleted);

    return NextResponse.json({
      message: `Deleted ${deleted.deletedCount} responses.`,
    });
  } catch (error) {
    console.error("Delete responses error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
