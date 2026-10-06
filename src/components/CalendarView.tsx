import React, { useEffect, useState } from 'react';
import { dataService } from '../data/dataService';
import { ContentPost } from '../types';
import { ContentDetailModal } from './ContentDetailModal';

export const CalendarView = () => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

  useEffect(() => {
    dataService.getPosts().then(setPosts);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">October Content Plan</h2>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-400 text-sm py-2">{day}</div>
        ))}
        {posts.map((post) => (
          <div key={post.id} onClick={() => setSelectedPost(post)} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm h-32 flex flex-col gap-1 hover:border-[#7FB3D5] transition-colors cursor-pointer">
            <div className="text-xs text-gray-400">{new Date(post.date).getDate()}</div>
            <div className={`text-xs font-semibold px-2 py-1 rounded ${
                post.strategy === 'EDUCATE' ? 'bg-blue-100 text-blue-800' :
                post.strategy === 'ENGAGE' ? 'bg-green-100 text-green-800' :
                post.strategy === 'AUTHORITY' ? 'bg-yellow-100 text-yellow-800' :
                post.strategy === 'STORY' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
            }`}>{post.strategy}</div>
            <div className="text-sm truncate font-medium">{post.title}</div>
            <div className="text-xs text-gray-500">{post.status}</div>
          </div>
        ))}
      </div>
      {selectedPost && <ContentDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
};
