import { useEffect, useState, useCallback } from 'react';
import { ContentPost, ContentStatus, STRATEGY_COLORS } from '../types';
import { dataService } from '../data/dataService';
import { ContentDetailModal } from './ContentDetailModal';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Music, CheckCircle2 } from 'lucide-react';

const STRATEGY_ORDER = ['EDUCATE', 'ENGAGE', 'AUTHORITY', 'STORY', 'PROMOTE'] as const;

interface CalendarViewProps {
  onComplete?: () => void;
}

export const CalendarView = ({ onComplete }: CalendarViewProps) => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // October 2026

  const loadPosts = useCallback(async () => {
    const data = await dataService.getPosts();
    setPosts(data);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleUpdatePost = async (id: string, updates: Partial<ContentPost>) => {
    await dataService.updatePost(id, updates);
    loadPosts();
  };

  const handleStatusChange = async (id: string, status: ContentStatus, notes?: string) => {
    await dataService.updatePostStatus(id, status, notes);
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    await dataService.deletePost(id);
    loadPosts();
  };

  const getMonthDays = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = start.getDay(); // 0 = Sunday
    const daysInMonth = end.getDate();
    const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    const days: (Date | null)[] = [];
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(new Date(date.getFullYear(), date.getMonth() - 1, prevMonthEnd - i));
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    
    // Next month days to fill 6 weeks (42 days)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
    }
    
    return days;
  };

  const days = getMonthDays(currentMonth);
  const monthName = format(currentMonth, 'MMMM yyyy');

  const getPostsForDay = (date: Date) => {
    const dayKey = format(date, 'yyyy-MM-dd');
    return posts.filter(p => p.date === dayKey);
  };

  const isCurrentMonthDay = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStrategyColor = (strategy: string) => {
    const colors = STRATEGY_COLORS[strategy as keyof typeof STRATEGY_COLORS];
    return colors ? colors.default : '#64748B';
  };

  const getStrategyLightColor = (strategy: string) => {
    const colors = STRATEGY_COLORS[strategy as keyof typeof STRATEGY_COLORS];
    return colors ? colors.light : '#F1F5F9';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-gray-500 mt-1">Click any post to view, edit, or approve</p>
        </div>
        <div className="flex items-center gap-3">
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Complete Onboarding
            </button>
          )}
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(2026, 9, 1))}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Calendar size={16} className="inline-block mr-1" /> This Month
          </button>
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Month Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{monthName}</h3>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-500 text-sm py-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dayPosts = date ? getPostsForDay(date) : [];
            const currentMonthDay = date ? isCurrentMonthDay(date) : false;
            const today = date ? isToday(date) : false;
            
            return (
              <div
                key={index}
                className={`relative min-h-[120px] p-2 border-r border-b border-gray-100 transition-colors ${
                  !currentMonthDay ? 'bg-gray-50/50' : 'bg-white'
                } ${today ? 'ring-2 ring-blue-500' : ''}`}
                style={{ borderRight: index % 7 === 6 ? 'none' : '1px solid #e2e8f0' }}
              >
                {date && (
                  <>
                    <div className={`flex items-center justify-between mb-1 ${
                      today ? 'text-blue-600 font-bold' : currentMonthDay ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      <span className="text-sm">{date.getDate()}</span>
                      {today && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Today</span>}
                    </div>
                    
                    <div className="space-y-1 max-h-[90px] overflow-y-auto">
                      {dayPosts.slice(0, 3).map(post => (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="cursor-pointer group"
                        >
                          <div 
                            className="text-xs font-semibold px-2 py-1 rounded truncate transition-all"
                            style={{
                              backgroundColor: getStrategyLightColor(post.strategyName),
                              color: getStrategyColor(post.strategyName)
                            }}
                          >
                            {post.strategyName}
                          </div>
                          <div className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-600">
                            {post.topic}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100">{post.format}</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 capitalize">{post.status.toLowerCase().replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-xs text-gray-400 text-center py-1">
                          +{dayPosts.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Music size={16} className="text-black" />
          <span style={{ color: '#000000' }}>TikTok</span>
        </div>
        {STRATEGY_ORDER.map(strategy => {
          const colors = STRATEGY_COLORS[strategy];
          return (
            <span key={strategy} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: colors.light }} />
              <span style={{ color: colors.default }}>{strategy}</span>
            </span>
          );
        })}
      </div>

      {/* Content Detail Modal */}
      {selectedPost && (
        <ContentDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={handleUpdatePost}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};