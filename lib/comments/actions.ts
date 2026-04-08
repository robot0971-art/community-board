'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type Comment = Database['public']['Tables']['comments']['Row'];

export async function getComments(postId: number) {
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (nickname)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    return { error: error.message, comments: [] };
  }

  // Organize comments into tree structure
  const commentMap = new Map();
  const rootComments: any[] = [];

  comments?.forEach((comment: any) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments?.forEach((comment: any) => {
    const node = commentMap.get(comment.id);
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies.push(node);
      }
    } else {
      rootComments.push(node);
    }
  });

  return { comments: rootComments };
}

export async function createComment(
  postId: number,
  content: string,
  parentId?: number
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  // Check if parent is already a reply (depth limit: 1)
  if (parentId) {
    const { data: parent } = await supabase
      .from('comments')
      .select('parent_id')
      .eq('id', parentId)
      .single();

    if (parent?.parent_id) {
      return { error: '대댓글에는 댓글을 달 수 없습니다' };
    }
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content,
    parent_id: parentId || null,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateComment(id: number, content: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  const { error } = await supabase
    .from('comments')
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteComment(id: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다' };
  }

  // Check if comment has replies
  const { data: replies } = await supabase
    .from('comments')
    .select('id')
    .eq('parent_id', id);

  if (replies && replies.length > 0) {
    // Soft delete
    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Hard delete
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }
  }

  return { success: true };
}