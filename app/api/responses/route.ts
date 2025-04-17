// pages/api/responses/user.ts

import { connectDB } from "@/lib/db";
import { Response } from "@/lib/models/response";
import { Form } from "@/lib/models/form";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responses = await Response.find({ userId: user._id }).sort({ createdAt: -1 }); 

    if (!responses || responses.length === 0) {
      return NextResponse.json({ message: "No responses found" }, { status: 404 });
    }

    const responsesWithForms = await Promise.all(
      responses.map(async (response) => {
        const form = await Form.findById(response.formId);
        return { ...response.toObject(), form };  
      })
    );

    return NextResponse.json(responsesWithForms.reverse(), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 });
  }
}
