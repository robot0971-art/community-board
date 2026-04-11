'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type Comment = Database['public']['Tables']['comments']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type CommentWithRelations = Comment & {
  profiles: Pick<Profile, 'nickname'> | null;
  replies: CommentWithRelations[];
};

export async function getComments(postId: number) {
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    return { error: error.message, comments: [] };
  }

  const userIds = [...new Set((comments ?? []).map((comment) => comment.user_id))];
  const { data: profiles, error: profilesError } = userIds.length === 0
    ? { data: [], error: null }
    : await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', userIds);

  if (profilesError) {
    return { error: profilesError.message, comments: [] };
  }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, { nickname: profile.nickname }])
  );

  // Organize comments into tree structure
  const commentMap = new Map<number, CommentWithRelations>();
  const rootComments: CommentWithRelations[] = [];

  comments?.forEach((comment) => {
    commentMap.set(comment.id, {
      ...comment,
      profiles: profileMap.get(comment.user_id) ?? null,
      replies: [],
    });
  });

  comments?.forEach((comment) => {
    const node = commentMap.get(comment.id);
    if (!node) {
      return;
    }

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
