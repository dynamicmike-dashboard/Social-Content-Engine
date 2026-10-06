import React, { useState } from 'react';
import { ContentPost, Platform } from '../types';
import { WhyThisPostPanel } from './WhyThisPostPanel';

const getPlatformColor = (platform: Platform) => {
    switch (platform) {
        case 'FACEBOOK': return 'bg-blue-600';
        case 'INSTAGRAM': return 'bg-pink-600';
        case 'LINKEDIN': return 'bg-blue-800';
        case 'TWITTER': return 'bg-sky-500';
        default: return 'bg-gray-500';
    }
};

export const ContentDetailModal = ({ post, onClose }: { post: ContentPost, onClose: () => void }) => {
  const [showWhy, setShowWhy] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform>('FACEBOOK');

  const platforms: Platform[] = ['FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'TWITTER'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-2/3 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="mb-4 text-gray-500 hover:underline">Close</button>
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        
        <div className="flex border-b border-gray-200 mb-6">
            {platforms.map(p => (
                <button 
                    key={p} 
                    onClick={() => setActivePlatform(p)} 
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activePlatform === p 
                            ? `border-${getPlatformColor(p).split('-')[1]}-${getPlatformColor(p).split('-')[2]} text-${getPlatformColor(p).split('-')[1]}-800 font-bold` 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${getPlatformColor(p)}`}></span>
                    {p}
                </button>
            ))}
        </div>

        <div className="space-y-4 mb-8">
            <div><label className="font-bold block text-sm text-gray-500">Hook</label><p className="p-3 bg-gray-50 rounded border-l-4 border-l-gray-300">{post.platformContent[activePlatform].hook}</p></div>
            <div><label className="font-bold block text-sm text-gray-500">Caption</label><p className="p-3 bg-gray-50 rounded border-l-4 border-l-gray-300">{post.platformContent[activePlatform].caption}</p></div>
            <div><label className="font-bold block text-sm text-gray-500">CTA</label><p className="p-3 bg-gray-50 rounded border-l-4 border-l-gray-300">{post.platformContent[activePlatform].cta}</p></div>
        </div>

        <div className="flex gap-4">
            <button className="px-6 py-2 bg-[#A3E4D7] text-white rounded-lg hover:bg-[#86D6C7]">Approve</button>
            <button className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Edit</button>
            <button className="px-6 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">Request Changes</button>
            <button className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Remove/Reject</button>
            <button onClick={() => setShowWhy(true)} className="ml-auto px-6 py-2 bg-white border border-[#7FB3D5] text-[#7FB3D5] rounded-lg">Why this post?</button>
        </div>
        
        {showWhy && <WhyThisPostPanel post={post} onClose={() => setShowWhy(false)} />}
      </div>
    </div>
  );
};
