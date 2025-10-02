// api/supabase-session-store.ts
import { SessionData, Store } from 'express-session';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseSessionStore extends Store {
  private supabase: SupabaseClient;
  private tableName: string;

  constructor(supabase: SupabaseClient, tableName = 'user_sessions') {
    super();
    this.supabase = supabase;
    this.tableName = tableName;
  }

  async get(sid: string, callback: (err?: any, session?: SessionData | null) => void): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('sess, expire')
        .eq('sid', sid)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return callback(null, null);
        }
        return callback(error);
      }

      // Check if session has expired
      if (data.expire && new Date(data.expire) <= new Date()) {
        return callback(null, null);
      }

      callback(null, data.sess);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid: string, session: SessionData, callback?: (err?: any) => void): Promise<void> {
    try {
      const expire = session.cookie?.expires 
        ? new Date(session.cookie.expires).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours default

      const { error } = await this.supabase
        .from(this.tableName)
        .upsert({
          sid,
          sess: session,
          expire
        }, {
          onConflict: 'sid'
        });

      if (error) {
        return callback?.(error);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('sid', sid);

      if (error) {
        return callback?.(error);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async touch(sid: string, session: SessionData, callback?: (err?: any) => void): Promise<void> {
    try {
      const expire = session.cookie?.expires
        ? new Date(session.cookie.expires).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { error } = await this.supabase
        .from(this.tableName)
        .update({ expire })
        .eq('sid', sid);

      if (error) {
        return callback?.(error);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  // Optional: Clean up expired sessions
  async cleanup(callback?: (err?: any) => void): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .lt('expire', new Date().toISOString());

      if (error) {
        return callback?.(error);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }
}