const strategyItems = [
  { name: 'EDUCATE', desc: 'Build trust by teaching.' },
  { name: 'ENGAGE', desc: 'Start conversations.' },
  { name: 'AUTHORITY', desc: 'Show why you are worth listening to.' },
  { name: 'STORY', desc: 'Make the business human.' },
  { name: 'PROMOTE', desc: 'Give people a reason to take action.' },
];

export const Strategy = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Strategy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategyItems.map(item => (
            <div key={item.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-[#7FB3D5]">{item.name}</h4>
                <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold mb-4">Why isn't everything promotional?</h4>
        <p className="text-gray-600">Because people don't want to be sold to every day. A strong content strategy creates attention, trust and familiarity before asking for the sale.</p>
      </div>
    </div>
  );
};
