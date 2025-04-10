import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db';
import Contact from '@/lib/models/contact';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()

    await Contact.create({ name, email, message })
    return NextResponse.json({ message: 'Success' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
