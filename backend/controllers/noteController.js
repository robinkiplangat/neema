const Note = require('../models/Note');
const { validationResult } = require('express-validator');
const aiService = require('../services/aiService');

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, tags, projectId } = req.query;
    
    const query = { owner: req.user.id, isArchived: false };
    
    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Filter by project if provided
    if (projectId) {
      query.project = projectId;
    }
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { updatedAt: -1 },
      populate: 'project'
    };
    
    // Add score if text search is being performed
    if (search) {
      options.sort = { score: { $meta: 'textScore' } };
      options.select = { score: { $meta: 'textScore' } };
    }
    
    const notes = await Note.paginate(query, options);
    
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('project');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Verify ownership
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a note
exports.createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      title,
      content,
      contentType,
      project,
      tags,
      notionId
    } = req.body;
    
    const newNote = new Note({
      title,
      content,
      contentType: contentType || 'markdown',
      owner: req.user.id,
      project,
      tags: tags || [],
      notionId
    });
    
    // Generate summary if content is long enough
    if (content && content.length > 200) {
      try {
        const summaryResult = await aiService.summarizeNote({ content });
        if (!summaryResult.error) {
          newNote.summary = summaryResult.summary;
        }
      } catch (error) {
        console.error('Failed to generate summary:', error);
      }
    }
    
    const note = await newNote.save();
    
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      title,
      content,
      contentType,
      project,
      tags,
      notionId,
      lastSyncedAt
    } = req.body;
    
    let note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Verify ownership
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update fields
    note.title = title || note.title;
    
    // Only update content if it's provided and different
    if (content !== undefined && content !== note.content) {
      note.content = content;
      
      // Generate new summary if content is updated and long enough
      if (content.length > 200) {
        try {
          const summaryResult = await aiService.summarizeNote({ content });
          if (!summaryResult.error) {
            note.summary = summaryResult.summary;
          }
        } catch (error) {
          console.error('Failed to generate summary:', error);
        }
      }
    }
    
    note.contentType = contentType || note.contentType;
    note.project = project || note.project;
    note.tags = tags || note.tags;
    
    if (notionId) note.notionId = notionId;
    if (lastSyncedAt) note.lastSyncedAt = new Date(lastSyncedAt);
    
    const updatedNote = await note.save();
    
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a note (archive it)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Verify ownership
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Soft delete (archive)
    note.isArchived = true;
    await note.save();
    
    res.json({ message: 'Note archived' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Permanently delete a note
exports.permanentlyDeleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Verify ownership
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await note.deleteOne();
    
    res.json({ message: 'Note permanently deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Summarize a note
exports.summarizeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Verify ownership
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const summaryResult = await aiService.summarizeNote(note);
    
    if (summaryResult.error) {
      return res.status(500).json({ message: summaryResult.error });
    }
    
    // Update note with summary
    note.summary = summaryResult.summary;
    await note.save();
    
    res.json({ summary: summaryResult.summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 