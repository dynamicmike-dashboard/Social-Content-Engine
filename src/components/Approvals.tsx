import { useEffect, useState, useCallback } from 'react';
import { ContentPost, ContentStatus, STRATEGY_COLORS, SOCIAL_CHANNEL_COLORS } from '../types';
import { dataService } from '../data/dataService';
import { ContentDetailModal } from './ContentDetailModal';
import { format } from 'date-fns';
import { Filter, CheckCircle, MessageSquare, RotateCcw, Trash2, CheckCircle2 } from 'lucide-react';

const STATUS_OPTIONS: { value: ContentStatus; label: string; color: string }[] = [
  { value: 'CLIENT_REVIEW', label: 'Client Review', color: '#F59E0B' },
  { value: 'CHANGES_REQUESTED', label: 'Changes Requested', color: '#EF4444' },
  { value: 'APPROVED', label: 'Approved', color: '#10B981' },
  { value: 'SCHEDULED', label: 'Scheduled', color: '#3B82F6' },
  { value: 'PUBLISHED', label: 'Published', color: '#059669' },
  { value: 'REJECTED', label: 'Rejected', color: '#DC2626' },
  { value: 'GENERATED', label: 'Generated', color: '#64748B' },
  { value: 'DRAFT', label: 'Draft', color: '#94A3B8' }
];

const VALID_APPROVE_STATUSES: ContentStatus[] = ['CLIENT_REVIEW', 'CHANGES_REQUESTED'];

export const Approvals = () => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>('ALL');
  const [strategyFilter, setStrategyFilter] = useState<string>('ALL');
  const [showBulkApproveConfirm, setShowBulkApproveConfirm] = useState(false);
  const [bulkApproveCount, setBulkApproveCount] = useState(0);

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

  const handleBulkApprove = async () => {
    const approvablePosts = filteredPosts.filter(post => VALID_APPROVE_STATUSES.includes(post.status));
    if (approvablePosts.length === 0) return;
    
    setBulkApproveCount(approvablePosts.length);
    setShowBulkApproveConfirm(true);
  };

  const confirmBulkApprove = async () => {
    const approvablePosts = filteredPosts.filter(post => VALID_APPROVE_STATUSES.includes(post.status));
    
    for (const post of approvablePosts) {
      await dataService.updatePostStatus(post.id, 'APPROVED');
    }
    
    setShowBulkApproveConfirm(false);
    setBulkApproveCount(0);
    loadPosts();
  };

  const filteredPosts = posts.filter(post => {
    const statusMatch = statusFilter === 'ALL' || post.status === statusFilter;
    const strategyMatch = strategyFilter === 'ALL' || post.strategyName === strategyFilter;
    return statusMatch && strategyMatch;
  });

  const getStrategyColor = (strategy: string) => {
    const colors = STRATEGY_COLORS[strategy as keyof typeof STRATEGY_COLORS];
    return colors ? colors.default : '#64748B';
  };

  const getStrategyLightColor = (strategy: string) => {
    const colors = STRATEGY_COLORS[strategy as keyof typeof STRATEGY_COLORS];
    return colors ? colors.light : '#F1F5F9';
  };

  const getStatusColor = (status: ContentStatus) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option ? option.color : '#64748B';
  };

  const getStatusLabel = (status: ContentStatus) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option ? option.label : status;
  };

  const getChannelColor = (channel: string) => {
    const colors = SOCIAL_CHANNEL_COLORS[channel as keyof typeof SOCIAL_CHANNEL_COLORS];
    return colors ? colors.default : '#64748B';
  };

  const getChannelLightColor = (channel: string) => {
    const colors = SOCIAL_CHANNEL_COLORS[channel as keyof typeof SOCIAL_CHANNEL_COLORS];
    return colors ? colors.light : '#F1F5F9';
  };

  const pendingCount = posts.filter(p => p.status === 'CLIENT_REVIEW' || p.status === 'CHANGES_REQUESTED').length;
  const approvableCount = filteredPosts.filter(p => VALID_APPROVE_STATUSES.includes(p.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Approvals Queue</h2>
          <p className="text-gray-500 mt-1">
            {pendingCount} posts awaiting review • {filteredPosts.length} shown
          </p>
        </div>
        
        {/* Filters & Bulk Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'ALL')}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="CLIENT_REVIEW">Client Review</option>
              <option value="CHANGES_REQUESTED">Changes Requested</option>
              <option value="APPROVED">Approved</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
              <option value="GENERATED">Generated</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="ALL">All Strategies</option>
              <option value="EDUCATE">Educate</option>
              <option value="ENGAGE">Engage</option>
              <option value="AUTHORITY">Authority</option>
              <option value="STORY">Story</option>
              <option value="PROMOTE">Promote</option>
            </select>
          </div>

          {/* Approve All Button */}
          {approvableCount > 0 && (
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle2 size={18} />
              <span>Approve All ({approvableCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading approvals...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{post.topic}</h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: getStrategyLightColor(post.strategyName),
                          color: getStrategyColor(post.strategyName)
                        }}
                      >
                        {post.strategyName}
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: getChannelLightColor(post.platform),
                          color: getChannelColor(post.platform)
                        }}
                      >
                        {post.platform}
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: getStatusColor(post.status) + '20',
                          color: getStatusColor(post.status)
                        }}
                      >
                        {getStatusLabel(post.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{post.format}</span>
                      {post.scheduledTime && (
                        <span>• {format(new Date(post.scheduledTime), 'h:mm a')}</span>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.platformContent?.[post.platform]?.caption || post.caption}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(post.id, 'APPROVED'); }}
                      disabled={post.status === 'APPROVED'}
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Approve"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      title="View & Edit"
                    >
                      <MessageSquare size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(post.id, 'CHANGES_REQUESTED'); }}
                      className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors"
                      title="Request Changes"
                    >
                      <MessageSquare size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(post.id, 'GENERATED'); }}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Regenerate"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Client Review', value: posts.filter(p => p.status === 'CLIENT_REVIEW').length, color: '#F59E0B' },
          { label: 'Changes Requested', value: posts.filter(p => p.status === 'CHANGES_REQUESTED').length, color: '#EF4444' },
          { label: 'Approved', value: posts.filter(p => p.status === 'APPROVED').length, color: '#10B981' },
          { label: 'Published', value: posts.filter(p => p.status === 'PUBLISHED').length, color: '#059669' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bulk Approve Confirmation Modal */}
      {showBulkApproveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Approve All Posts</h3>
                <p className="text-sm text-gray-500">Confirm bulk approval</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              You are about to approve <strong>{bulkApproveCount}</strong> post{bulkApproveCount !== 1 ? 's' : ''} that are currently in <span className="font-medium">Client Review</span> or <span className="font-medium">Changes Requested</span> status.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">This will:</p>
              <ul className="text-sm text-gray-600 space-y-1 pl-4 list-disc">
                <li>Change status to <strong>Approved</strong></li>
                <li>Set <strong>Approved At</strong> timestamp</li>
                <li>Record <strong>approval activity</strong> in audit trail</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => { setShowBulkApproveConfirm(false); setBulkApproveCount(0); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Approve All Posts
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Approvals;