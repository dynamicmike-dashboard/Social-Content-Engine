import { useState, useCallback, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { getPromptRegistry } from '../../lib/prompts/registry';
import { PromptCategoryId, PROMPT_CATEGORIES, PromptDefinition } from '../../lib/prompts/types';

export interface PromptLibrarySearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: PromptCategoryId | 'all') => void;
  placeholder?: string;
}

export const PromptLibrarySearch: React.FC<PromptLibrarySearchProps> = ({
  onSearch,
  onCategoryFilter,
  placeholder = 'Search prompts by name, ID, purpose...'
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PromptCategoryId | 'all'>('all');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleCategoryChange = useCallback((category: PromptCategoryId | 'all') => {
    setActiveCategory(category);
    onCategoryFilter(category);
  }, [onCategoryFilter]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7FB3D5] focus:border-transparent transition-all"
          aria-label="Search prompts"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Filter className="text-gray-400" size={20} />
        <select
          value={activeCategory}
          onChange={(e) => handleCategoryChange(e.target.value as PromptCategoryId | 'all')}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7FB3D5] focus:border-transparent transition-all min-w-[200px]"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {PROMPT_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Helper hook for using the prompt library
export function usePromptLibrary() {
  const registry = getPromptRegistry();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PromptCategoryId | 'all'>('all');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    let prompts = registry.getAllPrompts();

    if (searchQuery) {
      prompts = registry.searchPrompts(searchQuery);
    }

    if (activeCategory !== 'all') {
      prompts = prompts.filter(p => p.category === activeCategory);
    }

    return prompts;
  }, [registry, searchQuery, activeCategory]);

  const selectedPrompt = useMemo((): PromptDefinition | null => {
    if (!selectedPromptId) return null;
    return registry.getPrompt(selectedPromptId) ?? null;
  }, [registry, selectedPromptId]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectedPromptId,
    setSelectedPromptId,
    filteredPrompts,
    selectedPrompt,
    allPrompts: registry.getAllPrompts(),
    categories: PROMPT_CATEGORIES,
  };
}