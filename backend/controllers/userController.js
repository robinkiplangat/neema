const User = require('../models/User');

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-integrations.notion.accessToken -integrations.gmail.accessToken -integrations.gmail.refreshToken -integrations.linkedin.accessToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const { theme, notificationSettings } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update preferences
    if (theme) user.preferences.theme = theme;
    if (notificationSettings) {
      user.preferences.notificationSettings = {
        ...user.preferences.notificationSettings,
        ...notificationSettings
      };
    }
    
    await user.save();
    
    res.json({ 
      preferences: user.preferences 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Connect integration
const connectIntegration = async (req, res) => {
  try {
    const { service, accessToken, refreshToken } = req.body;
    
    if (!['notion', 'gmail', 'linkedin'].includes(service)) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update integration status
    user.integrations[service] = {
      connected: true,
      accessToken
    };
    
    // Add refresh token if provided (for OAuth 2.0 services like Gmail)
    if (refreshToken && service === 'gmail') {
      user.integrations[service].refreshToken = refreshToken;
    }
    
    await user.save();
    
    res.json({ 
      message: `${service} integration connected successfully`,
      integrations: {
        notion: { connected: user.integrations.notion.connected },
        gmail: { connected: user.integrations.gmail.connected },
        linkedin: { connected: user.integrations.linkedin.connected }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Disconnect integration
const disconnectIntegration = async (req, res) => {
  try {
    const { service } = req.params;
    
    if (!['notion', 'gmail', 'linkedin'].includes(service)) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Reset integration status
    user.integrations[service] = {
      connected: false
    };
    
    // Remove tokens
    if (service === 'notion') {
      user.integrations.notion.accessToken = undefined;
    } else if (service === 'gmail') {
      user.integrations.gmail.accessToken = undefined;
      user.integrations.gmail.refreshToken = undefined;
    } else if (service === 'linkedin') {
      user.integrations.linkedin.accessToken = undefined;
    }
    
    await user.save();
    
    res.json({ 
      message: `${service} integration disconnected successfully`,
      integrations: {
        notion: { connected: user.integrations.notion.connected },
        gmail: { connected: user.integrations.gmail.connected },
        linkedin: { connected: user.integrations.linkedin.connected }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stats
const getUserStats = async (req, res) => {
  try {
    // Import models here to avoid circular dependencies
    const Task = require('../models/Task');
    const Note = require('../models/Note');
    const Project = require('../models/Project');
    
    // Get task stats
    const taskStats = {
      total: await Task.countDocuments({ owner: req.user.id }),
      completed: await Task.countDocuments({ owner: req.user.id, status: 'done' }),
      pending: await Task.countDocuments({ owner: req.user.id, status: { $ne: 'done' } })
    };
    
    // Get note stats
    const noteStats = {
      total: await Note.countDocuments({ owner: req.user.id }),
      withSummary: await Note.countDocuments({ owner: req.user.id, summary: { $exists: true, $ne: null } })
    };
    
    // Get project stats
    const projectStats = {
      total: await Project.countDocuments({ owner: req.user.id }),
      active: await Project.countDocuments({ owner: req.user.id, status: 'active' }),
      completed: await Project.countDocuments({ owner: req.user.id, status: 'completed' })
    };
    
    res.json({
      tasks: taskStats,
      notes: noteStats,
      projects: projectStats,
      integrations: {
        notion: { connected: req.user.integrations?.notion?.connected || false },
        gmail: { connected: req.user.integrations?.gmail?.connected || false },
        linkedin: { connected: req.user.integrations?.linkedin?.connected || false }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 
module.exports = {
  getCurrentUser,
  updatePreferences,
  connectIntegration,
  disconnectIntegration,
  getUserStats
};

