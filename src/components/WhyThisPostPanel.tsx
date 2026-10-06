import React, { useState } from 'react';
import { ContentPost } from '../types';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const getStrategyColor = (strategy: string) => {
  switch (strategy) {
    case 'EDUCATE': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ENGAGE': return 'bg-green-100 text-green-800 border-green-200';
    case 'AUTHORITY': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'STORY': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'PROMOTE': return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const WhyThisPostPanel = ({ post, onClose }: { post: ContentPost, onClose: () => void }) => {
  const [showLogic, setShowLogic] = useState(false);
  const [selectedHook, setSelectedHook] = useState(post.platformContent['FACEBOOK'].hook);
  const strategyColor = getStrategyColor(post.strategy);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-8 overflow-y-auto">
        <button onClick={onClose} className="mb-6 text-gray-400 hover:text-gray-600">Close Panel</button>
        <h2 className="text-2xl font-bold mb-8 text-[#2D2D2D]">Why This Post?</h2>
        
        <div className="space-y-8">
          <div className={`p-4 rounded-xl border ${strategyColor}`}>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">{post.strategy}</h3>
            <p className="text-sm opacity-90">Objective: {post.strategy === 'AUTHORITY' ? 'Build credibility' : 'Engage audience'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Why we're posting this</h4>
            <p className="text-gray-600 text-sm leading-relaxed">Your audience needs confidence before they are ready to contact you. This {post.strategy.toLowerCase()} post demonstrates your expertise without asking for a sale immediately.</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Customer Journey</h4>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2">
                <span>KNOW</span><span>TRUST</span><span>ENGAGE</span><span>CONSIDER</span><span>ACT</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
                <div className={`h-2 rounded-full w-2/5 ${strategyColor.split(' ')[0].replace('bg-', 'bg-')}`}></div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Choose a Hook</h4>
            <div className="space-y-2">
                {[post.platformContent['FACEBOOK'].hook, ...(post.alternativeHooks || [])].map(hook => (
                    <button key={hook} onClick={() => setSelectedHook(hook)} className={`w-full text-left p-3 text-sm rounded border ${selectedHook === hook ? 'border-[#7FB3D5] bg-blue-50' : 'border-gray-200'}`}>
                        {hook}
                    </button>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex justify-between items-center">
                CTA: {post.ctaType === 'keyword' ? 'Keyword Automation' : 'External Link'}
            </h4>
            <div className="bg-white p-3 rounded border border-gray-100 text-sm">
                {post.ctaType === 'keyword' ? `Respond with: "${post.ctaValue}"` : `Link: ${post.ctaValue}`}
            </div>
          </div>

          <button onClick={() => setShowLogic(!showLogic)} className="flex items-center gap-2 font-semibold text-[#7FB3D5] text-sm hover:underline">
            Show me the logic {showLogic ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showLogic && (
            <div className="bg-white p-6 rounded-xl shadow-inner space-y-2 text-center text-sm border border-gray-100 font-medium text-gray-700">
                <p>BUSINESS GOAL</p><p className="text-gray-300">↓</p>
                <p>CUSTOMER NEED</p><p className="text-gray-300">↓</p>
                <p>CONTENT STRATEGY</p><p className="text-gray-300">↓</p>
                <p>THIS POST</p><p className="text-gray-300">↓</p>
                <p className="text-[#7FB3D5]">DESIRED ACTION</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
