import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/posts/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, images } = body;

    const result = await createPost(title, content, images || []);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '게시글 작성에 실패했습니다' },
      { status: 500 }
    );
  }
}