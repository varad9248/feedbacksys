import { connectDB } from "@/lib/db";
import { Response } from "@/lib/models/response";
import { Form } from "@/lib/models/form";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await Response.findById(params.id).exec();
    if (!response) {
      return NextResponse.json({ message: "Response not found" }, { status: 404 });
    }

    const form = await Form.findById(response.formId);
    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        response: response.toObject(),
        form: form.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch response:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
