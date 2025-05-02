/**
 * LLM Adapter - Base class for all LLM providers
 * 
 * This adapter system allows easy switching between different LLM providers
 * while maintaining a consistent interface for the application.
 */
class LLMAdapter {
  constructor(config = {}) {
    this.config = {
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    };
  }

  /**
   * Send a chat completion request to the LLM
   * 
   * @param {Array} messages Array of message objects with role and content
   * @param {Object} options Additional options for the request
   * @returns {Promise<string>} The LLM response text
   */
  async chatCompletion(messages, options = {}) {
    throw new Error('Method chatCompletion must be implemented by subclass');
  }

  /**
   * Check if the adapter is properly configured
   * 
   * @returns {boolean} True if the adapter is ready to use
   */
  isConfigured() {
    throw new Error('Method isConfigured must be implemented by subclass');
  }

  /**
   * Get information about the models available through this adapter
   * 
   * @returns {Array<Object>} Array of model information objects
   */
  getAvailableModels() {
    throw new Error('Method getAvailableModels must be implemented by subclass');
  }

  /**
   * Get adapter-specific configuration
   * 
   * @returns {Object} Configuration object
   */
  getConfig() {
    return this.config;
  }

  /**
   * Set adapter-specific configuration
   * 
   * @param {Object} config New configuration object
   */
  setConfig(config) {
    this.config = {
      ...this.config,
      ...config
    };
  }
}

module.exports = LLMAdapter;