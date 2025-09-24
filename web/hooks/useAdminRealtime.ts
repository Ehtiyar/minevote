import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: any;
  old: any;
  table: string;
}

export function useAdminRealtime(
  table: string,
  onUpdate: (payload: RealtimePayload) => void,
  enabled: boolean = true
) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Create a channel for the specific table
    const channel = supabase
      .channel(`admin-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          onUpdate({
            eventType: payload.eventType as any,
            new: payload.new,
            old: payload.old,
            table: payload.table,
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${table} changes`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to ${table} changes`);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, onUpdate, enabled]);

  return {
    isConnected: channelRef.current?.state === 'joined',
  };
}

// Specific hooks for different tables
export function useServersRealtime(onUpdate: (payload: RealtimePayload) => void) {
  return useAdminRealtime('servers', onUpdate);
}

export function useUsersRealtime(onUpdate: (payload: RealtimePayload) => void) {
  return useAdminRealtime('users', onUpdate);
}

export function useVotesRealtime(onUpdate: (payload: RealtimePayload) => void) {
  return useAdminRealtime('votes', onUpdate);
}

export function useReportsRealtime(onUpdate: (payload: RealtimePayload) => void) {
  return useAdminRealtime('reports', onUpdate);
}

export function useAuditLogsRealtime(onUpdate: (payload: RealtimePayload) => void) {
  return useAdminRealtime('admin_audit_logs', onUpdate);
}
