import Card from '@/components/ui/Card';
import { getPosts } from '@/lib/posts/actions';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { posts } = await getPosts(page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="neon-text-blue text-3xl font-bold">게시글 목록</h2>
        <a
          href="/posts/new"
          className="neon-button inline-block text-center"
        >
          글쓰기
        </a>
      </div>

      <Card className="overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p className="mb-2">아직 게시글이 없습니다</p>
            <p>첫 번째 게시글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-neon-pink to-neon-purple text-white">
                <tr>
                  <th className="px-4 py-3 text-left">번호</th>
                  <th className="px-4 py-3 text-left">제목</th>
                  <th className="px-4 py-3 text-left">작성자</th>
                  <th className="px-4 py-3 text-left">작성일</th>
                  <th className="px-4 py-3 text-left">댓글</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {posts.map((post: any, index: number) => (
                  <tr
                    key={post.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => window.location.href = `/posts/${post.id}`}
                  >
                    <td className="px-4 py-3">{(page - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="neon-text-blue hover:neon-blue-glow transition-all">
                        {post.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 neon-text-pink">
                      {post.profiles?.nickname || '알 수 없음'}
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded bg-neon-purple/20 text-neon-purple text-sm">
                        {post.comments?.[0]?.count || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}