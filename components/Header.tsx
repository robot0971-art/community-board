import { getUser, getProfile } from '@/lib/auth/actions';

export default async function Header() {
  const user = await getUser();
  let profile = null;
  
  if (user) {
    profile = await getProfile(user.id);
  }

  return (
    <header className="glass-card sticky top-0 z-50 px-6 py-4 border-b border-neon-purple/30">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="neon-gradient-text text-2xl font-bold">
          Community Lounge
        </a>
        <nav className="flex items-center gap-4">
          {user && profile ? (
            <>
              <span className="text-white/80">
                {profile.nickname}님
              </span>
              <a
                href="/posts/new"
                className="neon-text-blue hover:neon-blue-glow transition-all"
              >
                글쓰기
              </a>
              <form action={async () => {
                'use server';
                const { signOut } = await import('@/lib/auth/actions');
                await signOut();
              }}>
                <button type="submit" className="neon-text-pink hover:neon-pink-glow transition-all">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <a href="/login" className="neon-text-blue hover:neon-blue-glow transition-all">
                로그인
              </a>
              <a href="/register" className="neon-text-pink hover:neon-pink-glow transition-all">
                회원가입
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}