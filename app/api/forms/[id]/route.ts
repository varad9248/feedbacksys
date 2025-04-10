import { connectDB } from "@/lib/db";
import { Form } from "@/lib/models/form";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth"; 

// GET: Fetch form by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB(); 
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await Form.findById(params.id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}

// PUT: Update form by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, elements } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!Array.isArray(elements) || elements.length === 0) {
      return NextResponse.json(
        { error: "At least one element is required" },
        { status: 400 }
      );
    }

    const form = await Form.findById(params.id);

    if(form.userId !== user._id){
      return NextResponse.json({ error: "Your aren't owner You can update the Form" }, { status: 401 });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      form._id,
      {
        $set: {
          title: title.trim(),
          "config.elements": elements,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(updatedForm, { status: 200 });
  } catch (error) {
    console.error("Failed to update form:", error);
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await Form.findById(params.id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "You are not the owner of this form. Deletion is not allowed." },
        { status: 403 }
      );
    }

    await Form.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Form deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete form:", error);
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}
