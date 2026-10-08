import { useEffect, useState, useCallback } from 'react';
import { ContentPost } from '../types';
import { dataService } from '../data/dataService';
import { calculateStrategyHealth } from '../utils/strategy';

export const Dashboard = () => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyHealth, setStrategyHealth] = useState<any>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dataService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Calculate strategy health when posts change
  useEffect(() => {
    if (posts.length > 0) {
      const health = calculateStrategyHealth(posts);
      setStrategyHealth(health);
    } else {
      setStrategyHealth(null);
    }
  }, [posts]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    totalPlanned: posts.length,
    approved: posts.filter(p => p.status === 'APPROVED' || p.status === 'SCHEDULED' || p.status === 'PUBLISHED').length,
    awaitingReview: posts.filter(p => p.status === 'CLIENT_REVIEW').length,
    changesRequested: posts.filter(p => p.status === 'CHANGES_REQUESTED').length,
    generated: posts.filter(p => p.status === 'GENERATED').length,
    draft: posts.filter(p => p.status === 'DRAFT').length,
    published: posts.filter(p => p.status === 'PUBLISHED').length,
    rejected: posts.filter(p => p.status === 'REJECTED').length,
  };

  // Strategy distribution
  const strategyDistribution: Record<string, number> = {
    EDUCATE: 0,
    ENGAGE: 0,
    AUTHORITY: 0,
    STORY: 0,
    PROMOTE: 0
  };
  
  posts.forEach(post => {
    if (post.strategyName in strategyDistribution) {
      strategyDistribution[post.strategyName]++;
    }
  });

  const statCards = [
    { label: 'Planned Posts', value: stats.totalPlanned, icon: '📅', color: '#3B82F6', bg: '#DBEAFE', trend: stats.totalPlanned > 0 ? `${stats.totalPlanned} posts` : 'No posts yet' },
    { label: 'Approved', value: stats.approved, icon: '✓', color: '#10B981', bg: '#D1FAE5', trend: stats.published > 0 ? `${stats.published} published` : 'Awaiting approval' },
    { label: 'Awaiting Review', value: stats.awaitingReview + stats.changesRequested, icon: '⏰', color: '#F59E0B', bg: '#FEF3C7', trend: stats.changesRequested > 0 ? `${stats.changesRequested} need changes` : 'No pending items' },
    { label: 'Strategy Health', value: strategyHealth?.score || 0, icon: '🛡️', color: strategyHealth?.status === 'healthy' ? '#10B981' : strategyHealth?.status === 'needs_attention' ? '#F59E0B' : '#EF4444', bg: strategyHealth?.status === 'healthy' ? '#D1FAE5' : strategyHealth?.status === 'needs_attention' ? '#FEF3C7' : '#FEE2E2', trend: strategyHealth?.label || 'No data' }
  ];

  // This week's posts
  const currentDate = new Date();
  const weekStartDate = new Date(currentDate);
  weekStartDate.setDate(currentDate.getDate() - currentDate.getDay());
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Caribbean Wellness Studio</h2>
        <p className="text-xl text-gray-500 mt-2">Your Social Media This Month</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-[#7FB3D5]">{card.value}</div>
            <div className="text-sm text-gray-500 mt-2">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Strategy Distribution</h3>
        <div className="flex gap-4">
            {(['EDUCATE', 'ENGAGE', 'AUTHORITY', 'STORY', 'PROMOTE'] as const).map(strategy => (
                <div key={strategy} className="flex-1 text-center p-4 rounded-xl bg-gray-50">
                    <div className="text-2xl font-bold">{strategyDistribution[strategy] || 0}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{strategy}</div>
                </div>
            ))}
        </div>
        <p className="text-gray-500 mt-6 text-sm italic text-center">"Your content isn't random. Every post has a job."</p>
      </div>
    </div>
  );
};