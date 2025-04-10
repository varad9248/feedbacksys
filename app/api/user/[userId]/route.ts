import { connectDB } from "@/lib/db";
import { authenticateUser } from "@/lib/middleware/auth";
import { User } from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {

    const requestUser = await authenticateUser(req);

    if(requestUser){
        NextResponse.json({ error : "unauthoried"} , { status : 404});
    }

    await connectDB();

    const user = await User.findById(params.userId).select("name email bio location");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
