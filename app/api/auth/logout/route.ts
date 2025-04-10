import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    cookies().delete("token");
    return NextResponse.json({
      message : "user logout",
      status : 200
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}