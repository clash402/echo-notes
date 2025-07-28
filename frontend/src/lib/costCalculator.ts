// OpenAI pricing (as of 2024) - these should be configurable
const PRICING = {
  // Whisper API pricing (per minute of audio)
  whisper: {
    model: 'whisper-1',
    costPerMinute: 0.006, // $0.006 per minute
  },
  // GPT-4 pricing (per 1K tokens)
  gpt4: {
    input: 0.03, // $0.03 per 1K input tokens
    output: 0.06, // $0.06 per 1K output tokens
  },
  // GPT-3.5-turbo pricing (per 1K tokens) - fallback
  gpt35: {
    input: 0.0015, // $0.0015 per 1K input tokens
    output: 0.002, // $0.002 per 1K output tokens
  },
};

export interface CostEstimate {
  transcription: {
    tokens: number;
    cost: number;
  };
  summarization: {
    tokens: number;
    cost: number;
  };
  total: {
    tokens: number;
    cost: number;
  };
}

/**
 * Estimate transcription cost based on audio duration
 * Whisper API charges per minute of audio, not per token
 */
export function estimateTranscriptionCost(audioDurationSeconds: number): {
  tokens: number;
  cost: number;
} {
  const durationMinutes = audioDurationSeconds / 60;
  const estimatedTokens = Math.ceil(durationMinutes * 150); // Rough estimate: 150 tokens per minute
  const cost = durationMinutes * PRICING.whisper.costPerMinute;
  
  return {
    tokens: estimatedTokens,
    cost,
  };
}

/**
 * Estimate summarization cost based on input text length
 */
export function estimateSummarizationCost(
  inputText: string,
  useGPT4: boolean = false
): {
  tokens: number;
  cost: number;
} {
  // Rough token estimation: 1 token ≈ 4 characters for English text
  const inputTokens = Math.ceil(inputText.length / 4);
  
  // Estimate output tokens (summary is typically 20-30% of input)
  const outputTokens = Math.ceil(inputTokens * 0.25);
  
  const pricing = useGPT4 ? PRICING.gpt4 : PRICING.gpt35;
  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;
  
  return {
    tokens: inputTokens + outputTokens,
    cost: inputCost + outputCost,
  };
}

/**
 * Calculate total cost for a complete processing session
 */
export function calculateTotalCost(
  audioDurationSeconds: number,
  transcriptText: string,
  useGPT4: boolean = false
): CostEstimate {
  const transcription = estimateTranscriptionCost(audioDurationSeconds);
  const summarization = estimateSummarizationCost(transcriptText, useGPT4);
  
  return {
    transcription,
    summarization,
    total: {
      tokens: transcription.tokens + summarization.tokens,
      cost: transcription.cost + summarization.cost,
    },
  };
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(cost);
}

/**
 * Format token count for display
 */
export function formatTokens(tokens: number): string {
  return new Intl.NumberFormat('en-US').format(tokens);
} 