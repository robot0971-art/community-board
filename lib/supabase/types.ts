export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          nickname: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          nickname: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          nickname?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          user_id: string
          title: string
          content: string
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          content: string
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          content?: string
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: number
          post_id: number
          user_id: string
          parent_id: number | null
          content: string
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          post_id: number
          user_id: string
          parent_id?: number | null
          content: string
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          user_id?: string
          parent_id?: number | null
          content?: string
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      post_images: {
        Row: {
          id: number
          post_id: number
          image_url: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: number
          post_id: number
          image_url: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          image_url?: string
          order_index?: number
          created_at?: string
        }
      }
    }
  }
}