import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserConfig } from '@/lib/prompt-compiler';
import { deobfuscateKey } from '@/lib/encryption';

interface RoomSyncResult {
  markdownText: string;
  setMarkdownText: React.Dispatch<React.SetStateAction<string>>;
  user: SupabaseUser | null;
  profile: { credits: number; is_lifetime: boolean } | null;
  refreshProfile: () => Promise<void>;
  userConfig: UserConfig;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
  usersCount: number;
  setUsersCount: React.Dispatch<React.SetStateAction<number>>;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  setConnectionStatus: React.Dispatch<React.SetStateAction<'connecting' | 'connected' | 'disconnected'>>;
  broadcastTextChange: (text: string) => void;
}

/**
 * Custom hook to handle room-specific state and synchronization:
 * - Markdown text caching in LocalStorage and synchronization callbacks.
 * - Supabase Auth session tracking and user profile loading.
 * - Loading and serialization of Bring Your Own Key (BYOK) configurations.
 * - Coordination of users counters and channel connections.
 *
 * @param roomId - The active Room UUID mapping.
 * @returns Object containing all sync states, functions, and listeners.
 */
export function useRoomSync(roomId: string): RoomSyncResult {
  const [markdownText, setMarkdownText] = React.useState<string>(
    `# Project Auxo\n\n` +
    `## Stack\n- Next.js (App Router)\n- TailwindCSS\n- Supabase (Realtime)\n\n` +
    `## Goals\nBuild a zero-auth real-time markdown playground for founders to collaborate.`
  );
  
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [profile, setProfile] = React.useState<{ credits: number; is_lifetime: boolean } | null>(null);
  const [usersCount, setUsersCount] = React.useState<number>(1);
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [userConfig, setUserConfig] = React.useState<UserConfig>({ provider: 'premium' });
  const channelRef = React.useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Read configuration from LocalStorage on mount
  React.useEffect(() => {
    let provider = localStorage.getItem('auxo-settings-provider') as UserConfig['provider'];
    
    // Safety check: Validate provider format to mitigate corrupted settings keys.
    const validProviders = ['premium', 'openai', 'anthropic', 'gemini'];
    if (!provider || !validProviders.includes(provider)) {
      provider = 'premium';
      localStorage.setItem('auxo-settings-provider', 'premium');
    }

    let apiKey = undefined;
    let model = undefined;

    if (provider === 'openai') {
      const rawKey = localStorage.getItem('auxo-settings-openai-key') || '';
      apiKey = deobfuscateKey(rawKey);
      model = localStorage.getItem('auxo-settings-openai-model') || 'gpt-4o-mini';
    } else if (provider === 'anthropic') {
      const rawKey = localStorage.getItem('auxo-settings-anthropic-key') || '';
      apiKey = deobfuscateKey(rawKey);
      model = localStorage.getItem('auxo-settings-anthropic-model') || 'claude-sonnet-4-6';
    } else if (provider === 'gemini') {
      const rawKey = localStorage.getItem('auxo-settings-gemini-key') || '';
      apiKey = deobfuscateKey(rawKey);
      model = localStorage.getItem('auxo-settings-gemini-model') || 'gemini-2.5-flash';
    }

    setTimeout(() => {
      setUserConfig({ provider, apiKey, model });
    }, 0);
  }, []);

  const isMountedRef = React.useRef(false);

  // Helper to fetch/refresh the user profile details
  const refreshProfile = React.useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits, is_lifetime')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }, [user]);

  // Sync auth state changes and fetch profile
  React.useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits, is_lifetime')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchUserProfile(activeUser.id);
      } else {
        setProfile(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchUserProfile(activeUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Restore scratchpad text from LocalStorage on mount
  React.useEffect(() => {
    const savedText = localStorage.getItem(`auxo-room-${roomId}`);
    if (savedText) {
      setTimeout(() => {
        setMarkdownText(savedText);
      }, 0);
    }
    const timer = setTimeout(() => {
      isMountedRef.current = true;
    }, 50);
    return () => clearTimeout(timer);
  }, [roomId]);

  // Mirror scratchpad changes to LocalStorage on every edit
  React.useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem(`auxo-room-${roomId}`, markdownText);
    }
  }, [roomId, markdownText]);

  // Connect to Supabase Realtime channel persistently for this room
  React.useEffect(() => {
    setTimeout(() => {
      setConnectionStatus('connecting');
    }, 0);

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { ack: false },
        presence: { key: roomId }
      }
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'text-change' }, (payload) => {
        const newText = payload.payload.text;
        setMarkdownText(newText);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setUsersCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          await channel.track({ online_at: new Date().toISOString() });
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        }
      });

    return () => {
      setConnectionStatus('disconnected');
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId]);

  const broadcastTextChange = React.useCallback((text: string) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'text-change',
        payload: { text }
      });
    }
  }, []);

  return {
    markdownText,
    setMarkdownText,
    user,
    profile,
    refreshProfile,
    userConfig,
    setUserConfig,
    usersCount,
    setUsersCount,
    connectionStatus,
    setConnectionStatus,
    broadcastTextChange
  };
}
