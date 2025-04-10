import { authenticateUser } from "@/lib/middleware/auth";
import {  User } from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
    try {
        const user = await authenticateUser(req);
        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
        return NextResponse.json( { user : user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Server error", user: null }, { status: 500 });
    }
}

// Schema for profile update
const ProfileUpdateSchema = z.object({
    name: z.string().min(1).max(100),
    bio: z.string().max(300).optional(),
    location: z.string().max(100).optional(),
});

export async function PUT(req: NextRequest) {
    try {
        const user: any = await authenticateUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const parsed = ProfileUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: parsed.data,
            },
            { new: true }
        );

        return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}