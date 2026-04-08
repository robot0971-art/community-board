import { notFound } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getPost } from '@/lib/posts/actions';
import { getUser } from '@/lib/auth/actions';
import CommentsSection from '@/components/CommentsSection';

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { post, error } = await getPost(Number(params.id));

  if (error || !post) {
    notFound();
  }

  const user = await getUser();
  const isAuthor = user?.id === post.user_id;

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h1 className="neon-text-pink text-3xl font-bold">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span className="neon-text-pink">
              {post.profiles?.nickname || '알 수 없음'}
            </span>
            <span>•</span>
            <span>
              {new Date(post.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span>•</span>
            <span className="neon-text-blue">조회 {post.view_count}</span>
          </div>

          {post.post_images && post.post_images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {post.post_images.map((image: any) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt="게시글 이미지"
                  className="w-full rounded-lg border-2 border-neon-purple/30 hover:border-neon-blue transition-all"
                />
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-white/90">{post.content}</p>
          </div>

          {isAuthor && (
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <a href={`/posts/edit/${post.id}`}>
                <Button variant="secondary" size="sm">수정</Button>
              </a>
              <form action={async () => {
                'use server';
                const { deletePost } = await import('@/lib/posts/actions');
                await deletePost(post.id);
              }}>
                <Button variant="danger" size="sm" type="submit">
                  삭제
                </Button>
              </form>
            </div>
          )}
        </div>
      </Card>

      <CommentsSection postId={post.id} />
    </div>
  );
}