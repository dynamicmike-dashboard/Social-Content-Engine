export const TimeSaved = ({ hours }: { hours: number }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-2">Est. Time Saved</h3>
        <div className="text-3xl font-bold text-[#7FB3D5]">{hours} hrs</div>
        <p className="text-xs text-gray-500 mt-2">Reclaimed this month</p>
    </div>
);
