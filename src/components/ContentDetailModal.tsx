import React, { useState } from 'react';
import { ContentPost, SocialChannel, SOCIAL_CHANNEL_COLORS, ContentStatus, VALID_STATUS_TRANSITIONS } from '../types';
import { WhyThisPostPanel } from './WhyThisPostPanel';
import { format } from 'date-fns';
import { 
  X, 
  CheckCircle, 
  Edit, 
  RotateCcw, 
  Trash2, 
  MessageSquare,
  ExternalLink,
  Hash,
  Copy,
  Check,
  Music,
  Download,
  FileText
} from 'lucide-react';

const SOCIAL_CHANNELS: SocialChannel[] = ['FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'TWITTER', 'TIKTOK'];

const SOCIAL_CHANNEL_LABELS: Record<SocialChannel, string> = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'X (Twitter)',
  TIKTOK: 'TikTok'
};

const SOCIAL_CHANNEL_ICONS: Record<SocialChannel, React.ReactNode> = {
  FACEBOOK: <MessageSquare size={16} />,
  INSTAGRAM: <Hash size={16} />,
  LINKEDIN: <ExternalLink size={16} />,
  TWITTER: <MessageSquare size={16} />,
  TIKTOK: <Music size={16} />
};

interface ContentDetailModalProps {
  post: ContentPost;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ContentPost>) => Promise<void>;
  onStatusChange: (id: string, status: ContentStatus, notes?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ContentDetailModal = ({ 
  post, 
  onClose, 
  onUpdate, 
  onStatusChange, 
  onDelete 
}: ContentDetailModalProps) => {
  const [activeChannel, setActiveChannel] = useState<SocialChannel>('FACEBOOK');
  const [showWhy, setShowWhy] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusAction, setStatusAction] = useState<ContentStatus | null>(null);

  const channelColors = SOCIAL_CHANNEL_COLORS[activeChannel];
  const strategyColors = {
    EDUCATE: { bg: '#DBEAFE', text: '#1D4ED8', border: '#3B82F6' },
    ENGAGE: { bg: '#D1FAE5', text: '#059669', border: '#10B981' },
    AUTHORITY: { bg: '#EDE9FE', text: '#7C3AED', border: '#8B5CF6' },
    STORY: { bg: '#FFEDD5', text: '#EA580C', border: '#F97316' },
    PROMOTE: { bg: '#FFE4E6', text: '#DB2777', border: '#EC4899' }
  };
  
  const strategyColor = strategyColors[post.strategyName];
  const statusColors: Record<ContentStatus, { bg: string; text: string; border: string }> = {
    DRAFT: { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' },
    GENERATED: { bg: '#F1F5F9', text: '#475569', border: '#64748B' },
    CLIENT_REVIEW: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
    CHANGES_REQUESTED: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
    APPROVED: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
    SCHEDULED: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
    PUBLISHED: { bg: '#D1FAE5', text: '#065F46', border: '#059669' },
    REJECTED: { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' }
  };
  const statusColor = statusColors[post.status];

  const platformContent = post.platformContent?.[activeChannel] || {
    hook: post.hook,
    caption: post.caption,
    cta: post.cta,
    hashtags: post.hashtags,
    ctaType: post.ctaType,
    ctaValue: post.ctaValue
  };

  const handleSaveEdit = async (field: string) => {
    setIsSaving(true);
    try {
      await onUpdate(post.id, { [field]: editValue });
      setEditingField(null);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: ContentStatus) => {
    const validTransitions = VALID_STATUS_TRANSITIONS[post.status] || [];
    if (!validTransitions.includes(newStatus)) return;
    
    setStatusAction(newStatus);
    try {
      await onStatusChange(post.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusAction(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this post? This action cannot be undone.')) {
      await onDelete(post.id);
      onClose();
    }
  };

  const validNextStatuses = VALID_STATUS_TRANSITIONS[post.status] || [];

  const getStatusActionLabel = (status: ContentStatus): string => {
    const labels: Record<ContentStatus, string> = {
      DRAFT: 'Generate',
      GENERATED: 'Send for Review',
      CLIENT_REVIEW: 'Approve',
      CHANGES_REQUESTED: 'Resubmit for Review',
      APPROVED: 'Schedule',
      SCHEDULED: 'Mark Published',
      PUBLISHED: 'Published',
      REJECTED: 'Resubmit for Review'
    };
    return labels[status] || status;
  };

  const getStatusActionVariant = (status: ContentStatus): 'primary' | 'success' | 'warning' | 'destructive' | 'default' => {
    if (status === 'APPROVED' || status === 'SCHEDULED' || status === 'PUBLISHED') return 'success';
    if (status === 'CLIENT_REVIEW') return 'primary';
    if (status === 'CHANGES_REQUESTED' || status === 'REJECTED') return 'warning';
    if (status === 'DRAFT' || status === 'GENERATED') return 'default';
    return 'default';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${strategyColor.bg} ${strategyColor.text} border ${strategyColor.border}`}>
                {post.strategyName}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                {post.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{post.topic}</h2>
            <p className="text-gray-500 mt-1">{formatDate(post.date)} • {post.format} • {post.platform}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Platform Tabs */}
          <div className="mb-6">
            <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
              {SOCIAL_CHANNELS.map(channel => {
                const colors = SOCIAL_CHANNEL_COLORS[channel];
                const isActive = activeChannel === channel;
                return (
                  <button
                    key={channel}
                    onClick={() => setActiveChannel(channel)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? `bg-white text-white shadow-md ${colors.text}`
                        : `text-gray-600 hover:text-gray-900`
                    }`}
                    style={{
                      backgroundColor: isActive ? colors.default : 'transparent',
                      borderColor: isActive ? colors.border : 'transparent'
                    }}
                  >
                    {SOCIAL_CHANNEL_ICONS[channel]}
                    <span>{SOCIAL_CHANNEL_LABELS[channel]}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Platform color indicator bar */}
            <div 
              className="h-1 rounded-b-xl mt-[-1px] transition-all duration-300"
              style={{ backgroundColor: channelColors.default }}
            />
          </div>

          {/* Content Fields with vertical accent bar */}
          <div className="space-y-6">
            {/* Hook */}
            <div className="relative pl-4 border-l-4" style={{ borderColor: channelColors.default }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Hook
                  </label>
                  {editingField === 'hook' ? (
                    <div className="flex gap-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleSaveEdit('hook')}
                          disabled={isSaving}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSaving ? <Check size={16} /> : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-lg font-medium text-gray-900 leading-relaxed flex-1">
                        "{platformContent.hook}"
                      </p>
                      <button
                        onClick={() => { setEditValue(platformContent.hook); setEditingField('hook'); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Edit hook"
                      >
                        <Edit size={18} className="text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="relative pl-4 border-l-4" style={{ borderColor: channelColors.default }}>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Caption
              </label>
              {editingField === 'caption' ? (
                <div className="flex gap-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    rows={5}
                    autoFocus
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleSaveEdit('caption')}
                      disabled={isSaving}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSaving ? <Check size={16} /> : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap flex-1">
                    {platformContent.caption}
                  </p>
                  <button
                    onClick={() => { setEditValue(platformContent.caption); setEditingField('caption'); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Edit caption"
                  >
                    <Edit size={18} className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="relative pl-4 border-l-4 bg-gray-50/50 rounded-r-lg" style={{ borderColor: channelColors.default }}>
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Call to Action {platformContent.ctaType === 'KEYWORD' ? '(Keyword)' : '(Link)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                      platformContent.ctaType === 'KEYWORD' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {platformContent.ctaType === 'KEYWORD' ? 'Keyword Trigger' : 'External Link'}
                    </span>
                    <span className="font-semibold text-gray-900">"{platformContent.cta}"</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {platformContent.ctaType === 'KEYWORD' 
                      ? `User replies: "${platformContent.ctaValue}"`
                      : `Links to: ${platformContent.ctaValue}`}
                  </p>
                </div>
                <button
                  onClick={() => { setEditValue(platformContent.cta); setEditingField('cta'); }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Edit CTA"
                >
                  <Edit size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Hashtags */}
            <div className="relative pl-4 border-l-4" style={{ borderColor: channelColors.default }}>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Hashtags
              </label>
              {editingField === 'hashtags' ? (
                <div className="flex gap-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleSaveEdit('hashtags')}
                      disabled={isSaving}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSaving ? <Check size={16} /> : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {platformContent.hashtags.split(' ').map(tag => (
                      tag && <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => { setEditValue(platformContent.hashtags); setEditingField('hashtags'); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Edit hashtags"
                  >
                    <Edit size={18} className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Visual Concept */}
            {(post.imagePrompt || post.videoConcept) && (
              <div className="relative pl-4 border-l-4 bg-gray-50/50 rounded-r-lg" style={{ borderColor: channelColors.default }}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 p-4 pt-0">
                  Visual Concept
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pb-0">
                  {post.imagePrompt && (
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Image Prompt
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{post.imagePrompt}</p>
                    </div>
                  )}
                  {post.videoConcept && (
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                        Video Concept
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{post.videoConcept}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Why This Post Panel Trigger */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowWhy(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ borderColor: strategyColor.border }}
              >
                <span className="font-semibold" style={{ color: strategyColor.text }}>Why this post?</span>
                <span className="text-sm" style={{ color: strategyColor.text }}>View strategic rationale</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Caption */}
            <button
              onClick={() => navigator.clipboard.writeText(platformContent.caption)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Copy size={18} />
              <span>Copy Caption</span>
            </button>
            
            {/* Copy Hashtags */}
            <button
              onClick={() => navigator.clipboard.writeText(platformContent.hashtags)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Hash size={18} />
              <span>Copy Hashtags</span>
            </button>

            {/* Copy CTA */}
            <button
              onClick={() => navigator.clipboard.writeText(platformContent.cta)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink size={18} />
              <span>Copy CTA</span>
            </button>

            {/* Export Full Post */}
            <button
              onClick={() => {
                const exportData = {
                  id: post.id,
                  topic: post.topic,
                  strategy: post.strategyName,
                  platform: activeChannel,
                  date: post.date,
                  scheduledTime: post.scheduledTime,
                  format: post.format,
                  hook: platformContent.hook,
                  caption: platformContent.caption,
                  cta: platformContent.cta,
                  ctaType: platformContent.ctaType,
                  ctaValue: platformContent.ctaValue,
                  hashtags: platformContent.hashtags,
                  alternativeHooks: post.alternativeHooks,
                  imagePrompt: post.imagePrompt,
                  videoConcept: post.videoConcept,
                  videoScript: post.videoScript,
                  status: post.status,
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `post-${post.id}-${post.topic.replace(/\s+/g, '-')}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Download size={18} />
              <span>Export JSON</span>
            </button>

            {/* Download as Text */}
            <button
              onClick={() => {
                const textContent = `POST: ${post.topic}
STRATEGY: ${post.strategyName}
PLATFORM: ${activeChannel}
DATE: ${post.date}${post.scheduledTime ? ` ${format(new Date(post.scheduledTime), 'h:mm a')}` : ''}
FORMAT: ${post.format}

HOOK: ${platformContent.hook}

CAPTION:
${platformContent.caption}

CTA: ${platformContent.cta} (${platformContent.ctaType}: ${platformContent.ctaValue})

HASHTAGS: ${platformContent.hashtags}

${post.alternativeHooks && post.alternativeHooks.length > 0 ? `ALTERNATIVE HOOKS:
${post.alternativeHooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}` : ''}

${post.imagePrompt ? `IMAGE PROMPT: ${post.imagePrompt}` : ''}
${post.videoConcept ? `VIDEO CONCEPT: ${post.videoConcept}` : ''}
${post.videoScript ? `VIDEO SCRIPT: ${post.videoScript}` : ''}

STATUS: ${post.status}
CREATED: ${post.createdAt}
UPDATED: ${post.updatedAt}`;
                const blob = new Blob([textContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `post-${post.id}-${post.topic.replace(/\s+/g, '-')}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FileText size={18} />
              <span>Download TXT</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Regenerate */}
            <button
              onClick={() => handleStatusChange('GENERATED')}
              disabled={statusAction === 'GENERATED'}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={18} />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Reject/Remove */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} />
              <span>Remove</span>
            </button>

            {/* Request Changes */}
            {validNextStatuses.includes('CHANGES_REQUESTED') && (
              <button
                onClick={() => handleStatusChange('CHANGES_REQUESTED')}
                disabled={statusAction === 'CHANGES_REQUESTED'}
                className="flex items-center gap-2 px-4 py-2 border border-yellow-200 rounded-lg text-yellow-700 hover:bg-yellow-50 transition-colors disabled:opacity-50"
              >
                <MessageSquare size={18} />
                <span>Request Changes</span>
              </button>
            )}

            {/* Primary Action */}
            {validNextStatuses.length > 0 && (
              <button
                onClick={() => handleStatusChange(validNextStatuses[0])}
                disabled={statusAction === validNextStatuses[0]}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all"
                style={{
                  backgroundColor: getStatusActionVariant(validNextStatuses[0]) === 'success' ? '#10B981' : '#3B82F6'
                }}
              >
                {statusAction === validNextStatuses[0] ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                ) : (
                  <CheckCircle size={20} />
                )}
                <span>{getStatusActionLabel(validNextStatuses[0])}</span>
              </button>
            )}
          </div>
        </div>

        {/* Why This Post Panel */}
        {showWhy && (
          <WhyThisPostPanel 
            post={post} 
            onClose={() => setShowWhy(false)} 
            activeChannel={activeChannel}
          />
        )}
      </div>
    </div>
  );
};

