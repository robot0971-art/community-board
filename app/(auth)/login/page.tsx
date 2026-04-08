'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signIn } from '@/lib/auth/actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="neon-gradient-text text-3xl font-bold">
            Community Lounge
          </h1>
          <p className="neon-text-blue">크리에이티브한 사람들의 라운지</p>
        </div>

        <form action={async (formData) => {
          const result = await signIn(formData.get('email') as string, formData.get('password') as string);
          if (result?.error) setError(result.error);
        }} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
          
          <Input
            label="비밀번호"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-neon-red text-center shake">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-white/60">
            계정이 없으신가요?{' '}
            <a href="/register" className="neon-text-blue hover:neon-blue-glow transition-all">
              회원가입
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}