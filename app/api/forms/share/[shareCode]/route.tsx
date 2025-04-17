import { connectDB } from "@/lib/db";
import { authenticateUser } from "@/lib/middleware/auth";
import { Form } from "@/lib/models/form";
import { Response } from "@/lib/models/response";
import { User } from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { shareCode: string } }
) {
  try {

    const reqUser = await authenticateUser(request);
    if (!reqUser) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    await connectDB();

    const form = await Form.findOne({
      shareCode: params.shareCode,
      status: "published", 
    });

    const user = await User.findOne({ _id: form.userId });

    if (!user) {
      return new Response("User not found", {
        status: 404,
      });
    }

    if (!form) {
      return NextResponse.json(
        { message: "Form not found or not published." },
        { status: 404 }
      );
    }

    const alreadySubmitted = await Response.find({ formId: form._id, userId: reqUser._id });

    if (alreadySubmitted.length > 0) {
      return NextResponse.json(
        { message: "You have already submitted this form. Please try another one." },
        { status: 400 }
      );
    }

    return NextResponse.json({ form, user }, { status: 200 });
  } catch (error) {
    console.error("[GET_FORM_BY_SHARE_CODE_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
