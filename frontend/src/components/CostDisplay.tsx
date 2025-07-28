'use client';

import { DollarSign, Brain, FileText, Calculator } from 'lucide-react';
import { CostBreakdown, TokenUsage } from '@/types';

interface CostDisplayProps {
  costBreakdown: CostBreakdown;
  tokenUsage: TokenUsage;
  isVisible: boolean;
  onClose?: () => void;
}

export const CostDisplay = ({ 
  costBreakdown, 
  tokenUsage, 
  isVisible, 
  onClose 
}: CostDisplayProps) => {
  if (!isVisible) return null;

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(cost);
  };

  const formatTokens = (tokens: number) => {
    return new Intl.NumberFormat('en-US').format(tokens);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Token Usage & Cost</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transcription */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Transcription</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tokens:</span>
              <span className="font-mono">{formatTokens(costBreakdown.transcription.tokens)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cost:</span>
              <span className="font-mono text-blue-700">{formatCost(costBreakdown.transcription.cost)}</span>
            </div>
          </div>
        </div>

        {/* Summarization */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">Summarization</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tokens:</span>
              <span className="font-mono">{formatTokens(costBreakdown.summarization.tokens)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cost:</span>
              <span className="font-mono text-green-700">{formatCost(costBreakdown.summarization.cost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Total</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {formatTokens(costBreakdown.total.tokens)} tokens
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCost(costBreakdown.total.cost)}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Costs are estimates based on OpenAI&apos;s current pricing. 
          Actual costs may vary slightly.
        </p>
      </div>
    </div>
  );
}; 