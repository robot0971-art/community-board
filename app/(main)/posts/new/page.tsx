'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createPost } from '@/lib/posts/actions';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      const result = await createPost(title, content);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('게시글 작성에 실패했습니다');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="space-y-6">
        <h2 className="neon-text-blue text-2xl font-bold">게시글 작성</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            required
          />

          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              maxLength={5000}
              rows={10}
              className="neon-input w-full resize-none"
              required
            />
            <p className="text-white/40 text-sm">{content.length} / 5000자</p>
          </div>

          {error && (
            <p className="text-neon-red text-center shake">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '작성 중...' : '작성하기'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}