'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signUp } from '@/lib/auth/actions';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = '이메일을 입력해주세요';
    if (!username || username.length < 4) newErrors.username = '아이디는 4자 이상 입력해주세요';
    if (!nickname || nickname.length < 2) newErrors.nickname = '닉네임은 2자 이상 입력해주세요';
    if (!password || password.length < 6) newErrors.password = '비밀번호는 6자 이상 입력해주세요';
    if (password !== confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    const result = await signUp(email, username, nickname, password);
    
    if (result?.error) {
      setErrors({ general: result.error });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="neon-gradient-text text-3xl font-bold">
            회원가입
          </h1>
          <p className="text-white/60">Community Lounge에 오신 것을 환영합니다</p>
        </div>

        <form action={async (formData) => {
          const email = formData.get('email') as string;
          const username = formData.get('username') as string;
          const nickname = formData.get('nickname') as string;
          const password = formData.get('password') as string;
          
          const result = await signUp(email, username, nickname, password);
          if (result?.error) setErrors({ general: result.error });
        }} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            error={errors.email}
            required
          />

          <Input
            label="아이디"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="4-20자, 영문/숫자"
            error={errors.username}
            required
          />

          <Input
            label="닉네임"
            type="text"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="2-10자"
            error={errors.nickname}
            required
          />

          <Input
            label="비밀번호"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            error={errors.password}
            required
          />

          <Input
            label="비밀번호 확인"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재입력"
            error={errors.confirmPassword}
            required
          />

          {errors.general && (
            <p className="text-neon-red text-center shake">{errors.general}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-white/60">
            이미 계정이 있으신가요?{' '}
            <a href="/login" className="neon-text-blue hover:neon-blue-glow transition-all">
              로그인
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}