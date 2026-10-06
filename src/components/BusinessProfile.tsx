import React from 'react';

const sections = [
  { title: 'Your Business', questions: ['What does your business do?', 'What makes you different?'] },
  { title: 'Your Customers', questions: ['Who is your ideal customer?', 'What does your customer want?', 'What are their biggest frustrations?'] },
  { title: 'Your Offers', questions: ['What problem do you solve?', 'What products/services do you most want to promote?'] },
  { title: 'Your Brand', questions: ['What tone should your brand use?', 'What words should AI avoid?'] },
  { title: 'Your Content', questions: ['What questions do customers frequently ask?', 'What objections stop people buying?'] },
  { title: 'Your Goals', questions: ['What action should people take after seeing your content?'] },
];

export const BusinessProfile = ({ onGenerate }: { onGenerate: () => void }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Business Profile</h2>
      {sections.map(section => (
        <div key={section.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-[#7FB3D5]">{section.title}</h3>
          <div className="space-y-4">
            {section.questions.map(q => (
              <div key={q}>
                <label className="block text-sm font-medium text-gray-700">{q}</label>
                <textarea className="w-full mt-1 p-3 border rounded-lg" rows={2} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-gray-200 rounded-lg font-semibold">Save Profile</button>
        <button onClick={onGenerate} className="px-6 py-3 bg-[#A3E4D7] text-white rounded-lg font-semibold hover:bg-[#86D6C7]">Generate My 30-Day Plan</button>
      </div>
    </div>
  );
};
