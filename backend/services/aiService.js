const axios = require('axios');

// AI service for task prioritization and smart features
class AiService {
  constructor() {
    this.endpoint = process.env.OPENROUTER_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.defaultModel = process.env.DEFAULT_MODEL || 'anthropic/claude-3-haiku';
  }

  // Analyze tasks and suggest priorities based on due dates, description, and calendar
  async suggestTaskPriorities(tasks, calendarEvents) {
    try {
      const prompt = this._buildTaskPriorityPrompt(tasks, calendarEvents);
      
      const response = await this._callLLM({
        messages: [
          { role: 'system', content: 'You are an AI assistant that helps prioritize tasks based on urgency, importance, and calendar context.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2, // Low temperature for more consistent results
        model: this.defaultModel
      });
      
      return this._parseTaskPriorities(response, tasks);
    } catch (error) {
      console.error('AI service error:', error);
      return { error: 'Failed to generate task priorities' };
    }
  }

  // Summarize a note using the LLM
  async summarizeNote(note) {
    try {
      const prompt = `Please summarize the following note in 2-3 sentences, capturing the key points:\n\n${note.content}`;
      
      const response = await this._callLLM({
        messages: [
          { role: 'system', content: 'You are an AI assistant that creates concise, accurate summaries of notes.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        model: this.defaultModel
      });
      
      return { summary: response.trim() };
    } catch (error) {
      console.error('AI service error:', error);
      return { error: 'Failed to generate note summary' };
    }
  }

  // Generate smart email reply
  async generateEmailReply(email, userContext) {
    try {
      const prompt = `Please generate a professional reply to the following email. 
      Use the user's context and previous communication style to match their tone.
      
      Email: ${email.content}
      
      User context: 
      Name: ${userContext.name}
      Role: ${userContext.role}
      Previous communication style: ${userContext.style}`;
      
      const response = await this._callLLM({
        messages: [
          { role: 'system', content: 'You are an AI assistant that helps craft professional email responses that match the user\'s communication style.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        model: this.defaultModel
      });
      
      return { reply: response.trim() };
    } catch (error) {
      console.error('AI service error:', error);
      return { error: 'Failed to generate email reply' };
    }
  }

  // Generate LinkedIn post
  async generateLinkedInPost(topic, style, length) {
    try {
      const prompt = `Create a professional LinkedIn post about ${topic}. 
      The post should be in a ${style} style and approximately ${length} words long.`;
      
      const response = await this._callLLM({
        messages: [
          { role: 'system', content: 'You are an AI assistant that creates engaging and professional LinkedIn posts.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        model: this.defaultModel
      });
      
      return { post: response.trim() };
    } catch (error) {
      console.error('AI service error:', error);
      return { error: 'Failed to generate LinkedIn post' };
    }
  }

  // Internal method to call the LLM API
  async _callLLM(payload) {
    const response = await axios.post(
      this.endpoint,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  }

  // Build prompt for task prioritization
  _buildTaskPriorityPrompt(tasks, calendarEvents) {
    const taskDetails = tasks.map(task => {
      return `Task: ${task.title}
Description: ${task.description || 'No description'}
Due date: ${task.dueDate ? new Date(task.dueDate).toISOString() : 'No due date'}
Status: ${task.status}
Current priority: ${task.priority}`;
    }).join('\n\n');

    const calendarContext = calendarEvents.map(event => {
      return `Event: ${event.title}
Start: ${new Date(event.startTime).toISOString()}
End: ${new Date(event.endTime).toISOString()}`;
    }).join('\n\n');

    return `Please analyze these tasks and suggest priorities (urgent, high, medium, low) based on due dates, descriptions, and calendar events. Provide brief reasoning for each.

TASKS:
${taskDetails}

CALENDAR EVENTS:
${calendarContext}

Please return your analysis in JSON format with task IDs and suggested priorities:
{
  "taskPriorities": [
    {"id": "task_id", "suggestedPriority": "high", "reasoning": "Due soon and conflicts with calendar event"}
  ]
}`;
  }

  // Parse the LLM response and apply to tasks
  _parseTaskPriorities(response, tasks) {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return { error: 'Failed to parse AI response' };
      
      const json = JSON.parse(jsonMatch[0]);
      return json;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return { error: 'Failed to parse AI response' };
    }
  }
}

module.exports = new AiService(); 