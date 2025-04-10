const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = { 
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    };
    
    if (status) query.status = status;
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: {
        path: 'members.user',
        select: 'firstName lastName profileImageUrl'
      }
    };
    
    const projects = await Project.paginate(query, options);
    
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'members.user',
        select: 'firstName lastName profileImageUrl'
      });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member.user._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a project
exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      name,
      description,
      color,
      status,
      dueDate,
      members
    } = req.body;
    
    const newProject = new Project({
      name,
      description,
      color,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      owner: req.user.id,
      members: members || []
    });
    
    const project = await newProject.save();
    
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      name,
      description,
      color,
      status,
      dueDate,
      members
    } = req.body;
    
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify ownership or admin role
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => 
          member.user.toString() === req.user.id && member.role === 'admin')) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update fields
    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.color = color || project.color;
    project.status = status || project.status;
    project.dueDate = dueDate ? new Date(dueDate) : project.dueDate;
    
    // Only update members if provided and user is owner
    if (members && project.owner.toString() === req.user.id) {
      project.members = members;
    }
    
    const updatedProject = await project.save();
    
    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Verify ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Remove project from tasks
    await Task.updateMany(
      { project: project._id },
      { $unset: { project: 1 } }
    );
    
    // Delete project
    await project.deleteOne();
    
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project tasks
exports.getProjectTasks = async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member.user.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const query = { project: req.params.id };
    
    if (status) query.status = status;
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };
    
    const tasks = await Task.paginate(query, options);
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 