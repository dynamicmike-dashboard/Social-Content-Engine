export const StrategyHealth = ({ health }: { health: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-2">Strategy Health</h3>
        <div className={`px-4 py-2 rounded-full inline-block font-bold ${health === 'Healthy balance' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {health}
        </div>
    </div>
);
