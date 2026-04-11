import { NextRequest, NextResponse } from 'next/server';
import { createComment, getComments } from '@/lib/comments/actions';

export async function GET(request: NextRequest) {
  const postId = Number(request.nextUrl.searchParams.get('postId'));

  if (Number.isNaN(postId)) {
    return NextResponse.json({ error: '유효한 게시글 ID가 필요합니다' }, { status: 400 });
  }

  const result = await getComments(postId);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ comments: result.comments });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postId = Number(body.postId);
    const parentId = body.parentId ? Number(body.parentId) : undefined;
    const content = typeof body.content === 'string' ? body.content : '';

    if (Number.isNaN(postId)) {
      return NextResponse.json({ error: '유효한 게시글 ID가 필요합니다' }, { status: 400 });
    }

    if (parentId !== undefined && Number.isNaN(parentId)) {
      return NextResponse.json({ error: '유효한 부모 댓글 ID가 필요합니다' }, { status: 400 });
    }

    const result = await createComment(postId, content, parentId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '댓글 작성에 실패했습니다' }, { status: 500 });
  }
}
