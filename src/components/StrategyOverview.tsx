import { useState } from 'react';
import { StrategyName, StrategyDistribution, DEFAULT_STRATEGY_DISTRIBUTION } from '../types';

const STRATEGY_CONFIG: { type: StrategyName; color: string; desc: string; purpose: string }[] = [
  { type: 'EDUCATE', color: 'bg-blue-200', desc: 'Teach something useful and demonstrate your expertise.', purpose: 'Build trust' },
  { type: 'ENGAGE', color: 'bg-green-200', desc: 'Create interaction, conversation and community.', purpose: 'Start conversations' },
  { type: 'AUTHORITY', color: 'bg-yellow-200', desc: 'Demonstrate experience, credibility, proof and expertise.', purpose: 'Show expertise' },
  { type: 'STORY', color: 'bg-purple-200', desc: 'Humanise the business and create emotional connection.', purpose: 'Create connection' },
  { type: 'PROMOTE', color: 'bg-pink-200', desc: 'Create opportunities for enquiries, bookings or sales.', purpose: 'Ask for the sale' },
];

export const StrategyOverview = ({ onGenerate, initialDistribution }: { onGenerate: (dist: StrategyDistribution) => void; initialDistribution?: StrategyDistribution }) => {
  const [dist, setDist] = useState<StrategyDistribution>(initialDistribution || DEFAULT_STRATEGY_DISTRIBUTION);
  const total = Object.values(dist).reduce((a, b) => a + b, 0);

  const adjust = (type: StrategyName, delta: number) => {
    const newVal = dist[type] + delta;
    if (newVal < 0 || (total + delta > 30 && delta > 0) || (total + delta < 30 && delta < 0)) return;
    setDist(prev => ({ ...prev, [type]: newVal }));
  };

  const handleGenerate = () => {
    onGenerate(dist);
  };

  return (
    <>
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">YOUR 30-DAY SOCIAL MEDIA STRATEGY</h2>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Export Strategy</button>
        </div>
        <p className="text-xl text-gray-500 mt-2">"Your content isn't random. Every post has a job."</p>
        <p className="text-gray-600 mt-4 max-w-2xl">Before we create your content, we decide what your audience needs to see, hear and experience over the next 30 days.</p>
      </div>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-6">Strategic Content Mix</h3>
        <div className="flex gap-4">
            {STRATEGY_CONFIG.map(s => (
                <div key={s.type} className={`flex-1 p-4 rounded-xl ${s.color} bg-opacity-30`}>
                    <div className="font-bold text-lg">{s.type}</div>
                    <div className="text-2xl font-bold">{dist[s.type]} <span className="text-sm font-normal">posts</span></div>
                    <div className="text-xs mt-2">{Math.round((dist[s.type]/30)*100)}%</div>
                </div>
            ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold mb-4">Why isn't everything promotional?</h4>
        <p className="text-gray-600">Because people don't want to be sold to every day. A strong content strategy creates attention, trust, familiarity and authority before asking someone to take action.</p>
        <div className="flex justify-between mt-8 text-center px-10">
            {['KNOW YOU', 'TRUST YOU', 'ENGAGE WITH YOU', 'BELIEVE YOU', 'TAKE ACTION'].map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#7FB3D5] text-white flex items-center justify-center font-bold mb-2">{i+1}</div>
                    <div className="text-xs font-semibold">{step}</div>
                </div>
            ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4">Adjust Strategy</h3>
        <div className="grid grid-cols-5 gap-4">
            {STRATEGY_CONFIG.map(s => (
                <div key={s.type} className="flex flex-col items-center gap-2">
                    <span className="font-bold">{s.type}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => adjust(s.type, -1)} className="p-1 border rounded">-</button>
                        <span className="w-8 text-center">{dist[s.type]}</span>
                        <button onClick={() => adjust(s.type, 1)} className="p-1 border rounded">+</button>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-4 font-bold">TOTAL: {total} POSTS</div>
        <button onClick={() => setDist(DEFAULT_STRATEGY_DISTRIBUTION)} className="mt-4 text-sm text-[#7FB3D5]">Reset to recommended strategy</button>
      </section>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-sm">Based on your business: Your content is designed to reach your target audience, demonstrate your expertise and create more enquiries.</p>
      </div>

      <button onClick={handleGenerate} className="w-full py-4 bg-[#7FB3D5] text-white rounded-xl font-bold text-lg hover:bg-[#68A1C2] transition-colors">
        Generate My 30 Days
        <p className="text-sm font-normal">Create my complete content calendar using this strategy.</p>
      </button>
    </>
  );
};

export default StrategyOverview;