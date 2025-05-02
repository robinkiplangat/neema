const aiService = require('../services/aiService');
const Task = require('../models/Task');
const Note = require('../models/Note');

// Generate email reply
const generateEmailReply = async (req, res) => {
  try {
    const { emailContent, userContext } = req.body;
    
    if (!emailContent) {
      return res.status(400).json({ message: 'Email content is required' });
    }
    
    // Default user context if not provided
    const context = userContext || {
      name: req.user.firstName + ' ' + (req.user.lastName || ''),
      role: 'professional',
      style: 'formal'
    };
    
    const email = { content: emailContent };
    
    const replyResult = await aiService.generateEmailReply(email, context);
    
    if (replyResult.error) {
      return res.status(500).json({ message: replyResult.error });
    }
    
    res.json({ reply: replyResult.reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate LinkedIn post
const generateLinkedInPost = async (req, res) => {
  try {
    const { topic, style = 'professional', length = 'medium' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    
    // Convert length to word count
    let wordCount;
    switch (length) {
      case 'short':
        wordCount = 100;
        break;
      case 'medium':
        wordCount = 200;
        break;
      case 'long':
        wordCount = 350;
        break;
      default:
        wordCount = 200;
    }
    
    const postResult = await aiService.generateLinkedInPost(topic, style, wordCount);
    
    if (postResult.error) {
      return res.status(500).json({ message: postResult.error });
    }
    
    res.json({ post: postResult.post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Prioritize tasks
const prioritizeTasks = async (req, res) => {
  try {
    const { taskIds, includeCalendar = true } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: 'Task IDs array is required' });
    }
    
    // Get tasks
    const tasks = await Task.find({
      _id: { $in: taskIds },
      owner: req.user.id
    });
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }
    
    // Get calendar events if needed (placeholder - this would integrate with Google Calendar)
    const calendarEvents = includeCalendar ? [] : [];
    
    // Call AI service to prioritize tasks
    const priorityResult = await aiService.suggestTaskPriorities(tasks, calendarEvents);
    
    if (priorityResult.error) {
      return res.status(500).json({ message: priorityResult.error });
    }
    
    res.json(priorityResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Summarize note
const summarizeNote = async (req, res) => {
  try {
    const { noteId, content } = req.body;
    
    let noteContent;
    
    // If noteId is provided, get note from database
    if (noteId) {
      const note = await Note.findOne({
        _id: noteId,
        owner: req.user.id
      });
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      noteContent = note.content;
    } 
    // Otherwise use provided content
    else if (content) {
      noteContent = content;
    } else {
      return res.status(400).json({ message: 'Either noteId or content is required' });
    }
    
    const summaryResult = await aiService.summarizeNote({ content: noteContent });
    
    if (summaryResult.error) {
      return res.status(500).json({ message: summaryResult.error });
    }
    
    // If noteId was provided, update the note with the summary
    if (noteId) {
      await Note.findByIdAndUpdate(noteId, { 
        summary: summaryResult.summary 
      });
    }
    
    res.json({ summary: summaryResult.summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate chat response
const generateChatResponse = async (req, res) => {
  try {
    const { message, history, context, model } = req.body;
    console.log('Chat request received:', { message, model });
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // For testing without authentication
    let userId = "test-user";
    if (req.user && req.user.id) {
      userId = req.user.id;
    }
    
    console.log('Using userId:', userId);
    
    // Add userId to context if not present
    const enhancedContext = {
      ...context,
      userId
    };
    
    const response = await aiService.generateChatResponse(message, history, enhancedContext, model);
    console.log('AI service response:', response.error ? 'Error' : 'Success');
    
    if (response.error) {
      console.error('AI response error:', response.error, response.details || '');
      return res.status(500).json({ message: response.error });
    }
    res.json({ response: response.response });
  } catch (err) {
    console.error('Error in generateChatResponse controller:', err);
    res.status(500).json({ message: 'Server error generating chat response' });
  }
};

// Suggest tasks
const suggestTasks = async (req, res) => {
  try {
    const { userId, context, model } = req.body;
    if (!userId) {
      // Assuming userId comes from auth middleware if not in body
      req.body.userId = req.user.id;
    }
    const suggestions = await aiService.suggestTasks(req.body.userId, context, model);
    if (suggestions.error) {
      return res.status(500).json({ message: suggestions.error });
    }
    res.json({ suggestions: suggestions.suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error suggesting tasks' });
  }
};

// Analyze productivity
const analyzeProductivity = async (req, res) => {
  try {
    const { userId, timeRange, data, model } = req.body;
    if (!userId) {
       req.body.userId = req.user.id;
    }
    if (!timeRange || !data) {
      return res.status(400).json({ message: 'Time range and data are required' });
    }
    const analysis = await aiService.analyzeProductivity(req.body.userId, timeRange, data, model);
    if (analysis.error) {
      return res.status(500).json({ message: analysis.error });
    }
    res.json({ analysis: analysis.analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error analyzing productivity' });
  }
};

// Summarize emails
const summarizeEmails = async (req, res) => {
  try {
    const { emails, maxLength, model } = req.body;
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ message: 'Emails array is required' });
    }
    const summary = await aiService.summarizeEmails(emails, maxLength, model);
    if (summary.error) {
      return res.status(500).json({ message: summary.error });
    }
    res.json({ summary: summary.summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error summarizing emails' });
  }
};

// Generate daily summary
const generateDailySummary = async (req, res) => {
  try {
    const { userId, date, model } = req.body;
     if (!userId) {
       req.body.userId = req.user.id;
    }
    const summary = await aiService.generateDailySummary(req.body.userId, date, model);
    if (summary.error) {
      return res.status(500).json({ message: summary.error });
    }
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating daily summary' });
  }
};

// Get available models
const getAvailableModels = async (req, res) => {
  try {
    const models = aiService.getAvailableModels();
    console.log("Available models:", models); // Debug log
    res.json({ models });
  } catch (err) {
    console.error("Error getting models:", err);
    res.status(500).json({ message: 'Server error fetching available models' });
  }
};

// Get providers status
const getProvidersStatus = async (req, res) => {
  try {
    const providers = aiService.getProvidersStatus();
    console.log("Providers status:", providers); // Debug log
    res.json({ providers });
  } catch (err) {
    console.error("Error getting provider status:", err);
    res.status(500).json({ message: 'Server error fetching provider status' });
  }
};

module.exports = {
  generateEmailReply,
  generateLinkedInPost,
  prioritizeTasks,
  summarizeNote,
  generateChatResponse,
  suggestTasks,
  analyzeProductivity,
  summarizeEmails,
  generateDailySummary,
  getAvailableModels,
  getProvidersStatus
};