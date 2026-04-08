'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getComments, createComment, updateComment, deleteComment } from '@/lib/comments/actions';
import { getUser } from '@/lib/auth/actions';

interface Comment {
  id: number;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  profiles?: { nickname: string };
  replies: Comment[];
}

export default function CommentsSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    async function fetchData() {
      const [commentsResult, userResult] = await Promise.all([
        getComments(postId),
        getUser(),
      ]);

      if (commentsResult.comments) {
        setComments(commentsResult.comments);
      }
      setUser(userResult);
      setLoading(false);
    }

    fetchData();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const result = await createComment(postId, newComment);
    if (result.success) {
      setNewComment('');
      const { comments: updatedComments } = await getComments(postId);
      if (updatedComments) setComments(updatedComments);
    }
  };

  const handleAddReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    const result = await createComment(postId, replyContent, parentId);
    if (result.success) {
      setReplyContent('');
      setReplyingTo(null);
      const { comments: updatedComments } = await getComments(postId);
      if (updatedComments) setComments(updatedComments);
    }
  };

  const handleUpdateComment = async (id: number) => {
    if (!editContent.trim()) return;

    const result = await updateComment(id, editContent);
    if (result.success) {
      setEditingId(null);
      setEditContent('');
      const { comments: updatedComments } = await getComments(postId);
      if (updatedComments) setComments(updatedComments);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const result = await deleteComment(id);
    if (result.success) {
      const { comments: updatedComments } = await getComments(postId);
      if (updatedComments) setComments(updatedComments);
    }
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isDeleted = comment.is_deleted;
    const isAuthor = user?.id === comment.user_id;

    return (
      <div key={comment.id} className={depth > 0 ? 'ml-6 mt-3' : 'mt-4'}>
        <Card neonBorder={depth > 0 ? 'purple' : 'pink'} className="p-4">
          {isDeleted ? (
            <p className="text-white/40 italic">삭제된 댓글입니다</p>
          ) : editingId === comment.id ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="neon-input w-full resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setEditContent('');
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="neon-text-pink font-medium">
                  {comment.profiles?.nickname || '알 수 없음'}
                </span>
                <span className="text-white/40 text-xs">
                  {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-white/90 whitespace-pre-wrap">{comment.content}</p>

              <div className="flex gap-2 mt-3">
                {user && depth === 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    답글
                  </Button>
                )}
                {isAuthor && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="neon-input w-full resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                  답글 작성
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </Card>

        {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="text-center py-8">
        <p className="text-white/60">로딩 중...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="neon-text-purple text-xl font-bold">
        댓글 ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="neon-input w-full resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              댓글 작성
            </Button>
          </div>
        </form>
      ) : (
        <Card className="text-center py-6">
          <p className="text-white/60">
            댓글을 작성하려면{' '}
            <a href="/login" className="neon-text-blue">
              로그인
            </a>
            이 필요합니다
          </p>
        </Card>
      )}

      <div className="space-y-2">
        {comments.length === 0 ? (
          <Card className="text-center py-6">
            <p className="text-white/60">아직 댓글이 없습니다</p>
          </Card>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}