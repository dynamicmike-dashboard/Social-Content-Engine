import React, { useEffect, useState } from 'react';
import { dataService } from '../data/dataService';
import { ContentPost } from '../types';
import { ContentDetailModal } from './ContentDetailModal';

export const Approvals = () => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

  useEffect(() => {
    dataService.getPosts().then(p => setPosts(p.filter(post => post.status === 'PENDING')));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Approvals Queue</h2>
      <p className="text-gray-500">{posts.length} posts waiting for review.</p>
      <div className="space-y-4">
        {posts.map(post => (
            <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#7FB3D5]">
                <div>
                    <div className="font-semibold">{post.title}</div>
                    <div className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()} • {post.strategy}</div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#A3E4D7] text-white rounded-lg text-sm">Approve</button>
                    <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Edit</button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">Remove</button>
                </div>
            </div>
        ))}
      </div>
      {selectedPost && <ContentDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
};
