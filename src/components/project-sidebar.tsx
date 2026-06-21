'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Plus, Trash2, Folder, ChevronLeft, Calendar } from 'lucide-react';

interface Project {
  id: string;
  room_id: string;
  title: string;
  preview_text: string;
  updated_at: string;
}

interface ProjectSidebarProps {
  activeRoomId: string;
  user: User | null;
  isOpen: boolean;
  onToggle: () => void;
  onSignInClick?: () => void;
}

export function ProjectSidebar({ activeRoomId, user, isOpen, onToggle, onSignInClick }: ProjectSidebarProps) {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Helper to format date
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const fetchProjects = React.useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch and real-time subscription
  React.useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setProjects([]);
        setIsLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setIsLoading(true);
      fetchProjects();
    });

    // Setup postgres real-time change subscription
    const channel = supabase
      .channel(`public:projects:user:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchProjects]);

  const handleCreateNewSandbox = () => {
    const newRoomId = crypto.randomUUID();
    router.push(`/room/${newRoomId}`);
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Avoid triggering navigation to the room
    if (!user) return;
    
    // Optimistic UI update
    setProjects(prev => prev.filter(p => p.id !== projectId));

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      // Revert optimistic update on failure
      fetchProjects();
    }
  };



  return (
    <aside 
      className={`relative flex flex-col h-full bg-zinc-950 border-r border-white/[0.03] transition-all duration-300 ease-in-out select-none shrink-0 overflow-hidden ${
        isOpen ? 'w-64' : 'w-0 border-r-0'
      }`}
    >
      {/* Header action panel */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.03] h-14 shrink-0">
        <button
          onClick={handleCreateNewSandbox}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW SANDBOX</span>
        </button>
        <button
          onClick={onToggle}
          className="ml-2 flex items-center justify-center w-8 h-8 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main scrolling project explorer history */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {!user ? (
          <div className="flex flex-col items-center justify-center p-4 py-16 text-center border border-dashed border-white/5 rounded-lg bg-white/[0.002]">
            <Folder className="w-6 h-6 text-zinc-700 mb-3" />
            <h4 className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider">PERSISTED HISTORY</h4>
            <p className="text-[9px] font-sans text-zinc-500 mt-2 mb-4 max-w-[180px] leading-relaxed">
              Sign in to automatically save your compiled sandboxes and access your history across devices.
            </p>
            <button
              onClick={onSignInClick}
              className="w-full flex items-center justify-center h-8 rounded border border-accent/20 bg-accent/[0.02] hover:border-accent/40 hover:bg-accent/[0.05] text-[9px] font-mono font-bold tracking-widest text-accent transition-colors cursor-pointer"
            >
              SIGN IN / SIGN UP
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-10 font-mono text-[9px] text-zinc-600 animate-pulse">
            LOADING BLUEPRINTS...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 py-16 text-center border border-dashed border-white/5 rounded-lg bg-white/[0.002]">
            <Folder className="w-6 h-6 text-zinc-700 mb-3" />
            <h4 className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider">No blueprinted spaces</h4>
            <p className="text-[9px] font-sans text-zinc-500 mt-1 max-w-[160px] leading-relaxed">
              Compile your scratchpad requirements to register a workspace link.
            </p>
          </div>
        ) : (
          projects.map((project) => {
            const isActive = project.room_id === activeRoomId;
            return (
              <div
                key={project.id}
                onClick={() => router.push(`/room/${project.room_id}`)}
                className={`group relative flex flex-col items-stretch p-3 rounded border transition-all cursor-pointer ${
                  isActive 
                    ? 'border-zinc-700 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                    : 'border-white/5 bg-white/[0.005] hover:border-white/10 hover:bg-white/[0.015]'
                }`}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <span className={`font-mono text-[10px] font-semibold tracking-wide truncate ${
                    isActive ? 'text-zinc-200' : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}>
                    {project.title}
                  </span>
                  
                  {/* Delete button (only visible on hover to keep UI clean) */}
                  <button
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-rose-400 transition-all rounded hover:bg-white/5 cursor-pointer shrink-0"
                    title="Delete project link"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {project.preview_text && (
                  <p className="text-[9px] font-sans text-zinc-500 mt-1 truncate max-w-[180px]">
                    {project.preview_text}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-2 text-[8px] font-mono text-zinc-600 font-bold tracking-wider">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{formatTimeAgo(project.updated_at).toUpperCase()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
