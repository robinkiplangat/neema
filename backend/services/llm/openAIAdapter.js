/**
 * OpenAI LLM Adapter Implementation
 */
const axios = require('axios');
const LLMAdapter = require('./adapter');

class OpenAIAdapter extends LLMAdapter {
  constructor(config = {}) {
    super(config);
    this.endpoint = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.defaultModel = config.defaultModel || process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo';
    
    // OpenAI available models
    this.availableModels = [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    ];
  }

  /**
   * Check if adapter is properly configured
   */
  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Get available models from OpenAI
   */
  getAvailableModels() {
    return this.availableModels;
  }

  /**
   * Send chat completion request to OpenAI
   * 
   * @param {Array} messages Array of messages with role and content
   * @param {Object} options Additional options
   * @returns {Promise<string>} LLM response text
   */
  async chatCompletion(messages, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI adapter is not properly configured. Check API key.');
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
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
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
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (error) {
      // Enhanced error logging
      console.error('OpenAI API Error:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

module.exports = OpenAIAdapter;