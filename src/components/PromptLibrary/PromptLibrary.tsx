import React, { useCallback } from 'react';
import { BookOpen, Users, Calendar, MessageSquare, Image, Layout, Wand2, Target, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { PromptLibrarySearch, usePromptLibrary } from './PromptLibrarySearch';
import { PromptDetailModal } from './PromptDetailModal';
import { PromptDefinition, PromptCategoryId } from '../../lib/prompts/types';

const CATEGORY_ICONS: Record<PromptCategoryId, React.ElementType> = {
  P01: Users,
  P02: Calendar,
  P03: MessageSquare,
  P04: Image,
  P05: Layout,
  P06: Wand2,
  P07: Target,
  P08: ShieldCheck,
  P09: TrendingUp,
};

const CATEGORY_COLORS: Record<PromptCategoryId, { bg: string; text: string; border: string }> = {
  P01: { bg: '#DBEAFE', text: '#1D4ED8', border: '#3B82F6' },
  P02: { bg: '#D1FAE5', text: '#059669', border: '#10B981' },
  P03: { bg: '#EDE9FE', text: '#7C3AED', border: '#8B5CF6' },
  P04: { bg: '#FFEDD5', text: '#EA580C', border: '#F97316' },
  P05: { bg: '#FCE7F3', text: '#BE185D', border: '#EC4899' },
  P06: { bg: '#E0E7FF', text: '#4F46E5', border: '#6366F1' },
  P07: { bg: '#CCFBF1', text: '#0F766E', border: '#14B8A6' },
  P08: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  P09: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
};

export const PromptLibrary: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    setSelectedPromptId,
    filteredPrompts,
    selectedPrompt,
    categories,
  } = usePromptLibrary();

  const handleExecutePrompt = useCallback((promptId: string) => {
    setSelectedPromptId(promptId);
    // The execution logic will be handled by a parent component or a dedicated hook
    // For now, we'll just open the detail modal with the prompt
    console.log('Execute prompt:', promptId);
  }, [setSelectedPromptId]);

  const getStatusBadge = (status: PromptDefinition['status']) => {
    const configs = {
      implemented: { label: 'Implemented', bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
      tested: { label: 'Tested', bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
      experimental: { label: 'Experimental', bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
      planned: { label: 'Planned', bg: '#F1F5F9', text: '#475569', border: '#94A3B8' },
    };
    return configs[status];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prompt Library</h1>
        <p className="text-gray-600 mt-2">
          Browse, search, and execute AI prompts for content generation. 
          <span className="font-medium">Implemented</span> prompts are ready to use. 
          <span className="font-medium">Planned</span> prompts are placeholders for future development.
        </p>
      </div>

      {/* Search & Filter */}
      <PromptLibrarySearch
        onSearch={setSearchQuery}
        onCategoryFilter={setActiveCategory}
        placeholder="Search prompts by name, ID, purpose, or description..."
      />

      {/* Results Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>
          {filteredPrompts.length} of {categories.reduce((sum, c) => sum + c.promptIds.length, 0)} prompts
          {searchQuery && <span className="ml-2">matching &ldquo;{searchQuery}&rdquo;</span>}
          {activeCategory !== 'all' && (
            <span className="ml-2">in {categories.find(c => c.id === activeCategory)?.label}</span>
          )}
        </span>
        <span className="font-mono">
          {filteredPrompts.filter(p => p.status === 'implemented' || p.status === 'tested').length} implemented
        </span>
      </div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No prompts match &ldquo;${searchQuery}&rdquo;` 
                : activeCategory !== 'all'
                  ? `No prompts in ${categories.find(c => c.id === activeCategory)?.label}`
                  : 'No prompts available'}
            </p>
          </div>
        ) : (
          filteredPrompts.map((prompt) => {
            const Icon = CATEGORY_ICONS[prompt.category] || BookOpen;
            const colors = CATEGORY_COLORS[prompt.category] || { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' };
            const statusBadge = getStatusBadge(prompt.status);
            const canExecute = prompt.status === 'implemented' || prompt.status === 'tested';

            return (
              <div
                key={prompt.id}
                className={`group p-5 rounded-2xl border transition-all hover:shadow-lg ${
                  prompt.status === 'planned' 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${colors.bg} ${colors.border}/20`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {prompt.category}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#7FB3D5] transition-colors">
                  {prompt.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prompt.purpose}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {prompt.inputs.slice(0, 3).map((input) => (
                    <span key={input.key} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {input.required ? '*' : ''}{input.label}
                    </span>
                  ))}
                  {prompt.inputs.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                      +{prompt.inputs.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-mono">v{prompt.version}</span>
                  <button
                    onClick={() => setSelectedPromptId(prompt.id)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      canExecute 
                        ? 'text-[#7FB3D5] hover:text-[#6DB0D0]' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!canExecute}
                  >
                    {canExecute ? 'View Details' : 'Not Available'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <PromptDetailModal
        prompt={selectedPrompt}
        isOpen={!!selectedPrompt}
        onClose={() => setSelectedPromptId(null)}
        onExecute={handleExecutePrompt}
      />
    </div>
  );
};