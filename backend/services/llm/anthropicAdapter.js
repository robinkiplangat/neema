/**
 * Anthropic (Claude) LLM Adapter Implementation
 */
const axios = require('axios');
const LLMAdapter = require('./adapter');

class AnthropicAdapter extends LLMAdapter {
  constructor(config = {}) {
    super(config);
    this.endpoint = 'https://api.anthropic.com/v1/messages';
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.defaultModel = config.defaultModel || process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-haiku-20240307';
    
    // Anthropic available models
    this.availableModels = [
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic' },
    ];
  }

  /**
   * Check if adapter is properly configured
   */
  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Get available models from Anthropic
   */
  getAvailableModels() {
    return this.availableModels;
  }

  /**
   * Convert OpenAI-like messages format to Anthropic format
   * Anthropic API uses a different message format than OpenAI
   * 
   * @param {Array} messages Array of messages with role and content in OpenAI format
   * @returns {Object} Messages in Anthropic format
   */
  _formatMessages(messages) {
    // Extract system message if present
    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');

    // Combine system messages into a single string
    const systemPrompt = systemMessages.map(m => m.content).join('\n\n');

    // Convert the remaining messages to Anthropic format
    const formattedMessages = nonSystemMessages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }));

    return {
      system: systemPrompt,
      messages: formattedMessages
    };
  }

  /**
   * Send chat completion request to Anthropic
   * 
   * @param {Array} messages Array of messages with role and content
   * @param {Object} options Additional options
   * @returns {Promise<string>} LLM response text
   */
  async chatCompletion(messages, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Anthropic adapter is not properly configured. Check API key.');
    }

    try {
      const model = options.model || this.defaultModel;
      const temperature = options.temperature !== undefined ? options.temperature : this.config.temperature;
      const max_tokens = options.maxTokens || this.config.maxTokens;

      // Format messages for Anthropic API
      const formattedData = this._formatMessages(messages);

      const response = await axios.post(
        this.endpoint,
        {
          model,
          messages: formattedData.messages,
          system: formattedData.system,
          temperature,
          max_tokens,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          }
        }
      );

      // Validate and extract response text
      if (
        response.data &&
        response.data.content &&
        response.data.content.length > 0 &&
        response.data.content[0].text
      ) {
        return response.data.content[0].text;
      } else {
        throw new Error('Invalid response format from Anthropic');
      }
    } catch (error) {
      // Enhanced error logging
      console.error('Anthropic API Error:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
}

module.exports = AnthropicAdapter;