require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Note = require('./models/Note');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

// Test creating a user
const testCreateUser = async () => {
  try {
    // Create a test user
    const testUser = new User({
      clerkId: 'test_clerk_id_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });
    
    const savedUser = await testUser.save();
    console.log('Test user created:', savedUser._id);
    return savedUser;
  } catch (error) {
    console.error('Error creating test user:', error.message);
    return null;
  }
};

// Test creating a project
const testCreateProject = async (userId) => {
  try {
    // Create a test project
    const testProject = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      color: '#4f46e5',
      owner: userId
    });
    
    const savedProject = await testProject.save();
    console.log('Test project created:', savedProject._id);
    return savedProject;
  } catch (error) {
    console.error('Error creating test project:', error.message);
    return null;
  }
};

// Test creating a task
const testCreateTask = async (userId, projectId) => {
  try {
    // Create a test task
    const testTask = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      status: 'todo',
      priority: 'medium',
      owner: userId,
      project: projectId
    });
    
    const savedTask = await testTask.save();
    console.log('Test task created:', savedTask._id);
    return savedTask;
  } catch (error) {
    console.error('Error creating test task:', error.message);
    return null;
  }
};

// Test creating a note
const testCreateNote = async (userId, projectId) => {
  try {
    // Create a test note
    const testNote = new Note({
      title: 'Test Note',
      content: 'This is a test note with enough content to potentially generate a summary if we were using the AI service.',
      contentType: 'markdown',
      owner: userId,
      project: projectId,
      tags: ['test', 'demo']
    });
    
    const savedNote = await testNote.save();
    console.log('Test note created:', savedNote._id);
    return savedNote;
  } catch (error) {
    console.error('Error creating test note:', error.message);
    return null;
  }
};

// Clean up test data
const cleanupTestData = async (userId, projectId, taskId, noteId) => {
  try {
    if (noteId) await Note.findByIdAndDelete(noteId);
    if (taskId) await Task.findByIdAndDelete(taskId);
    if (projectId) await Project.findByIdAndDelete(projectId);
    if (userId) await User.findByIdAndDelete(userId);
    console.log('Test data cleaned up');
  } catch (error) {
    console.error('Error cleaning up test data:', error.message);
  }
};

// Run all tests
const runTests = async () => {
  // Connect to the database
  const connected = await connectDB();
  if (!connected) return;
  
  // Run the tests
  try {
    const user = await testCreateUser();
    if (!user) return;
    
    const project = await testCreateProject(user._id);
    if (!project) {
      await cleanupTestData(user._id);
      return;
    }
    
    const task = await testCreateTask(user._id, project._id);
    if (!task) {
      await cleanupTestData(user._id, project._id);
      return;
    }
    
    const note = await testCreateNote(user._id, project._id);
    if (!note) {
      await cleanupTestData(user._id, project._id, task._id);
      return;
    }
    
    console.log('All tests passed successfully!');
    
    // Clean up the test data
    await cleanupTestData(user._id, project._id, task._id, note._id);
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the tests
runTests(); 