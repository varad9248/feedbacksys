import { connectDB } from '@/lib/db';
import { Form } from '@/lib/models/form';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/middleware/auth';

// ✅ POST: Create a new form
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, elements } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Form title is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(elements) || elements.length === 0) {
      return NextResponse.json(
        { error: 'At least one form element is required' },
        { status: 400 }
      );
    }

    const form = await Form.create({
      title: title.trim(),
      config: { elements },
      status: 'draft', // default status
      userId: user._id,
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Failed to create form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}

// ✅ GET: Fetch all forms created by the authenticated user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const forms = await Form.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}
