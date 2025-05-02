# AI Integration Setup Guide

This guide explains how to set up and configure the AI integration in Neema.

## Requirements

You'll need API keys for at least one of the following LLM providers:

1. **OpenRouter** (recommended as it provides access to multiple models)
2. **OpenAI** (GPT-4, GPT-3.5 models)
3. **Anthropic** (Claude models)

## Environment Configuration

### Backend Environment Variables

Add the following to your `.env` file in the `backend` directory:

```bash
# ===== Required for default provider =====
# Choose one provider as default
DEFAULT_LLM_PROVIDER=openrouter  # Options: openrouter, openai, anthropic

# ===== OpenRouter Configuration =====
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
# Required for OpenRouter tracking
APP_URL=http://localhost:8080  # Your application URL

# ===== OpenAI Configuration =====
OPENAI_API_KEY=your_openai_api_key
OPENAI_DEFAULT_MODEL=gpt-3.5-turbo  # Default OpenAI model

# ===== Anthropic Configuration =====
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_DEFAULT_MODEL=claude-3-haiku-20240307  # Default Anthropic model

# ===== Task-specific model defaults (optional) =====
DEFAULT_CHAT_MODEL=anthropic/claude-3-haiku  # Format: provider/model_id
DEFAULT_PRODUCTIVITY_MODEL=openai/gpt-4
DEFAULT_SUMMARIZATION_MODEL=anthropic/claude-3-haiku
```

### Frontend Environment Variables

Add the following to your `.env` file in the root directory:

```bash
VITE_DEFAULT_MODEL=anthropic/claude-3-haiku  # Format: provider/model_id
```

## Adding a New LLM Provider

To add support for a new LLM provider:

1. Create a new adapter class in `backend/services/llm/`:

```javascript
// Example: myProviderAdapter.js
const LLMAdapter = require('./adapter');

class MyProviderAdapter extends LLMAdapter {
  constructor(config = {}) {
    super(config);
    this.endpoint = process.env.MY_PROVIDER_ENDPOINT;
    this.apiKey = process.env.MY_PROVIDER_API_KEY;
    this.defaultModel = config.defaultModel || process.env.MY_PROVIDER_DEFAULT_MODEL;
    
    this.availableModels = [
      { id: 'model-1', name: 'Model 1', provider: 'MyProvider' },
      { id: 'model-2', name: 'Model 2', provider: 'MyProvider' },
    ];
  }

  // Implement required methods
  isConfigured() {
    return Boolean(this.apiKey && this.endpoint);
  }

  getAvailableModels() {
    return this.availableModels;
  }

  async chatCompletion(messages, options = {}) {
    // Implementation for this provider
  }
}

module.exports = MyProviderAdapter;
```

2. Register the adapter in `llmFactory.js`:

```javascript
// Add to constructor
this.adapters = {
  'openrouter': new OpenRouterAdapter(),
  'openai': new OpenAIAdapter(),
  'anthropic': new AnthropicAdapter(),
  'myprovider': new MyProviderAdapter()  // Add new provider
};
```

## Debugging

### Common Issues

1. **API Key Issues**
   - Check the console for detailed error messages like "API key invalid" or "Authentication failed"
   - Verify your API keys are correct and have appropriate permissions

2. **Configuration Issues**
   - Check that your selected provider is properly configured
   - Use the `/ai/providers` endpoint to check provider status

3. **Response Format Issues**
   - Different providers may return slightly different formats
   - Check the adapter implementation for correct response parsing

### Diagnostic Endpoints

These endpoints can help diagnose issues:

- `GET /api/ai/models` - Lists all available models
- `GET /api/ai/providers` - Shows provider configuration status

## Testing the Integration

1. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Open the chat interface and use the model selector (gear icon) to switch between models
4. Test different features with different models to compare performance

## Best Practices

1. **Always Provide Fallbacks**
   - Configure multiple providers when possible
   - Set up proper fallback chains in your application logic

2. **Handle Rate Limits**
   - Implement exponential backoff for retries
   - Consider load balancing across multiple providers

3. **Monitor Costs**
   - Different models have different pricing
   - Set up monitoring and alerts for high usage

4. **Optimize Prompts**
   - Each model performs differently with various prompt formats
   - Test and refine prompts for each model you use