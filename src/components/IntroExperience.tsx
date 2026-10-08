import { useState, useEffect } from 'react';

export const IntroExperience = ({ onStartDemo, onSeeContent }: { onStartDemo: () => void, onSeeContent: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setStep(prev => (prev < 4 ? prev + 1 : 4));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    "How much would you charge me for an hour of your time?",
    "How many hours are you spending every month creating social media content?",
    "What if your entire month was strategically planned for you — and all you had to do was review and approve it?",
    "You stay in control. We take the work off your plate.",
    "Your Content Engine is ready."
  ];

  return (
    <div className="fixed inset-0 bg-[#FDFBF7] z-[60] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-4xl font-bold mb-10 text-[#2D2D2D] transition-opacity duration-1000">{steps[step]}</h1>
        
        {step === 4 && (
            <div className="flex gap-4 animate-in fade-in zoom-in duration-500">
                <button onClick={onSeeContent} className="px-8 py-4 bg-[#7FB3D5] text-white rounded-xl font-bold text-lg">Show Me My Content Engine</button>
                <button onClick={onStartDemo} className="px-8 py-4 bg-white border border-[#7FB3D5] text-[#7FB3D5] rounded-xl font-bold text-lg">See How It Works (Demo)</button>
            </div>
        )}
    </div>
  );
};
