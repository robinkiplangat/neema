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

  // Generate chat response
  async generateChatResponse(message, history = [], context = {}, model = this.defaultModel) {
    try {
      const systemPrompt = `You are Neema, a helpful AI assistant integrated into a productivity dashboard. 
      Your goal is to assist the user with tasks, scheduling, communication, and insights based on their provided context. 
      Be concise, helpful, and proactive. 
      Current Date/Time: ${new Date().toISOString()}
      User Context: ${JSON.stringify(context, null, 2)}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ];

      const response = await this._callLLM({
        messages,
        model,
        temperature: 0.7
      });

      return { response: response.trim() };
    } catch (error) {
      console.error('AI service error generating chat response:', error);
      return { error: 'Failed to generate chat response' };
    }
  }

    async suggestTasks(userId, context = {}, model = this.defaultModel) {
     try {
       const prompt = `Based on the user's context (recent tasks, upcoming events, unread emails, productivity stats, preferences), suggest 3-5 actionable tasks they might want to add. Provide title, suggested priority (high, medium, low), and optionally a due date (YYYY-MM-DD). Format the response as a JSON array of objects: 
[{"title": "Task Title", "priority": "medium", "dueDate": "YYYY-MM-DD"}]

User Context:
${JSON.stringify(context, null, 2)}`;

       const response = await this._callLLM({
         messages: [
           { role: 'system', content: 'You are an AI assistant that suggests relevant tasks based on user context. Respond ONLY with the JSON array.' },
           { role: 'user', content: prompt }
         ],
         model,
         temperature: 0.5
       });

       // Attempt to parse the JSON response
       try {
         const suggestions = JSON.parse(response.trim());
         return { suggestions };
       } catch (parseError) {
         console.error('AI service error parsing task suggestions:', parseError, 'Raw response:', response);
         return { error: 'Failed to parse task suggestions from AI response' };
       }
     } catch (error) {
       console.error('AI service error suggesting tasks:', error);
       return { error: 'Failed to suggest tasks' };
     }
   }

   // Analyze productivity data
   async analyzeProductivity(userId, timeRange, data, model = this.defaultModel) {
     try {
       const prompt = `Analyze the following productivity data for user ${userId} within the time range ${JSON.stringify(timeRange)}. 
Data: ${JSON.stringify(data, null, 2)}
Provide insights on focus areas, potential distractions, and suggestions for improvement. Format the response as a JSON object: {"insights": "...", "suggestions": ["..."]}`;

       const response = await this._callLLM({
         messages: [
           { role: 'system', content: 'You are an AI assistant that analyzes productivity data and provides actionable insights.' },
           { role: 'user', content: prompt }
         ],
         model,
         temperature: 0.4
       });

       try {
         const analysis = JSON.parse(response.trim());
         return { analysis };
       } catch (parseError) {
         console.error('AI service error parsing productivity analysis:', parseError, 'Raw response:', response);
         return { error: 'Failed to parse productivity analysis from AI response' };
       }
     } catch (error) {
       console.error('AI service error analyzing productivity:', error);
       return { error: 'Failed to analyze productivity' };
     }
   }

   // Summarize emails
   async summarizeEmails(emails, maxLength = 100, model = this.defaultModel) {
     try {
       const emailContent = emails.map((e, index) => `Email ${index + 1}:
Subject: ${e.subject}
From: ${e.from}
Snippet: ${e.snippet}
---
`).join('\n');
       const prompt = `Summarize the key points from the following emails concisely (target ${maxLength} words total):

${emailContent}`;

       const response = await this._callLLM({
         messages: [
           { role: 'system', content: `You are an AI assistant that summarizes email content concisely. Target total summary length: ${maxLength} words.` },
           { role: 'user', content: prompt }
         ],
         model,
         temperature: 0.3
       });

       return { summary: response.trim() };
     } catch (error) {
       console.error('AI service error summarizing emails:', error);
       return { error: 'Failed to summarize emails' };
     }
   }

   // Generate daily summary
   async generateDailySummary(userId, date, model = this.defaultModel) {
     try {
       // In a real app, fetch relevant data for the user and date (tasks, events, etc.)
       // For now, we'll use a placeholder context
       const context = {
         tasks: [{ title: 'Prepare presentation', status: 'in progress' }, { title: 'Team meeting', status: 'scheduled' }],
         events: [{ title: 'Client call', time: '14:00' }],
         date: date || new Date().toISOString().split('T')[0]
       };

       const prompt = `Generate a brief daily summary for user ${userId} for ${context.date}. Include a greeting, key focus areas based on tasks/events, top 1-2 tasks, upcoming events, and a brief productivity insight or tip. 
Context: ${JSON.stringify(context, null, 2)}
Format the response as a JSON object: {"greeting": "...", "focusAreas": ["..."], "topTasks": [{"title": "..."}], "upcomingEvents": [{"title": "...", "time": "..."}], "insights": "..."}`;

       const response = await this._callLLM({
         messages: [
           { role: 'system', content: 'You are an AI assistant that generates helpful daily summaries for users.' },
           { role: 'user', content: prompt }
         ],
         model,
         temperature: 0.6
       });

       try {
         const summary = JSON.parse(response.trim());
         return summary;
       } catch (parseError) {
         console.error('AI service error parsing daily summary:', parseError, 'Raw response:', response);
         return { error: 'Failed to parse daily summary from AI response' };
       }
     } catch (error) {
       console.error('AI service error generating daily summary:', error);
       return { error: 'Failed to generate daily summary' };
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