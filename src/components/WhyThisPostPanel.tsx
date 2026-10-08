import { useState } from 'react';
import { ContentPost, SocialChannel, SOCIAL_CHANNEL_COLORS, STRATEGY_COLORS } from '../types';
import { ChevronDown, ChevronUp, Copy, Check, MessageSquare, Hash, ExternalLink } from 'lucide-react';

const STRATEGY_OBJECTIVES: Record<string, string> = {
  EDUCATE: 'Teach valuable lessons and demonstrate expertise',
  ENGAGE: 'Spark conversations and build community',
  AUTHORITY: 'Showcase credentials and prove expertise',
  STORY: 'Humanize the brand and create emotional connection',
  PROMOTE: 'Convert followers into paying customers'
};

const CUSTOMER_JOURNEY_STAGES = [
  { key: 'KNOW', label: 'KNOW' },
  { key: 'TRUST', label: 'TRUST' },
  { key: 'ENGAGE', label: 'ENGAGE' },
  { key: 'CONSIDER', label: 'CONSIDER' },
  { key: 'ACT', label: 'ACT' },
  { key: 'LOYAL', label: 'LOYAL' }
];

function getChannelIcon(channel: SocialChannel) {
  switch (channel) {
    case 'FACEBOOK': return <MessageSquare size={20} />;
    case 'INSTAGRAM': return <Hash size={20} />;
    case 'LINKEDIN': return <ExternalLink size={20} />;
    case 'TWITTER': return <MessageSquare size={20} />;
  }
}

interface WhyThisPostPanelProps {
  post: ContentPost;
  onClose: () => void;
  activeChannel: SocialChannel;
}

export const WhyThisPostPanel = ({ post, onClose, activeChannel }: WhyThisPostPanelProps) => {
  const [showLogic, setShowLogic] = useState(false);
  const [selectedHook, setSelectedHook] = useState(post.hook);
  const [copiedHook, setCopiedHook] = useState<string | null>(null);

  const strategyColors = STRATEGY_COLORS[post.strategyName as keyof typeof STRATEGY_COLORS] || STRATEGY_COLORS.EDUCATE;
  const channelColors = SOCIAL_CHANNEL_COLORS[activeChannel];

  const platformContent = post.platformContent?.[activeChannel] || {
    hook: post.hook,
    caption: post.caption,
    cta: post.cta,
    hashtags: post.hashtags,
    ctaType: post.ctaType,
    ctaValue: post.ctaValue
  };

  const allHooks = [post.hook, ...(post.alternativeHooks || [])];

  const handleCopyHook = (hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedHook(hook);
    setTimeout(() => setCopiedHook(null), 2000);
  };

  const STRATEGY_JOURNEY_POSITION: Record<string, number> = {
    EDUCATE: 1, ENGAGE: 2, AUTHORITY: 1, STORY: 0, PROMOTE: 3
  };

  const STRATEGY_REASONS: Record<string, string> = {
    EDUCATE: 'teaches your audience something valuable, positioning you as a helpful expert.',
    ENGAGE: 'invites your audience to share their thoughts, boosting algorithm visibility.',
    AUTHORITY: 'showcases your credibility and results, building trust before the ask.',
    STORY: 'creates emotional connection by sharing authentic behind-the-scenes moments.',
    PROMOTE: 'presents a clear offer with a direct path to conversion.'
  };

  const journeyPosition = STRATEGY_JOURNEY_POSITION[post.strategyName] || 1;
  const strategyReason = STRATEGY_REASONS[post.strategyName] || 'builds engagement.';

  const ctaBadgeClass = platformContent.ctaType === 'KEYWORD' 
    ? 'px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800'
    : 'px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800';

  const hookButtonClass = (isSelected: boolean) => 
    `w-full text-left p-3 text-sm rounded-lg border transition-all ${
      isSelected ? `border-2 ${channelColors.border} bg-white` : 'border-gray-200 hover:border-gray-300'
    }`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end z-50 animate-slide-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: channelColors.default }}>
              {getChannelIcon(activeChannel)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Why This Post?</h2>
              <p className="text-sm text-gray-500">{activeChannel} optimized content</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500" aria-label="Close panel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: strategyColors.light, borderColor: strategyColors.default, color: strategyColors.dark }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: strategyColors.default, color: 'white' }}>{post.strategyName}</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/50">{activeChannel}</span>
            </div>
            <p className="text-sm font-medium">{STRATEGY_OBJECTIVES[post.strategyName] || 'Build engagement'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Why we're posting this</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              This <span className="font-medium" style={{ color: strategyColors.dark }}>{post.strategyName.toLowerCase()}</span> post {' '}
              {strategyReason}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Customer Journey Stage</h4>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2">
              {CUSTOMER_JOURNEY_STAGES.map(stage => <span key={stage.key} className="w-1/6 text-center">{stage.label}</span>)}
            </div>
            <div className="h-2 bg-gray-200 rounded-full relative">
              <div className="h-2 rounded-full w-1/6 transition-all duration-500" style={{ backgroundColor: strategyColors.default, left: `${journeyPosition * 16.66}%` }} />
              <div className="absolute top-3 left-0 right-0 flex justify-between text-[9px] text-gray-400">
                {CUSTOMER_JOURNEY_STAGES.map((stage, i) => <span key={stage.key} className={i === journeyPosition ? 'font-bold' : ''}>{stage.label}</span>)}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">This content targets the <strong>{CUSTOMER_JOURNEY_STAGES[journeyPosition].label}</strong> stage</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
              Hook Options for {activeChannel} <span className="text-xs text-gray-400">{allHooks.length} variations</span>
            </h4>
            <div className="space-y-2">
              {allHooks.map((hook, index) => (
                <div key={hook} className="group relative">
                  <button onClick={() => setSelectedHook(hook)} className={hookButtonClass(selectedHook === hook)}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1 pr-8">{index === 0 ? '★ Primary: ' : '✦ Alternative: '}{hook}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleCopyHook(hook); }} className="p-1.5 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100" aria-label="Copy hook">
                        {copiedHook === hook ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400" />}
                      </button>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex justify-between items-center">
              Call to Action
              <span className={ctaBadgeClass}>
                {platformContent.ctaType === 'KEYWORD' ? 'Keyword Automation' : 'External Link'}
              </span>
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><span className="font-semibold text-gray-900">"{platformContent.cta}"</span></div>
              <div className="text-sm text-gray-600">
                {platformContent.ctaType === 'KEYWORD' 
                  ? `When users reply with "${platformContent.ctaValue}", they'll receive an automated response.`
                  : `Clicking this CTA directs users to: ${platformContent.ctaValue}`}
              </div>
              <div className="mt-3 p-2 bg-white rounded border border-gray-100 text-xs text-gray-500 font-mono">
                {platformContent.ctaType === 'KEYWORD' ? `Trigger: ${platformContent.ctaValue}` : `URL: ${platformContent.ctaValue}`}
              </div>
            </div>
          </div>

          <button onClick={() => setShowLogic(!showLogic)} className="flex items-center gap-2 font-semibold text-sm hover:underline" style={{ color: strategyColors.default }}>
            {showLogic ? 'Hide' : 'Show'} the strategic logic {showLogic ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showLogic && (
            <div className="bg-gray-50 p-6 rounded-xl space-y-2 text-center text-sm border border-gray-100 font-medium text-gray-700 animate-fade-in">
              <div className="flex items-center justify-center gap-2"><span className="px-2 py-1 rounded bg-white border border-gray-200">BUSINESS GOAL</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="flex items-center justify-center gap-2"><span className="px-2 py-1 rounded bg-white border border-gray-200">CUSTOMER NEED</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="flex items-center justify-center gap-2"><span className="px-2 py-1 rounded bg-white border border-gray-200">CONTENT STRATEGY</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="flex items-center justify-center gap-2"><span className="px-2 py-1 rounded bg-white border border-gray-200">{post.strategyName} POST</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="flex items-center justify-center gap-2"><span className="px-2 py-1 rounded text-white font-semibold" style={{ backgroundColor: strategyColors.default }}>DESIRED ACTION</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};