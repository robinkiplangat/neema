const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const aiService = require('../services/aiService');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, projectId } = req.query;
    
    const query = { owner: req.user.id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId) query.project = projectId;
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: 'project'
    };
    
    const tasks = await Task.paginate(query, options);
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project')
      .populate('contextData.relatedNotes');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify ownership
    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      labels
    } = req.body;
    
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      owner: req.user.id,
      project,
      labels
    });
    
    const task = await newTask.save();
    
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      labels
    } = req.body;
    
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify ownership
    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If task is being marked as done, set completedAt
    if (status === 'done' && task.status !== 'done') {
      task.completedAt = new Date();
    }
    
    // If task is being unmarked from done, clear completedAt
    if (status !== 'done' && task.status === 'done') {
      task.completedAt = null;
    }
    
    // Update fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.project = project || task.project;
    task.labels = labels || task.labels;
    
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify ownership
    if (task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await task.deleteOne();
    
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Smart prioritize tasks
exports.prioritizeTasks = async (req, res) => {
  try {
    const { taskIds, includeCalendar = true } = req.body;
    
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