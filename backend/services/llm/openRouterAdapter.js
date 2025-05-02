/**
 * OpenRouter LLM Adapter Implementation
 */
const axios = require('axios');
const LLMAdapter = require('./adapter');

class OpenRouterAdapter extends LLMAdapter {
  constructor(config = {}) {
    super(config);
    this.endpoint = process.env.OPENROUTER_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.defaultModel = config.defaultModel || process.env.DEFAULT_MODEL || 'meta-llama/llama-4-maverick:free';
    
    console.log(`OpenRouter default model: ${this.defaultModel}`);
    
    // OpenRouter-specific available models
    this.availableModels = [
      { id: 'meta-llama/llama-4-maverick:free', name: 'Llama-4-Maverick (Free)', provider: 'Meta' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
      { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
      { id: 'openai/gpt-4', name: 'GPT-4', provider: 'OpenAI' },
      { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    ];
  }

  /**
   * Check if adapter is properly configured
   */
  isConfigured() {
    return Boolean(this.apiKey && this.endpoint);
  }

  /**
   * Get available models from OpenRouter
   */
  getAvailableModels() {
    return this.availableModels;
  }

  /**
   * Send chat completion request to OpenRouter
   * 
   * @param {Array} messages Array of messages with role and content
   * @param {Object} options Additional options
   * @returns {Promise<string>} LLM response text
   */
  async chatCompletion(messages, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter adapter is not properly configured. Check API key and endpoint.');
    }

    try {
      const model = options.model || this.defaultModel;
      const temperature = options.temperature !== undefined ? options.temperature : this.config.temperature;
      const max_tokens = options.maxTokens || this.config.maxTokens;

      const response = await axios.post(
        this.endpoint,
        {
          messages,
          model,
          temperature,
          max_tokens,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'https://neema.app', // OpenRouter requires this for tracking
            'X-Title': 'Neema Productivity App'
          }
        }
      );

      // Validate and extract response text
      if (
        response.data &&
        response.data.choices &&
        response.data.choices[0] &&
        response.data.choices[0].message &&
        response.data.choices[0].message.content
      ) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from OpenRouter');
      }
    } catch (error) {
      // Enhanced error logging
      console.error('OpenRouter API Error:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
  }
}

module.exports = OpenRouterAdapter;