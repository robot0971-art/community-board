import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/actions';

export async function GET() {
  const user = await getUser();
  return NextResponse.json({ user });
}
