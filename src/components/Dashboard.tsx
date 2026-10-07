import React, { useEffect, useState } from 'react';
import { dataService } from '../data/dataService';
import { ContentPost, StrategyType } from '../types';
import { useSession } from '../context/SessionContext';
import { StrategyHealth } from './StrategyHealth';
import { TimeSaved } from './TimeSaved';

export const Dashboard = () => {
  const { mode } = useSession();
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getPosts().then(p => {
        setPosts(p);
        setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  // In CLIENT mode with no data, show helpful empty state
  if (mode === 'CLIENT' && posts.length === 0) {
    return (
      <div className="text-center p-20 border-2 border-dashed rounded-2xl">
        <h2 className="text-2xl font-bold">Your Content Engine is getting ready</h2>
        <p className="text-gray-500 mt-4">Your dashboard will populate once your content is generated and approved.</p>
      </div>
    );
  }

  const stats = {
    planned: posts.length,
    approved: posts.filter(p => p.status === 'APPROVED').length,
    pending: posts.filter(p => p.status === 'DRAFT' || p.status === 'GENERATED' || p.status === 'CLIENT_REVIEW').length,
    changes: posts.filter(p => p.status === 'CHANGES_REQUESTED').length,
  };

  const distribution = posts.reduce((acc, post) => {
    acc[post.strategy] = (acc[post.strategy] || 0) + 1;
    return acc;
  }, {} as Record<StrategyType, number>);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold">Caribbean Wellness Studio</h2>
        <p className="text-xl text-gray-500 mt-2">Your Social Media This Month</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Planned Posts', value: stats.planned },
          { label: 'Approved', value: stats.approved },
          { label: 'Awaiting Review', value: stats.pending },
          { label: 'Changes Requested', value: stats.changes },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-[#7FB3D5]">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <StrategyHealth health="Healthy balance" />
        <TimeSaved hours={60} />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Strategy Distribution</h3>
        <div className="flex gap-4">
            {(['EDUCATE', 'ENGAGE', 'AUTHORITY', 'STORY', 'PROMOTE'] as StrategyType[]).map(strategy => (
                <div key={strategy} className="flex-1 text-center p-4 rounded-xl bg-gray-50">
                    <div className="text-2xl font-bold">{distribution[strategy] || 0}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{strategy}</div>
                </div>
            ))}
        </div>
        <p className="text-gray-500 mt-6 text-sm italic text-center">"Your content isn't random. Every post has a job."</p>
      </div>
    </div>
  );
};
