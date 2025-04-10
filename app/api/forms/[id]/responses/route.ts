// app/api/forms/[id]/responses/route.ts
import { connectDB } from "@/lib/db";
import { authenticateUser } from "@/lib/middleware/auth";
import { Form } from "@/lib/models/form";
import { Response } from "@/lib/models/response";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all responses of a form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(request);
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();

    const form = await Form.findById(params.id);
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    const responses = await Response.find({ formId: params.id }).sort({
      submittedAt: -1,
    });

    return NextResponse.json({
      _id: form._id,
      title: form.title,
      config: form.config,
      responses,
    });
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Submit a response to a form
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await Form.findById(params.id);
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    if (form.status !== "published") {
      return NextResponse.json(
        { error: "This form is not accepting responses." },
        { status: 403 }
      );
    }

    if (form.userId.toString() === user._id.toString()) {
      return NextResponse.json(
        { error: "Form owners cannot submit responses" },
        { status: 403 }
      );
    }

    const { data } = await request.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Missing response data" }, { status: 400 });
    }

    const alreadySubmitted = await Response.findOne({
      formId: params.id,
      userId: user._id,
    });

    if (alreadySubmitted) {
      return NextResponse.json(
        { error: "You have already submitted a response." },
        { status: 409 }
      );
    }

    const response = await Response.create({
      formId: params.id,
      userId: user._id,
      data,
      submittedAt: new Date(),
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
