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
module.exports = {
  generateEmailReply,
  generateLinkedInPost,
  prioritizeTasks,
  summarizeNote
};