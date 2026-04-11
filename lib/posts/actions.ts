'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Database } from '@/lib/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];
type PostImage = Database['public']['Tables']['post_images']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type PostDetail = Post & {
  profiles: Pick<Profile, 'nickname' | 'username'> | null;
  post_images: PostImage[];
};

export async function getPosts(page: number = 1, limit: number = 10) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (nickname),
      comments(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { error: error.message, posts: [] };
  }

  return { posts };
}

export async function getPost(id: number) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { error: error.message, post: null };
  }

  const [{ data: profile }, { data: postImages, error: imagesError }] = await Promise.all([
    supabase
      .from('profiles')
      .select('nickname, username')
      .eq('id', post.user_id)
      .maybeSingle(),
    supabase
      .from('post_images')
      .select('*')
      .eq('post_id', id)
      .order('order_index', { ascending: true }),
  ]);

  if (imagesError) {
    return { error: imagesError.message, post: null };
  }

  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: post.view_count + 1 })
    .eq('id', id);

  const postDetail: PostDetail = {
    ...post,
    profiles: profile,
    post_images: postImages ?? [],
  };

  return { post: postDetail };
}

export async function createPost(title: string, content: string, images: string[] = []) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('Auth check:', { user: user?.id, authError });
  
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      title,
      content,
    })
    .select()
    .single();

  console.log('Insert result:', { post, error });

  if (error) {
    return { error: error.message };
  }

  // Insert images
  if (images.length > 0 && post) {
    const imageInserts = images.map((url, index) => ({
      post_id: post.id,
      image_url: url,
      order_index: index,
    }));

    const { error: imageError } = await supabase
      .from('post_images')
      .insert(imageInserts);

    if (imageError) {
      return { error: imageError.message };
    }
  }

  revalidatePath('/posts');
  return { postId: post?.id };
}

export async function updatePost(id: number, title: string, content: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
  return { success: true };
}

export async function deletePost(id: number) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/posts');
  redirect('/');
}
